/**
 * DockerExecutor Service
 * 
 * Manages Docker container lifecycle for secure code execution.
 * Creates isolated containers with resource limits and security restrictions,
 * executes code, and ensures proper cleanup.
 * 
 * Security Features:
 * - Network isolation (--network=none)
 * - Memory limits (--memory)
 * - CPU limits (--cpus)
 * - Read-only filesystem with writable /tmp
 * - No sensitive environment variables
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { 
  isWindows, 
  convertWindowsPathToDockerPath,
  normalizeCodeForDocker 
} = require('../utils/windowsCompat');

const execAsync = promisify(exec);

class DockerExecutor {
  constructor() {
    this.platform = os.platform();
    this.isWindows = isWindows();
  }

  /**
   * Create Docker container with security restrictions and resource limits
   * @param {string} dockerImage - Docker image name (e.g., 'gcc:latest')
   * @param {string} workDir - Host working directory path
   * @param {Object} limits - Resource limits
   * @param {number} limits.cpuTime - CPU time limit in milliseconds (default: 10000)
   * @param {number} limits.memory - Memory limit in bytes (default: 256MB)
   * @param {number} limits.timeout - Execution timeout in milliseconds (default: 15000)
   * @returns {Promise<string>} Container ID
   * @throws {Error} If container creation fails
   */
  async createContainer(dockerImage, workDir, limits = {}) {
    const {
      cpuTime = 10000,
      memory = 256 * 1024 * 1024, // 256 MB
      timeout = 15000,
    } = limits;

    try {
      // Convert Windows paths to Docker-compatible format
      const dockerWorkDir = this.isWindows ? convertWindowsPathToDockerPath(workDir) : workDir;
      
      // Memory in MB for Docker
      const memoryMB = Math.floor(memory / (1024 * 1024));
      
      // Create container with security restrictions
      // --network=none: No network access (Requirement 2.2)
      // --memory: Memory limit (Requirement 3.2)
      // --cpus: CPU limit (Requirement 3.1)
      // --read-only: Read-only filesystem (Requirement 2.3)
      // --tmpfs /tmp: Writable temporary directory (Requirement 2.4)
      // -d: Detached mode
      // -w /workspace: Working directory inside container
      // -v: Mount host directory to container
      const createCmd = [
        'docker create',
        '--network=none',
        `--memory=${memoryMB}m`,
        '--cpus=1.0',
        '--read-only',
        '--tmpfs /tmp:rw,exec,size=100m',
        '-w /workspace',
        `-v "${dockerWorkDir}:/workspace"`,
        dockerImage,
        'sleep 3600', // Keep container alive
      ].join(' ');

      console.log(`Creating container with command: ${createCmd}`);
      
      const { stdout, stderr } = await execAsync(createCmd);
      
      if (stderr && !stderr.includes('Unable to find image')) {
        console.warn('Container creation warning:', stderr);
      }
      
      const containerId = stdout.trim();
      
      if (!containerId) {
        throw new Error('Failed to get container ID');
      }

      // Start the container
      await execAsync(`docker start ${containerId}`);
      
      console.log(`Container created and started: ${containerId}`);
      
      return containerId;
    } catch (error) {
      console.error('Failed to create container:', error);
      throw new Error(`Container creation failed: ${error.message}`);
    }
  }

  /**
   * Copy file from host to container
   * @param {string} containerId - Container ID
   * @param {string} sourcePath - Host file path
   * @param {string} destPath - Container file path
   * @returns {Promise<void>}
   * @throws {Error} If copy operation fails
   */
  async copyToContainer(containerId, sourcePath, destPath) {
    try {
      const copyCmd = `docker cp "${sourcePath}" ${containerId}:${destPath}`;
      
      console.log(`Copying file to container: ${sourcePath} -> ${destPath}`);
      
      await execAsync(copyCmd);
      
      console.log('File copied successfully');
    } catch (error) {
      console.error('Failed to copy file to container:', error);
      throw new Error(`File copy failed: ${error.message}`);
    }
  }

  /**
   * Run command in container with input and timeout
   * @param {string} containerId - Container ID
   * @param {string} command - Command to execute
   * @param {string} input - Stdin input for the command
   * @returns {Promise<Object>} Execution result
   * @returns {string} result.stdout - Standard output
   * @returns {string} result.stderr - Standard error
   * @returns {number} result.exitCode - Exit code
   * @returns {number} result.executionTime - Execution time in milliseconds
   * @returns {boolean} result.timedOut - Whether execution timed out
   * @throws {Error} If command execution fails critically
   */
  async runCommand(containerId, command, input = '') {
    const startTime = Date.now();
    
    try {
      // Prepare the exec command
      // Use sh -c to execute the command
      const execCmd = `docker exec -i ${containerId} sh -c "${command.replace(/"/g, '\\"')}"`;
      
      console.log(`Executing command in container: ${command}`);
      
      // Execute with timeout (15 seconds default)
      const timeout = 15000;
      
      const result = await this.executeWithTimeout(execCmd, input, timeout);
      
      const executionTime = Date.now() - startTime;
      
      return {
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        exitCode: result.exitCode || 0,
        executionTime,
        timedOut: result.timedOut || false,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      // Check if it's a timeout
      if (error.killed || error.signal === 'SIGTERM') {
        console.warn('Command execution timed out');
        return {
          stdout: error.stdout || '',
          stderr: error.stderr || 'Execution timed out',
          exitCode: -1,
          executionTime,
          timedOut: true,
        };
      }
      
      // Non-zero exit code is not an error, just capture the output
      if (error.code) {
        return {
          stdout: error.stdout || '',
          stderr: error.stderr || '',
          exitCode: error.code,
          executionTime,
          timedOut: false,
        };
      }
      
      console.error('Command execution failed:', error);
      throw new Error(`Command execution failed: ${error.message}`);
    }
  }

  /**
   * Execute command with timeout and input
   * @private
   * @param {string} command - Command to execute
   * @param {string} input - Stdin input
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<Object>} Execution result
   */
  executeWithTimeout(command, input, timeout) {
    return new Promise((resolve, reject) => {
      const child = exec(command, {
        timeout,
        maxBuffer: 10 * 1024 * 1024, // 10 MB buffer
      }, (error, stdout, stderr) => {
        if (error) {
          // Attach stdout and stderr to error for non-zero exit codes
          error.stdout = stdout;
          error.stderr = stderr;
          reject(error);
        } else {
          resolve({ stdout, stderr, exitCode: 0, timedOut: false });
        }
      });

      // Write input to stdin if provided
      if (input) {
        child.stdin.write(input);
        child.stdin.end();
      }
    });
  }

  /**
   * Destroy container and cleanup resources
   * @param {string} containerId - Container ID
   * @returns {Promise<void>}
   */
  async destroyContainer(containerId) {
    try {
      console.log(`Destroying container: ${containerId}`);
      
      // Stop the container first
      try {
        await execAsync(`docker stop ${containerId}`, { timeout: 5000 });
      } catch (stopError) {
        console.warn('Failed to stop container gracefully, forcing removal:', stopError.message);
      }
      
      // Remove the container
      await execAsync(`docker rm -f ${containerId}`);
      
      console.log('Container destroyed successfully');
    } catch (error) {
      // Log critical error but don't throw - cleanup should be best-effort
      console.error('CRITICAL: Container cleanup failed:', {
        containerId,
        error: error.message,
      });
      
      // Attempt force removal as last resort
      try {
        await execAsync(`docker rm -f ${containerId}`);
        console.log('Container force-removed successfully');
      } catch (forceError) {
        console.error('CRITICAL: Force removal also failed:', forceError.message);
        // Don't throw - we've done our best
      }
    }
  }

  /**
   * Execute code in isolated Docker container (orchestration method)
   * @param {Object} config - Execution configuration
   * @param {string} config.language - Programming language
   * @param {string} config.code - Source code
   * @param {string} config.input - Test case input
   * @param {Object} config.limits - Resource limits
   * @param {string} config.dockerImage - Docker image to use
   * @param {string} config.fileExtension - File extension for the code
   * @param {string} config.compileCommand - Compilation command (if needed)
   * @param {string} config.executeCommand - Execution command
   * @param {boolean} config.requiresCompilation - Whether compilation is needed
   * @returns {Promise<Object>} Execution result
   */
  async executeInContainer(config) {
    const {
      language,
      code,
      input = '',
      limits = {},
      dockerImage,
      fileExtension,
      compileCommand,
      executeCommand,
      requiresCompilation,
    } = config;

    // Create temporary working directory
    const workDir = await this.createTempWorkDir();
    let containerId = null;

    try {
      // Write code to file
      const codeFileName = language === 'Java' ? 'Main.java' : `program${fileExtension}`;
      const codeFilePath = path.join(workDir, codeFileName);
      
      // Normalize code for Docker (convert CRLF to LF)
      const normalizedCode = normalizeCodeForDocker(code);
      await fs.writeFile(codeFilePath, normalizedCode, 'utf8');

      // Create container
      containerId = await this.createContainer(dockerImage, workDir, limits);

      let result = {
        stdout: '',
        stderr: '',
        exitCode: 0,
        executionTime: 0,
        status: 'Success',
      };

      // Compile if needed
      if (requiresCompilation && compileCommand) {
        console.log(`Compiling ${language} code...`);
        const compileResult = await this.runCommand(containerId, compileCommand, '');
        
        if (compileResult.exitCode !== 0) {
          return {
            status: 'Compilation_Error',
            compilationError: compileResult.stderr || compileResult.stdout,
            warnings: compileResult.stdout,
            exitCode: compileResult.exitCode,
            executionTime: compileResult.executionTime,
          };
        }
        
        // Store compilation warnings if any
        if (compileResult.stdout || compileResult.stderr) {
          result.warnings = compileResult.stdout || compileResult.stderr;
        }
      }

      // Execute code
      console.log(`Executing ${language} code...`);
      const execResult = await this.runCommand(containerId, executeCommand, input);

      // Check for timeout
      if (execResult.timedOut) {
        return {
          status: 'Timeout',
          error: 'Execution exceeded time limit',
          executionTime: execResult.executionTime,
          stdout: execResult.stdout,
          stderr: execResult.stderr,
        };
      }

      // Check for runtime error
      if (execResult.exitCode !== 0) {
        return {
          status: 'Runtime_Error',
          error: execResult.stderr || 'Code execution failed',
          exitCode: execResult.exitCode,
          executionTime: execResult.executionTime,
          stdout: execResult.stdout,
          stderr: execResult.stderr,
        };
      }

      // Success
      return {
        status: 'Success',
        stdout: execResult.stdout,
        stderr: execResult.stderr,
        exitCode: execResult.exitCode,
        executionTime: execResult.executionTime,
        warnings: result.warnings,
      };

    } catch (error) {
      console.error('Execution in container failed:', error);
      return {
        status: 'System_Error',
        error: `Code execution system error: ${error.message}`,
        executionTime: 0,
      };
    } finally {
      // Always cleanup container and temp directory
      if (containerId) {
        await this.destroyContainer(containerId);
      }
      
      try {
        await fs.rm(workDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Failed to cleanup temp directory:', cleanupError);
      }
    }
  }

  /**
   * Create temporary working directory
   * @private
   * @returns {Promise<string>} Path to temp directory
   */
  async createTempWorkDir() {
    const tempDir = path.join(os.tmpdir(), `code-exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    await fs.mkdir(tempDir, { recursive: true });
    return tempDir;
  }

  /**
   * Convert Windows path to Docker-compatible format
   * @private
   * @param {string} windowsPath - Windows path
   * @returns {string} Docker-compatible path
   */
  convertWindowsPath(windowsPath) {
    // Convert C:\path\to\dir to /c/path/to/dir
    return windowsPath
      .replace(/\\/g, '/')
      .replace(/^([A-Z]):/, (match, drive) => `/${drive.toLowerCase()}`);
  }
}

module.exports = DockerExecutor;
