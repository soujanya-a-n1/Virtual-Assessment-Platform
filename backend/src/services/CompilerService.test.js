const fc = require('fast-check');
const CompilerService = require('./CompilerService');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Feature: code-compiler, Property 16: Output and error capture
describe('CompilerService - Property-Based Tests', () => {
  let compilerService;

  beforeAll(() => {
    compilerService = new CompilerService();
  });

  afterAll(async () => {
    // Cleanup any lingering containers
    try {
      const { stdout } = await execAsync('docker ps -a --filter "ancestor=python:3.11-alpine" --format "{{.ID}}"');
      const containerIds = stdout.trim().split('\n').filter(id => id);
      
      for (const containerId of containerIds) {
        try {
          await execAsync(`docker rm -f ${containerId}`);
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    } catch (error) {
      // Ignore if no containers found
    }
  });

  // Feature: code-compiler, Property 16: Output and error capture
  test('Property 16: stdout is captured during code execution', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random strings to print
        fc.array(
          fc.string({ minLength: 1, maxLength: 50 }),
          { minLength: 1, maxLength: 10 }
        ),
        async (outputLines) => {
          // Create Python code that prints the generated strings
          const printStatements = outputLines
            .map(line => `print("${line.replace(/"/g, '\\"').replace(/\n/g, '\\n')}")`)
            .join('\n');
          
          const code = printStatements;
          
          // Create temporary working directory
          const fs = require('fs').promises;
          const path = require('path');
          const os = require('os');
          const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'compiler-test-'));
          
          try {
            // Write code to file
            await fs.writeFile(path.join(workDir, 'program.py'), code, 'utf8');
            
            // Execute code
            const result = await compilerService.execute('Python', workDir, '', {
              cpu: 10000,
              memory: 256 * 1024 * 1024,
              timeout: 15000,
            });
            
            // Skip if Docker is not available
            if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
              return;
            }
            
            // Property: stdout should be captured
            expect(result.output).toBeDefined();
            
            // Property: All printed lines should be in the output
            for (const line of outputLines) {
              expect(result.output).toContain(line);
            }
            
            // Property: Execution should succeed
            expect(result.status).toBe('Success');
            expect(result.exitCode).toBe(0);
          } finally {
            // Cleanup working directory
            await fs.rm(workDir, { recursive: true, force: true });
          }
        }
      ),
      { numRuns: 20 } // Reduced runs since Docker operations are slow
    );
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 16: stderr is captured during code execution
  test('Property 16: stderr is captured during code execution', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random error messages
        fc.string({ minLength: 1, maxLength: 50 }),
        async (errorMessage) => {
          // Create Python code that writes to stderr
          const code = `
import sys
sys.stderr.write("${errorMessage.replace(/"/g, '\\"').replace(/\n/g, '\\n')}")
sys.stderr.flush()
sys.exit(1)  # Exit with error code
`;
          
          // Create temporary working directory
          const fs = require('fs').promises;
          const path = require('path');
          const os = require('os');
          const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'compiler-test-'));
          
          try {
            // Write code to file
            await fs.writeFile(path.join(workDir, 'program.py'), code, 'utf8');
            
            // Execute code
            const result = await compilerService.execute('Python', workDir, '', {
              cpu: 10000,
              memory: 256 * 1024 * 1024,
              timeout: 15000,
            });
            
            // Skip if Docker is not available
            if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
              return;
            }
            
            // Property: stderr should be captured in error field
            expect(result.error).toBeDefined();
            expect(result.error).toContain(errorMessage);
            
            // Property: Execution should fail (non-zero exit code)
            expect(result.status).toBe('Runtime_Error');
            expect(result.exitCode).not.toBe(0);
          } finally {
            // Cleanup working directory
            await fs.rm(workDir, { recursive: true, force: true });
          }
        }
      ),
      { numRuns: 20 }
    );
  }, 120000);

  // Feature: code-compiler, Property 16: execution time is measured in milliseconds
  test('Property 16: execution time is measured in milliseconds', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random sleep durations (in milliseconds)
        fc.integer({ min: 100, max: 2000 }),
        async (sleepMs) => {
          // Create Python code that sleeps for the specified duration
          const sleepSeconds = sleepMs / 1000;
          const code = `
import time
time.sleep(${sleepSeconds})
print("Done")
`;
          
          // Create temporary working directory
          const fs = require('fs').promises;
          const path = require('path');
          const os = require('os');
          const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'compiler-test-'));
          
          try {
            // Write code to file
            await fs.writeFile(path.join(workDir, 'program.py'), code, 'utf8');
            
            // Execute code
            const result = await compilerService.execute('Python', workDir, '', {
              cpu: 10000,
              memory: 256 * 1024 * 1024,
              timeout: 15000,
            });
            
            // Skip if Docker is not available
            if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
              return;
            }
            
            // Property: execution time should be defined
            expect(result.executionTime).toBeDefined();
            
            // Property: execution time should be a positive number
            expect(result.executionTime).toBeGreaterThan(0);
            
            // Property: execution time should be in milliseconds
            // It should be at least the sleep duration (with some tolerance for overhead)
            expect(result.executionTime).toBeGreaterThanOrEqual(sleepMs * 0.8);
            
            // Property: execution time should be reasonable (not wildly off)
            // Allow up to 5x the sleep time for Docker overhead
            expect(result.executionTime).toBeLessThan(sleepMs * 5 + 5000);
            
            // Property: Execution should succeed
            expect(result.status).toBe('Success');
          } finally {
            // Cleanup working directory
            await fs.rm(workDir, { recursive: true, force: true });
          }
        }
      ),
      { numRuns: 10 } // Fewer runs since we're actually sleeping
    );
  }, 180000); // 3 minute timeout (some tests sleep for 2 seconds)

  // Feature: code-compiler, Property 16: stdout, stderr, and execution time are all captured together
  test('Property 16: stdout, stderr, and execution time are all captured together', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          stdoutMessage: fc.string({ minLength: 1, maxLength: 30 }),
          stderrMessage: fc.string({ minLength: 1, maxLength: 30 }),
          sleepMs: fc.integer({ min: 50, max: 500 }),
        }),
        async ({ stdoutMessage, stderrMessage, sleepMs }) => {
          // Create Python code that writes to both stdout and stderr, and sleeps
          const sleepSeconds = sleepMs / 1000;
          const code = `
import sys
import time

print("${stdoutMessage.replace(/"/g, '\\"').replace(/\n/g, '\\n')}")
sys.stderr.write("${stderrMessage.replace(/"/g, '\\"').replace(/\n/g, '\\n')}")
sys.stderr.flush()
time.sleep(${sleepSeconds})
print("Done")
`;
          
          // Create temporary working directory
          const fs = require('fs').promises;
          const path = require('path');
          const os = require('os');
          const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'compiler-test-'));
          
          try {
            // Write code to file
            await fs.writeFile(path.join(workDir, 'program.py'), code, 'utf8');
            
            // Execute code
            const result = await compilerService.execute('Python', workDir, '', {
              cpu: 10000,
              memory: 256 * 1024 * 1024,
              timeout: 15000,
            });
            
            // Skip if Docker is not available
            if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
              return;
            }
            
            // Property: stdout should be captured
            expect(result.output).toBeDefined();
            expect(result.output).toContain(stdoutMessage);
            expect(result.output).toContain('Done');
            
            // Property: stderr should be captured
            // Note: stderr is only captured in the error field when exitCode != 0
            // For successful execution, stderr might be in output or separate
            // Since this code succeeds (exit 0), we check output for both
            const allOutput = result.output + (result.error || '');
            expect(allOutput).toContain(stderrMessage);
            
            // Property: execution time should be measured
            expect(result.executionTime).toBeDefined();
            expect(result.executionTime).toBeGreaterThan(0);
            expect(result.executionTime).toBeGreaterThanOrEqual(sleepMs * 0.8);
            
            // Property: Execution should succeed
            expect(result.status).toBe('Success');
            expect(result.exitCode).toBe(0);
          } finally {
            // Cleanup working directory
            await fs.rm(workDir, { recursive: true, force: true });
          }
        }
      ),
      { numRuns: 15 }
    );
  }, 180000);

  // Feature: code-compiler, Property 16: Output capture works for multiple languages
  test('Property 16: Output capture works across different programming languages', async () => {
    const testCases = [
      {
        language: 'Python',
        code: 'print("Hello from Python")',
        expectedOutput: 'Hello from Python',
      },
      {
        language: 'Node.js',
        code: 'console.log("Hello from Node.js");',
        expectedOutput: 'Hello from Node.js',
      },
      {
        language: 'JavaScript',
        code: 'console.log("Hello from JavaScript");',
        expectedOutput: 'Hello from JavaScript',
      },
    ];

    for (const testCase of testCases) {
      // Create temporary working directory
      const fs = require('fs').promises;
      const path = require('path');
      const os = require('os');
      const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'compiler-test-'));
      
      try {
        // Get file extension for language
        const config = compilerService.getLanguageConfig(testCase.language);
        const fileName = `program${config.fileExtension}`;
        
        // Write code to file
        await fs.writeFile(path.join(workDir, fileName), testCase.code, 'utf8');
        
        // Execute code
        const result = await compilerService.execute(testCase.language, workDir, '', {
          cpu: 10000,
          memory: 256 * 1024 * 1024,
          timeout: 15000,
        });
        
        // Skip if Docker is not available
        if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
          console.log(`${testCase.language}: Skipped (Docker not available)`);
          continue;
        }
        
        // Property: stdout should be captured
        expect(result.output).toBeDefined();
        expect(result.output).toContain(testCase.expectedOutput);
        
        // Property: execution time should be measured
        expect(result.executionTime).toBeDefined();
        expect(result.executionTime).toBeGreaterThan(0);
        
        // Property: Execution should succeed
        expect(result.status).toBe('Success');
        expect(result.exitCode).toBe(0);
        
        console.log(`${testCase.language}: Output captured successfully (${result.executionTime}ms)`);
      } finally {
        // Cleanup working directory
        await fs.rm(workDir, { recursive: true, force: true });
      }
    }
  }, 120000);

  // Feature: code-compiler, Property 16: Empty output is captured correctly
  test('Property 16: Empty output is captured correctly', async () => {
    // Create Python code that produces no output
    const code = '# This code produces no output\npass';
    
    // Create temporary working directory
    const fs = require('fs').promises;
    const path = require('path');
    const os = require('os');
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'compiler-test-'));
    
    try {
      // Write code to file
      await fs.writeFile(path.join(workDir, 'program.py'), code, 'utf8');
      
      // Execute code
      const result = await compilerService.execute('Python', workDir, '', {
        cpu: 10000,
        memory: 256 * 1024 * 1024,
        timeout: 15000,
      });
      
      // Skip if Docker is not available
      if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
        return;
      }
      
      // Property: output should be defined (even if empty)
      expect(result.output).toBeDefined();
      
      // Property: output should be empty or whitespace only
      expect(result.output.trim()).toBe('');
      
      // Property: execution time should still be measured
      expect(result.executionTime).toBeDefined();
      expect(result.executionTime).toBeGreaterThan(0);
      
      // Property: Execution should succeed
      expect(result.status).toBe('Success');
      expect(result.exitCode).toBe(0);
    } finally {
      // Cleanup working directory
      await fs.rm(workDir, { recursive: true, force: true });
    }
  }, 120000);

  // Feature: code-compiler, Property 16: Large output is captured (up to limit)
  test('Property 16: Large output is captured correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate number of lines to print (will create large output)
        fc.integer({ min: 100, max: 500 }),
        async (numLines) => {
          // Create Python code that prints many lines
          const code = `
for i in range(${numLines}):
    print(f"Line {i}: This is a test line with some content to make it longer")
`;
          
          // Create temporary working directory
          const fs = require('fs').promises;
          const path = require('path');
          const os = require('os');
          const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'compiler-test-'));
          
          try {
            // Write code to file
            await fs.writeFile(path.join(workDir, 'program.py'), code, 'utf8');
            
            // Execute code
            const result = await compilerService.execute('Python', workDir, '', {
              cpu: 10000,
              memory: 256 * 1024 * 1024,
              timeout: 15000,
            });
            
            // Skip if Docker is not available
            if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
              return;
            }
            
            // Property: output should be captured
            expect(result.output).toBeDefined();
            
            // Property: output should contain some of the printed lines
            expect(result.output).toContain('Line 0:');
            
            // Property: execution time should be measured
            expect(result.executionTime).toBeDefined();
            expect(result.executionTime).toBeGreaterThan(0);
            
            // Property: Execution should succeed
            expect(result.status).toBe('Success');
            expect(result.exitCode).toBe(0);
          } finally {
            // Cleanup working directory
            await fs.rm(workDir, { recursive: true, force: true });
          }
        }
      ),
      { numRuns: 10 }
    );
  }, 120000);
});

  // Feature: code-compiler, Property 18: Output size limiting
  test('Property 18: Output exceeding 10,000 chars is truncated with indicator', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate number of characters to output (some below, at, and above limit)
        fc.integer({ min: 5000, max: 50000 }),
        async (outputSize) => {
          // Create Python code that prints exactly outputSize characters
          // Use a simple repeating pattern to make it predictable
          const code = `
# Generate exactly ${outputSize} characters of output
output_size = ${outputSize}
# Print 'X' characters to reach the target size
print('X' * output_size, end='')
`;
          
          // Create temporary working directory
          const fs = require('fs').promises;
          const path = require('path');
          const os = require('os');
          const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'compiler-test-'));
          
          try {
            // Write code to file
            await fs.writeFile(path.join(workDir, 'program.py'), code, 'utf8');
            
            // Execute code
            const result = await compilerService.execute('Python', workDir, '', {
              cpu: 10000,
              memory: 256 * 1024 * 1024,
              timeout: 15000,
            });
            
            // Skip if Docker is not available
            if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
              return;
            }
            
            // Property: Execution should succeed
            expect(result.status).toBe('Success');
            
            // Property: Output should be defined
            expect(result.output).toBeDefined();
            
            if (outputSize <= 10000) {
              // Property: Output under or at limit should not be truncated
              expect(result.output.length).toBe(outputSize);
              expect(result.output).not.toContain('[Output truncated');
              
              // Property: Output should contain all the X characters
              expect(result.output).toBe('X'.repeat(outputSize));
            } else {
              // Property: Output exceeding limit should be truncated to 10,000 chars + indicator
              expect(result.output.length).toBeGreaterThan(10000);
              expect(result.output.length).toBeLessThan(10200); // 10000 + truncation message
              
              // Property: Truncation indicator should be present
              expect(result.output).toContain('[Output truncated - exceeded 10,000 character limit]');
              
              // Property: First 10,000 characters should be the original output
              const firstPart = result.output.substring(0, 10000);
              expect(firstPart).toBe('X'.repeat(10000));
              
              // Property: After 10,000 chars, should have truncation indicator
              const afterLimit = result.output.substring(10000);
              expect(afterLimit).toContain('[Output truncated');
            }
          } finally {
            // Cleanup working directory
            await fs.rm(workDir, { recursive: true, force: true });
          }
        }
      ),
      { numRuns: 30 } // Test various output sizes
    );
  }, 180000); // 3 minute timeout (some tests generate large output)

  // Feature: code-compiler, Property 18: Output size limiting - exact boundary test
  test('Property 18: Output at exactly 10,000 chars is not truncated', async () => {
    // Test the exact boundary condition
    const exactSize = 10000;
    const code = `print('X' * ${exactSize}, end='')`;
    
    // Create temporary working directory
    const fs = require('fs').promises;
    const path = require('path');
    const os = require('os');
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'compiler-test-'));
    
    try {
      // Write code to file
      await fs.writeFile(path.join(workDir, 'program.py'), code, 'utf8');
      
      // Execute code
      const result = await compilerService.execute('Python', workDir, '', {
        cpu: 10000,
        memory: 256 * 1024 * 1024,
        timeout: 15000,
      });
      
      // Skip if Docker is not available
      if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
        console.log('Boundary test: Skipped (Docker not available)');
        return;
      }
      
      // Property: Execution should succeed
      expect(result.status).toBe('Success');
      
      // Property: Output should be exactly 10,000 characters (no truncation)
      expect(result.output.length).toBe(10000);
      
      // Property: No truncation indicator should be present
      expect(result.output).not.toContain('[Output truncated');
      
      // Property: Output should be all X characters
      expect(result.output).toBe('X'.repeat(10000));
      
      console.log('Boundary test: Output at exactly 10,000 chars is not truncated');
    } finally {
      // Cleanup working directory
      await fs.rm(workDir, { recursive: true, force: true });
    }
  }, 120000);

  // Feature: code-compiler, Property 18: Output size limiting - just over boundary
  test('Property 18: Output at 10,001 chars is truncated', async () => {
    // Test just over the boundary
    const overSize = 10001;
    const code = `print('X' * ${overSize}, end='')`;
    
    // Create temporary working directory
    const fs = require('fs').promises;
    const path = require('path');
    const os = require('os');
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'compiler-test-'));
    
    try {
      // Write code to file
      await fs.writeFile(path.join(workDir, 'program.py'), code, 'utf8');
      
      // Execute code
      const result = await compilerService.execute('Python', workDir, '', {
        cpu: 10000,
        memory: 256 * 1024 * 1024,
        timeout: 15000,
      });
      
      // Skip if Docker is not available
      if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
        console.log('Over boundary test: Skipped (Docker not available)');
        return;
      }
      
      // Property: Execution should succeed
      expect(result.status).toBe('Success');
      
      // Property: Output should be truncated (more than 10,000 but less than 10,200)
      expect(result.output.length).toBeGreaterThan(10000);
      expect(result.output.length).toBeLessThan(10200);
      
      // Property: Truncation indicator should be present
      expect(result.output).toContain('[Output truncated - exceeded 10,000 character limit]');
      
      // Property: First 10,000 characters should be the original output
      const firstPart = result.output.substring(0, 10000);
      expect(firstPart).toBe('X'.repeat(10000));
      
      console.log(`Over boundary test: Output of ${overSize} chars truncated to ${result.output.length} chars`);
    } finally {
      // Cleanup working directory
      await fs.rm(workDir, { recursive: true, force: true });
    }
  }, 120000);

  // Feature: code-compiler, Property 18: Output size limiting - multi-line output
  test('Property 18: Multi-line output exceeding limit is truncated correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate number of lines that will exceed the limit
        fc.integer({ min: 200, max: 1000 }),
        async (numLines) => {
          // Each line is about 50 chars, so 200+ lines will exceed 10,000 chars
          const code = `
for i in range(${numLines}):
    print(f"Line {i:04d}: This is a test line with some content to make it longer")
`;
          
          // Create temporary working directory
          const fs = require('fs').promises;
          const path = require('path');
          const os = require('os');
          const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'compiler-test-'));
          
          try {
            // Write code to file
            await fs.writeFile(path.join(workDir, 'program.py'), code, 'utf8');
            
            // Execute code
            const result = await compilerService.execute('Python', workDir, '', {
              cpu: 10000,
              memory: 256 * 1024 * 1024,
              timeout: 15000,
            });
            
            // Skip if Docker is not available
            if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
              return;
            }
            
            // Property: Execution should succeed
            expect(result.status).toBe('Success');
            
            // Property: Output should be defined
            expect(result.output).toBeDefined();
            
            // Calculate expected output size (approximately)
            const lineLength = "Line 0000: This is a test line with some content to make it longer\n".length;
            const expectedSize = numLines * lineLength;
            
            if (expectedSize <= 10000) {
              // Property: Output should not be truncated
              expect(result.output).not.toContain('[Output truncated');
              
              // Property: Should contain first and last lines
              expect(result.output).toContain('Line 0000:');
              expect(result.output).toContain(`Line ${String(numLines - 1).padStart(4, '0')}:`);
            } else {
              // Property: Output should be truncated
              expect(result.output).toContain('[Output truncated - exceeded 10,000 character limit]');
              
              // Property: Output length should be limited
              expect(result.output.length).toBeGreaterThan(10000);
              expect(result.output.length).toBeLessThan(10200);
              
              // Property: Should contain first lines but not last lines
              expect(result.output).toContain('Line 0000:');
              // Last line should not be present (truncated before reaching it)
              expect(result.output).not.toContain(`Line ${String(numLines - 1).padStart(4, '0')}:`);
            }
          } finally {
            // Cleanup working directory
            await fs.rm(workDir, { recursive: true, force: true });
          }
        }
      ),
      { numRuns: 20 }
    );
  }, 180000);

  // Feature: code-compiler, Property 18: Output size limiting - works for all languages
  test('Property 18: Output size limiting works across different languages', async () => {
    const testCases = [
      {
        language: 'Python',
        code: 'print("X" * 15000, end="")',
        expectedTruncation: true,
      },
      {
        language: 'Node.js',
        code: 'process.stdout.write("X".repeat(15000));',
        expectedTruncation: true,
      },
      {
        language: 'JavaScript',
        code: 'console.log("X".repeat(15000));',
        expectedTruncation: true,
      },
      {
        language: 'Python',
        code: 'print("X" * 5000, end="")',
        expectedTruncation: false,
      },
    ];

    for (const testCase of testCases) {
      // Create temporary working directory
      const fs = require('fs').promises;
      const path = require('path');
      const os = require('os');
      const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'compiler-test-'));
      
      try {
        // Get file extension for language
        const config = compilerService.getLanguageConfig(testCase.language);
        const fileName = `program${config.fileExtension}`;
        
        // Write code to file
        await fs.writeFile(path.join(workDir, fileName), testCase.code, 'utf8');
        
        // Execute code
        const result = await compilerService.execute(testCase.language, workDir, '', {
          cpu: 10000,
          memory: 256 * 1024 * 1024,
          timeout: 15000,
        });
        
        // Skip if Docker is not available
        if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
          console.log(`${testCase.language}: Skipped (Docker not available)`);
          continue;
        }
        
        // Property: Execution should succeed
        expect(result.status).toBe('Success');
        
        if (testCase.expectedTruncation) {
          // Property: Output should be truncated
          expect(result.output).toContain('[Output truncated - exceeded 10,000 character limit]');
          expect(result.output.length).toBeGreaterThan(10000);
          expect(result.output.length).toBeLessThan(10200);
          
          console.log(`${testCase.language}: Large output truncated correctly (${result.output.length} chars)`);
        } else {
          // Property: Output should not be truncated
          expect(result.output).not.toContain('[Output truncated');
          
          console.log(`${testCase.language}: Small output not truncated (${result.output.length} chars)`);
        }
      } finally {
        // Cleanup working directory
        await fs.rm(workDir, { recursive: true, force: true });
      }
    }
  }, 180000);

  // Feature: code-compiler, Property 18: Output size limiting - preserves truncation indicator format
  test('Property 18: Truncation indicator has correct format and placement', async () => {
    // Generate large output
    const code = 'print("Y" * 20000, end="")';
    
    // Create temporary working directory
    const fs = require('fs').promises;
    const path = require('path');
    const os = require('os');
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'compiler-test-'));
    
    try {
      // Write code to file
      await fs.writeFile(path.join(workDir, 'program.py'), code, 'utf8');
      
      // Execute code
      const result = await compilerService.execute('Python', workDir, '', {
        cpu: 10000,
        memory: 256 * 1024 * 1024,
        timeout: 15000,
      });
      
      // Skip if Docker is not available
      if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
        console.log('Truncation format test: Skipped (Docker not available)');
        return;
      }
      
      // Property: Execution should succeed
      expect(result.status).toBe('Success');
      
      // Property: Truncation indicator should be present
      expect(result.output).toContain('[Output truncated - exceeded 10,000 character limit]');
      
      // Property: Truncation indicator should be at the end
      expect(result.output.endsWith('[Output truncated - exceeded 10,000 character limit]')).toBe(true);
      
      // Property: Truncation indicator should be preceded by newlines
      expect(result.output).toMatch(/\n\n\[Output truncated - exceeded 10,000 character limit\]$/);
      
      // Property: First 10,000 characters should be the original output (all Y's)
      const firstPart = result.output.substring(0, 10000);
      expect(firstPart).toBe('Y'.repeat(10000));
      
      console.log('Truncation format test: Indicator format is correct');
    } finally {
      // Cleanup working directory
      await fs.rm(workDir, { recursive: true, force: true });
    }
  }, 120000);
});
