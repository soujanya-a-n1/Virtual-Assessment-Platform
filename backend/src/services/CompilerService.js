/**
 * CompilerService
 * 
 * Orchestrates code compilation, execution, and grading workflow.
 * Manages the interaction between DockerExecutor, language configuration,
 * and provides methods for compiling and executing code submissions.
 * 
 * Requirements: 1.9, 5.1, 5.2, 5.6, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 14.2, 14.3, 14.4
 */

const DockerExecutor = require('./DockerExecutor');
const { getLanguageConfig } = require('../config/languageConfig');
const { normalizeCodeForDocker } = require('../utils/windowsCompat');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class CompilerService {
  constructor() {
    this.dockerExecutor = new DockerExecutor();
    this.logger = console; // Using console for logging, can be replaced with proper logger
  }

  /**
   * Compile code (for compiled languages)
   * @param {string} language - Programming language
   * @param {string} code - Source code
   * @param {string} workDir - Working directory path
   * @returns {Promise<Object>} Compilation result {success, errors, warnings}
   */
  async compile(language, code, workDir) {
    try {
      // Get language configuration
      const config = getLanguageConfig(language);
      
      // Check if compilation is required
      if (!config.requiresCompilation) {
        return {
          success: true,
          errors: '',
          warnings: '',
        };
      }

      // Write code to file with correct extension
      const fileName = language === 'Java' ? 'Main.java' : `program${config.fileExtension}`;
      const filePath = path.join(workDir, fileName);
      await fs.writeFile(filePath, code, 'utf8');

      // Create container for compilation
      const containerId = await this.dockerExecutor.createContainer(
        config.dockerImage,
        workDir,
        { cpuTime: 10000, memory: 256 * 1024 * 1024, timeout: 15000 }
      );

      try {
        // Execute compile command in Docker container
        const compileResult = await this.dockerExecutor.runCommand(
          containerId,
          config.compileCommand,
          ''
        );

        // Capture stdout (warnings) and stderr (errors)
        const errors = compileResult.stderr || '';
        const warnings = compileResult.stdout || '';

        // Return compilation result
        if (compileResult.exitCode !== 0) {
          this.logger.error('Compilation failed', {
            language,
            exitCode: compileResult.exitCode,
            errors,
          });

          return {
            success: false,
            errors,
            warnings,
          };
        }

        return {
          success: true,
          errors: '',
          warnings,
        };
      } finally {
        // Always cleanup container
        await this.dockerExecutor.destroyContainer(containerId);
      }
    } catch (error) {
      this.logger.error('Compilation error', { language, error: error.message });
      return {
        success: false,
        errors: `Compilation system error: ${error.message}`,
        warnings: '',
      };
    }
  }

  /**
   * Execute code in Docker container with input
   * @param {string} language - Programming language
   * @param {string} executablePath - Path to executable/script (working directory)
   * @param {string} input - Test case input
   * @param {Object} limits - Resource limits {cpu, memory, timeout}
   * @returns {Promise<Object>} Execution result {output, error, exitCode, executionTime, status}
   */
  async execute(language, executablePath, input, limits = {}) {
    let containerId = null;
    
    try {
      // Get language configuration
      const config = getLanguageConfig(language);
      
      // Set default limits
      const resourceLimits = {
        cpuTime: limits.cpu || 10000,
        memory: limits.memory || 256 * 1024 * 1024,
        timeout: limits.timeout || 15000,
      };

      // Create container
      containerId = await this.dockerExecutor.createContainer(
        config.dockerImage,
        executablePath,
        resourceLimits
      );

      // Execute code in Docker container with input via stdin
      const execResult = await this.dockerExecutor.runCommand(
        containerId,
        config.executeCommand,
        input
      );

      // Capture stdout, stderr, exit code, execution time
      let output = execResult.stdout || '';
      const error = execResult.stderr || '';
      const exitCode = execResult.exitCode;
      const executionTime = execResult.executionTime;

      // Handle timeouts
      if (execResult.timedOut) {
        this.logger.warn('Execution timeout', {
          language,
          executionTime,
          resourceLimits,
        });

        return {
          output: this.limitOutputSize(output),
          error: 'Execution exceeded time limit',
          exitCode: -1,
          executionTime,
          status: 'Timeout',
        };
      }

      // Handle resource limit errors (check stderr for memory errors)
      if (error.includes('memory') || error.includes('out of memory') || error.includes('OOM')) {
        this.logger.warn('Memory limit exceeded', {
          language,
          executionTime,
          error,
        });

        return {
          output: this.limitOutputSize(output),
          error: 'Code exceeded memory limit',
          exitCode,
          executionTime,
          status: 'Memory_Limit_Exceeded',
        };
      }

      // Handle runtime errors (non-zero exit code)
      if (exitCode !== 0) {
        this.logger.info('Runtime error', {
          language,
          exitCode,
          error,
        });

        return {
          output: this.limitOutputSize(output),
          error: error || 'Code execution failed',
          exitCode,
          executionTime,
          status: 'Runtime_Error',
        };
      }

      // Success - limit output size
      output = this.limitOutputSize(output);

      return {
        output,
        error: '',
        exitCode: 0,
        executionTime,
        status: 'Success',
      };
    } catch (error) {
      this.logger.error('Execution failed', {
        language,
        error: error.message,
      });

      return {
        output: '',
        error: `Execution system error: ${error.message}`,
        exitCode: -1,
        executionTime: 0,
        status: 'System_Error',
      };
    } finally {
      // Always cleanup container
      if (containerId) {
        await this.dockerExecutor.destroyContainer(containerId);
      }
    }
  }

  /**
   * Limit output size to prevent memory issues
   * @private
   * @param {string} output - Raw output
   * @returns {string} Limited output with truncation indicator if needed
   */
  limitOutputSize(output) {
    const MAX_OUTPUT_SIZE = 10000;
    
    if (output.length > MAX_OUTPUT_SIZE) {
      return output.substring(0, MAX_OUTPUT_SIZE) + '\n\n[Output truncated - exceeded 10,000 character limit]';
    }
    
    return output;
  }

  /**
   * Get language-specific configuration
   * @param {string} language - Programming language
   * @returns {Object} Language config {dockerImage, compileCmd, executeCmd, fileExtension}
   */
  getLanguageConfig(language) {
    return getLanguageConfig(language);
  }
}

module.exports = CompilerService;
