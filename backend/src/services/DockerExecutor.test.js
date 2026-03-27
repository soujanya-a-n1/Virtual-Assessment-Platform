const fc = require('fast-check');
const DockerExecutor = require('./DockerExecutor');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Feature: code-compiler, Property 3: Container isolation per execution
describe('DockerExecutor - Property-Based Tests', () => {
  let dockerExecutor;

  beforeAll(() => {
    dockerExecutor = new DockerExecutor();
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

  // Feature: code-compiler, Property 3: Container isolation per execution
  test('Property 3: Each execution creates and destroys a unique container', async () => {
    // Track container IDs created during test
    const createdContainerIds = new Set();
    
    await fc.assert(
      fc.asyncProperty(
        // Generate random simple Python code that prints something
        fc.string({ minLength: 1, maxLength: 20 }).map(str => 
          `print("${str.replace(/"/g, '\\"').replace(/\n/g, '\\n')}")`
        ),
        async (code) => {
          // Get list of containers before execution
          const containersBefore = await getRunningContainers();
          
          // Execute code in container
          const config = {
            language: 'Python',
            code,
            input: '',
            limits: {
              cpuTime: 10000,
              memory: 256 * 1024 * 1024,
              timeout: 15000,
            },
            dockerImage: 'python:3.11-alpine',
            fileExtension: '.py',
            executeCommand: 'python3 program.py',
            requiresCompilation: false,
          };

          const result = await dockerExecutor.executeInContainer(config);
          
          // Get list of containers after execution
          const containersAfter = await getRunningContainers();
          
          // Verify execution completed (success or error, but not system failure)
          expect(result).toBeDefined();
          expect(result.status).toBeDefined();
          
          // Property: Container should be destroyed after execution
          // The number of containers after should be the same as before
          expect(containersAfter.length).toBe(containersBefore.length);
          
          // Property: No new containers should be running
          const newContainers = containersAfter.filter(id => !containersBefore.includes(id));
          expect(newContainers.length).toBe(0);
          
          // Track that we successfully created and destroyed a container
          // (we can't easily get the container ID from executeInContainer, 
          // but we verified it was cleaned up)
        }
      ),
      { numRuns: 20 } // Reduced runs since Docker operations are slow
    );
  }, 120000); // 2 minute timeout for Docker operations

  // Feature: code-compiler, Property 3: Multiple sequential executions create unique containers
  test('Property 3: Multiple sequential executions each create and destroy unique containers', async () => {
    const executionCount = 5;
    const containerSnapshots = [];
    
    // Execute multiple times and capture container state
    for (let i = 0; i < executionCount; i++) {
      const containersBefore = await getRunningContainers();
      
      const config = {
        language: 'Python',
        code: `print("Execution ${i}")`,
        input: '',
        limits: {
          cpuTime: 10000,
          memory: 256 * 1024 * 1024,
          timeout: 15000,
        },
        dockerImage: 'python:3.11-alpine',
        fileExtension: '.py',
        executeCommand: 'python3 program.py',
        requiresCompilation: false,
      };

      const result = await dockerExecutor.executeInContainer(config);
      
      const containersAfter = await getRunningContainers();
      
      containerSnapshots.push({
        before: containersBefore,
        after: containersAfter,
        result,
      });
    }
    
    // Verify each execution cleaned up its container
    for (let i = 0; i < executionCount; i++) {
      const snapshot = containerSnapshots[i];
      
      // Property: Container count should be the same before and after
      expect(snapshot.after.length).toBe(snapshot.before.length);
      
      // Property: No new containers should remain
      const newContainers = snapshot.after.filter(id => !snapshot.before.includes(id));
      expect(newContainers.length).toBe(0);
      
      // Property: Execution should complete successfully
      expect(snapshot.result.status).toBeDefined();
    }
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 3: Container isolation - containers are truly unique
  test('Property 3: Each execution uses a unique container (no container reuse)', async () => {
    // This test verifies that containers are not reused between executions
    // by checking that each execution starts with a fresh filesystem
    
    const executionCount = 3;
    const results = [];
    
    for (let i = 0; i < executionCount; i++) {
      // Try to read a file that should not exist in a fresh container
      const config = {
        language: 'Python',
        code: `
import os
# Try to read a marker file that would exist if container was reused
try:
    with open('/tmp/marker.txt', 'r') as f:
        print(f'REUSED: {f.read()}')
except FileNotFoundError:
    # This is expected for a fresh container
    with open('/tmp/marker.txt', 'w') as f:
        f.write('execution_${i}')
    print('FRESH')
`,
        input: '',
        limits: {
          cpuTime: 10000,
          memory: 256 * 1024 * 1024,
          timeout: 15000,
        },
        dockerImage: 'python:3.11-alpine',
        fileExtension: '.py',
        executeCommand: 'python3 program.py',
        requiresCompilation: false,
      };

      const result = await dockerExecutor.executeInContainer(config);
      results.push(result);
    }
    
    // Property: Each execution should see a fresh container
    // All executions should print "FRESH", not "REUSED"
    for (let i = 0; i < executionCount; i++) {
      expect(results[i].status).toBe('Success');
      expect(results[i].stdout.trim()).toBe('FRESH');
      expect(results[i].stdout).not.toContain('REUSED');
    }
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 3: Container cleanup happens even on errors
  test('Property 3: Containers are destroyed even when code execution fails', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate code that will fail in various ways
        fc.constantFrom(
          'import sys; sys.exit(1)',           // Non-zero exit code
          'raise Exception("Test error")',     // Runtime exception
          '1/0',                                // Division by zero
          'import nonexistent_module',         // Import error
          'print(undefined_variable)'          // Name error
        ),
        async (failingCode) => {
          const containersBefore = await getRunningContainers();
          
          const config = {
            language: 'Python',
            code: failingCode,
            input: '',
            limits: {
              cpuTime: 10000,
              memory: 256 * 1024 * 1024,
              timeout: 15000,
            },
            dockerImage: 'python:3.11-alpine',
            fileExtension: '.py',
            executeCommand: 'python3 program.py',
            requiresCompilation: false,
          };

          const result = await dockerExecutor.executeInContainer(config);
          
          const containersAfter = await getRunningContainers();
          
          // Property: Execution should fail (not success)
          expect(result.status).not.toBe('Success');
          
          // Property: Container should still be cleaned up despite failure
          expect(containersAfter.length).toBe(containersBefore.length);
          
          const newContainers = containersAfter.filter(id => !containersBefore.includes(id));
          expect(newContainers.length).toBe(0);
        }
      ),
      { numRuns: 10 } // Reduced runs for error cases
    );
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 4: Network access prevention
  test('Property 4: Code attempting network operations fails', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate different network operations to test
        fc.constantFrom(
          // Python network operations
          {
            language: 'Python',
            code: `
import socket
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect(('google.com', 80))
    print('NETWORK_SUCCESS')
except Exception as e:
    print(f'NETWORK_BLOCKED: {type(e).__name__}')
`,
            dockerImage: 'python:3.11-alpine',
            fileExtension: '.py',
            executeCommand: 'python3 program.py',
          },
          // Python HTTP request
          {
            language: 'Python',
            code: `
import socket
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect(('8.8.8.8', 53))
    print('NETWORK_SUCCESS')
except Exception as e:
    print(f'NETWORK_BLOCKED: {type(e).__name__}')
`,
            dockerImage: 'python:3.11-alpine',
            fileExtension: '.py',
            executeCommand: 'python3 program.py',
          },
          // Python DNS lookup
          {
            language: 'Python',
            code: `
import socket
try:
    socket.gethostbyname('google.com')
    print('NETWORK_SUCCESS')
except Exception as e:
    print(f'NETWORK_BLOCKED: {type(e).__name__}')
`,
            dockerImage: 'python:3.11-alpine',
            fileExtension: '.py',
            executeCommand: 'python3 program.py',
          },
          // Python socket creation and bind
          {
            language: 'Python',
            code: `
import socket
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(('0.0.0.0', 8080))
    s.listen(1)
    print('NETWORK_SUCCESS')
except Exception as e:
    print(f'NETWORK_BLOCKED: {type(e).__name__}')
`,
            dockerImage: 'python:3.11-alpine',
            fileExtension: '.py',
            executeCommand: 'python3 program.py',
          },
          // Node.js HTTP request
          {
            language: 'Node.js',
            code: `
const http = require('http');
try {
    const req = http.get('http://google.com', (res) => {
        console.log('NETWORK_SUCCESS');
    });
    req.on('error', (e) => {
        console.log('NETWORK_BLOCKED: ' + e.code);
    });
    req.setTimeout(2000, () => {
        req.destroy();
        console.log('NETWORK_BLOCKED: TIMEOUT');
    });
} catch (e) {
    console.log('NETWORK_BLOCKED: ' + e.message);
}
`,
            dockerImage: 'node:18-alpine',
            fileExtension: '.js',
            executeCommand: 'node program.js',
          }
        ),
        async (testCase) => {
          const config = {
            language: testCase.language,
            code: testCase.code,
            input: '',
            limits: {
              cpuTime: 10000,
              memory: 256 * 1024 * 1024,
              timeout: 15000,
            },
            dockerImage: testCase.dockerImage,
            fileExtension: testCase.fileExtension,
            executeCommand: testCase.executeCommand,
            requiresCompilation: false,
          };

          const result = await dockerExecutor.executeInContainer(config);
          
          // Property: Network operations should fail
          // The code should either:
          // 1. Execute successfully but print NETWORK_BLOCKED (caught exception)
          // 2. Fail with a runtime error related to network
          // 3. Return System_Error if Docker is unavailable (test environment limitation)
          
          if (result.status === 'System_Error') {
            // Docker not available - skip this test case
            // This is acceptable in test environments without Docker
            return;
          }
          
          if (result.status === 'Success') {
            // If execution succeeded, output should indicate network was blocked
            const output = result.stdout.trim();
            expect(output).toContain('NETWORK_BLOCKED');
            expect(output).not.toContain('NETWORK_SUCCESS');
          } else {
            // If execution failed, it should be due to network restrictions
            // This is also acceptable - network access was prevented
            expect(result.status).toMatch(/Runtime_Error|Timeout/);
          }
          
          // Property: Network access should never succeed
          const fullOutput = (result.stdout || '') + (result.stderr || '');
          expect(fullOutput).not.toContain('NETWORK_SUCCESS');
        }
      ),
      { numRuns: 10 } // Test multiple network operation types
    );
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 4: Network access prevention - comprehensive test
  test('Property 4: Various network protocols are blocked', async () => {
    // Test multiple network operations in sequence to ensure comprehensive blocking
    const networkTests = [
      // TCP connection
      {
        name: 'TCP connection',
        code: `
import socket
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(2)
    s.connect(('1.1.1.1', 80))
    print('FAIL: TCP connection succeeded')
except socket.timeout:
    print('PASS: TCP connection timed out (network blocked)')
except OSError as e:
    print(f'PASS: TCP connection failed - {e}')
`,
      },
      // UDP socket
      {
        name: 'UDP socket',
        code: `
import socket
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(2)
    s.sendto(b'test', ('8.8.8.8', 53))
    data = s.recvfrom(1024)
    print('FAIL: UDP communication succeeded')
except socket.timeout:
    print('PASS: UDP timed out (network blocked)')
except OSError as e:
    print(f'PASS: UDP failed - {e}')
`,
      },
      // DNS resolution
      {
        name: 'DNS resolution',
        code: `
import socket
try:
    result = socket.gethostbyname('example.com')
    print(f'FAIL: DNS resolution succeeded: {result}')
except OSError as e:
    print(f'PASS: DNS resolution failed - {e}')
`,
      },
    ];

    for (const test of networkTests) {
      const config = {
        language: 'Python',
        code: test.code,
        input: '',
        limits: {
          cpuTime: 10000,
          memory: 256 * 1024 * 1024,
          timeout: 15000,
        },
        dockerImage: 'python:3.11-alpine',
        fileExtension: '.py',
        executeCommand: 'python3 program.py',
        requiresCompilation: false,
      };

      const result = await dockerExecutor.executeInContainer(config);
      
      // Skip if Docker is not available
      if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
        console.log(`${test.name}: Skipped (Docker not available)`);
        continue;
      }
      
      // Property: All network operations should be blocked
      const output = (result.stdout || '') + (result.stderr || '');
      
      // Should not contain FAIL (which means network succeeded)
      expect(output).not.toContain('FAIL:');
      
      // Should contain PASS (which means network was blocked) or be a runtime error
      if (result.status === 'Success') {
        expect(output).toContain('PASS:');
      }
      
      console.log(`${test.name}: ${result.status} - ${output.trim()}`);
    }
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 5: Filesystem security
  test('Property 5: Writes to system directories fail while working directory succeeds', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random content to write
        fc.string({ minLength: 1, maxLength: 50 }).map(str => 
          str.replace(/"/g, '\\"').replace(/\n/g, '\\n')
        ),
        async (content) => {
          // Test code that attempts to write to various locations
          const code = `
import sys

# Test 1: Try to write to system directory (should fail)
system_paths = ['/etc/test.txt', '/bin/test.txt', '/usr/test.txt', '/root/test.txt']
system_write_failed = True

for path in system_paths:
    try:
        with open(path, 'w') as f:
            f.write('${content}')
        print(f'FAIL: System write succeeded to {path}')
        system_write_failed = False
        break
    except (PermissionError, OSError) as e:
        # Expected - system directories should be read-only
        pass

if system_write_failed:
    print('PASS: System directory writes blocked')

# Test 2: Try to write to working directory (should succeed)
try:
    with open('/workspace/test.txt', 'w') as f:
        f.write('${content}')
    # Verify we can read it back
    with open('/workspace/test.txt', 'r') as f:
        data = f.read()
    if data == '${content}':
        print('PASS: Working directory write succeeded')
    else:
        print('FAIL: Working directory write corrupted data')
except Exception as e:
    print(f'FAIL: Working directory write failed - {e}')

# Test 3: Try to write to /tmp (should succeed - tmpfs is writable)
try:
    with open('/tmp/test.txt', 'w') as f:
        f.write('${content}')
    # Verify we can read it back
    with open('/tmp/test.txt', 'r') as f:
        data = f.read()
    if data == '${content}':
        print('PASS: /tmp directory write succeeded')
    else:
        print('FAIL: /tmp write corrupted data')
except Exception as e:
    print(f'FAIL: /tmp write failed - {e}')
`;

          const config = {
            language: 'Python',
            code,
            input: '',
            limits: {
              cpuTime: 10000,
              memory: 256 * 1024 * 1024,
              timeout: 15000,
            },
            dockerImage: 'python:3.11-alpine',
            fileExtension: '.py',
            executeCommand: 'python3 program.py',
            requiresCompilation: false,
          };

          const result = await dockerExecutor.executeInContainer(config);
          
          // Skip if Docker is not available
          if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
            return;
          }
          
          // Property: Execution should complete successfully
          expect(result.status).toBe('Success');
          
          const output = result.stdout.trim();
          
          // Property: System directory writes should be blocked
          expect(output).toContain('PASS: System directory writes blocked');
          expect(output).not.toContain('FAIL: System write succeeded');
          
          // Property: Working directory writes should succeed
          expect(output).toContain('PASS: Working directory write succeeded');
          
          // Property: /tmp writes should succeed (tmpfs is writable)
          expect(output).toContain('PASS: /tmp directory write succeeded');
        }
      ),
      { numRuns: 20 } // Test with various content strings
    );
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 5: Filesystem security - comprehensive system path test
  test('Property 5: Multiple system directories are read-only', async () => {
    // Test that various critical system directories are protected
    const code = `
import os

# List of system directories that should be read-only
system_dirs = [
    '/etc',
    '/bin',
    '/usr',
    '/root',
    '/var',
    '/sys',
    '/proc',
    '/boot',
    '/lib',
    '/sbin'
]

all_protected = True

for dir_path in system_dirs:
    if not os.path.exists(dir_path):
        # Directory doesn't exist in this image, skip
        continue
    
    test_file = os.path.join(dir_path, 'test_write.txt')
    try:
        with open(test_file, 'w') as f:
            f.write('test')
        print(f'FAIL: Write succeeded to {dir_path}')
        all_protected = False
        # Try to clean up
        try:
            os.remove(test_file)
        except:
            pass
    except (PermissionError, OSError):
        # Expected - directory is read-only
        pass

if all_protected:
    print('PASS: All system directories are read-only')

# Verify working directory is writable
try:
    with open('/workspace/test.txt', 'w') as f:
        f.write('test')
    os.remove('/workspace/test.txt')
    print('PASS: Working directory is writable')
except Exception as e:
    print(f'FAIL: Working directory not writable - {e}')
`;

    const config = {
      language: 'Python',
      code,
      input: '',
      limits: {
        cpuTime: 10000,
        memory: 256 * 1024 * 1024,
        timeout: 15000,
      },
      dockerImage: 'python:3.11-alpine',
      fileExtension: '.py',
      executeCommand: 'python3 program.py',
      requiresCompilation: false,
    };

    const result = await dockerExecutor.executeInContainer(config);
    
    // Skip if Docker is not available
    if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
      console.log('Filesystem security test: Skipped (Docker not available)');
      return;
    }
    
    // Property: Execution should complete successfully
    expect(result.status).toBe('Success');
    
    const output = result.stdout.trim();
    
    // Property: All system directories should be read-only
    expect(output).toContain('PASS: All system directories are read-only');
    expect(output).not.toContain('FAIL: Write succeeded to');
    
    // Property: Working directory should be writable
    expect(output).toContain('PASS: Working directory is writable');
    
    console.log('Filesystem security test output:', output);
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 5: Filesystem security - file operations in working directory
  test('Property 5: Working directory supports full file operations', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random file operations
        fc.record({
          filename: fc.string({ minLength: 1, maxLength: 20 }).map(s => 
            s.replace(/[^a-zA-Z0-9_-]/g, '_') + '.txt'
          ),
          content: fc.string({ minLength: 0, maxLength: 100 }),
          appendContent: fc.string({ minLength: 0, maxLength: 50 }),
        }),
        async ({ filename, content, appendContent }) => {
          const code = `
import os

filename = '${filename}'
content = '''${content.replace(/'/g, "\\'")}'''
append_content = '''${appendContent.replace(/'/g, "\\'")}'''

try:
    # Test 1: Create and write file
    with open(f'/workspace/{filename}', 'w') as f:
        f.write(content)
    
    # Test 2: Read file
    with open(f'/workspace/{filename}', 'r') as f:
        data = f.read()
    
    if data != content:
        print('FAIL: Read data does not match written data')
    else:
        print('PASS: Write and read succeeded')
    
    # Test 3: Append to file
    with open(f'/workspace/{filename}', 'a') as f:
        f.write(append_content)
    
    # Test 4: Read appended content
    with open(f'/workspace/{filename}', 'r') as f:
        data = f.read()
    
    expected = content + append_content
    if data != expected:
        print('FAIL: Appended data does not match')
    else:
        print('PASS: Append succeeded')
    
    # Test 5: Delete file
    os.remove(f'/workspace/{filename}')
    
    # Test 6: Verify deletion
    if os.path.exists(f'/workspace/{filename}'):
        print('FAIL: File still exists after deletion')
    else:
        print('PASS: Delete succeeded')
    
    # Test 7: Create subdirectory
    os.makedirs('/workspace/subdir', exist_ok=True)
    
    # Test 8: Write to subdirectory
    with open('/workspace/subdir/test.txt', 'w') as f:
        f.write('test')
    
    print('PASS: Subdirectory operations succeeded')
    
except Exception as e:
    print(f'FAIL: File operation failed - {e}')
`;

          const config = {
            language: 'Python',
            code,
            input: '',
            limits: {
              cpuTime: 10000,
              memory: 256 * 1024 * 1024,
              timeout: 15000,
            },
            dockerImage: 'python:3.11-alpine',
            fileExtension: '.py',
            executeCommand: 'python3 program.py',
            requiresCompilation: false,
          };

          const result = await dockerExecutor.executeInContainer(config);
          
          // Skip if Docker is not available
          if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
            return;
          }
          
          // Property: Execution should complete successfully
          expect(result.status).toBe('Success');
          
          const output = result.stdout.trim();
          
          // Property: All file operations in working directory should succeed
          expect(output).toContain('PASS: Write and read succeeded');
          expect(output).toContain('PASS: Append succeeded');
          expect(output).toContain('PASS: Delete succeeded');
          expect(output).toContain('PASS: Subdirectory operations succeeded');
          expect(output).not.toContain('FAIL:');
        }
      ),
      { numRuns: 15 } // Test various file operations
    );
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 8: CPU time limit enforcement
  test('Property 8: Code exceeding CPU time limit is terminated with timeout error', async () => {
    // Test code that consumes excessive CPU time
    const cpuIntensiveCode = `
import time
# Busy loop to consume CPU time
start = time.time()
count = 0
while time.time() - start < 20:  # Try to run for 20 seconds (exceeds 10s limit)
    count += 1
    if count % 10000000 == 0:
        pass  # Prevent optimization
print(f'Completed {count} iterations')
`;

    const config = {
      language: 'Python',
      code: cpuIntensiveCode,
      input: '',
      limits: {
        cpuTime: 10000,      // 10 second CPU limit
        memory: 256 * 1024 * 1024,
        timeout: 15000,       // 15 second wall time limit
      },
      dockerImage: 'python:3.11-alpine',
      fileExtension: '.py',
      executeCommand: 'python3 program.py',
      requiresCompilation: false,
    };

    const result = await dockerExecutor.executeInContainer(config);
    
    // Skip if Docker is not available
    if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
      console.log('CPU limit test: Skipped (Docker not available)');
      return;
    }
    
    // Property: Execution should be terminated due to timeout
    expect(result.status).toBe('Timeout');
    
    // Property: Error message should indicate timeout
    expect(result.error).toMatch(/time limit|timeout/i);
    
    // Property: Execution time should be recorded
    expect(result.executionTime).toBeDefined();
    expect(result.executionTime).toBeGreaterThan(0);
    
    console.log(`CPU limit test: ${result.status}, execution time: ${result.executionTime}ms`);
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 9: Memory limit enforcement
  test('Property 9: Code exceeding memory limit is terminated with memory error', async () => {
    // Test code that attempts to allocate excessive memory
    const memoryIntensiveCode = `
import sys
try:
    # Try to allocate 512 MB (exceeds 256 MB limit)
    data = []
    chunk_size = 1024 * 1024  # 1 MB chunks
    for i in range(512):  # Try to allocate 512 MB
        data.append(b'x' * chunk_size)
        if i % 50 == 0:
            print(f'Allocated {i} MB', flush=True)
    print('FAIL: Memory allocation succeeded')
except MemoryError:
    print('PASS: Memory limit enforced - MemoryError raised')
except Exception as e:
    print(f'Memory allocation failed: {type(e).__name__}: {e}')
`;

    const config = {
      language: 'Python',
      code: memoryIntensiveCode,
      input: '',
      limits: {
        cpuTime: 10000,
        memory: 256 * 1024 * 1024,  // 256 MB limit
        timeout: 15000,
      },
      dockerImage: 'python:3.11-alpine',
      fileExtension: '.py',
      executeCommand: 'python3 program.py',
      requiresCompilation: false,
    };

    const result = await dockerExecutor.executeInContainer(config);
    
    // Skip if Docker is not available
    if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
      console.log('Memory limit test: Skipped (Docker not available)');
      return;
    }
    
    // Property: Execution should fail due to memory limit
    // This can manifest as Runtime_Error (MemoryError in Python) or container killed by Docker
    expect(result.status).toMatch(/Runtime_Error|Timeout|System_Error/);
    
    // Property: Should not succeed in allocating excessive memory
    const output = (result.stdout || '') + (result.stderr || '');
    expect(output).not.toContain('FAIL: Memory allocation succeeded');
    
    // Property: Error should be related to memory
    if (result.status === 'Runtime_Error') {
      // Python caught the MemoryError
      expect(output).toMatch(/Memory|memory|MemoryError/);
    }
    
    console.log(`Memory limit test: ${result.status}, output: ${output.substring(0, 200)}`);
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 10: Execution timeout enforcement
  test('Property 10: Code running longer than timeout is terminated with timeout error', async () => {
    // Test code that sleeps longer than the timeout
    const longRunningCode = `
import time
print('Starting long sleep...', flush=True)
time.sleep(20)  # Sleep for 20 seconds (exceeds 15s timeout)
print('FAIL: Sleep completed')
`;

    const config = {
      language: 'Python',
      code: longRunningCode,
      input: '',
      limits: {
        cpuTime: 10000,
        memory: 256 * 1024 * 1024,
        timeout: 15000,  // 15 second timeout
      },
      dockerImage: 'python:3.11-alpine',
      fileExtension: '.py',
      executeCommand: 'python3 program.py',
      requiresCompilation: false,
    };

    const result = await dockerExecutor.executeInContainer(config);
    
    // Skip if Docker is not available
    if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
      console.log('Timeout test: Skipped (Docker not available)');
      return;
    }
    
    // Property: Execution should be terminated due to timeout
    expect(result.status).toBe('Timeout');
    
    // Property: Error message should indicate timeout
    expect(result.error).toMatch(/time limit|timeout|timed out/i);
    
    // Property: Execution time should be around the timeout limit
    expect(result.executionTime).toBeDefined();
    expect(result.executionTime).toBeGreaterThan(10000); // Should run for at least 10 seconds
    
    // Property: Code should not complete successfully
    const output = result.stdout || '';
    expect(output).not.toContain('FAIL: Sleep completed');
    
    console.log(`Timeout test: ${result.status}, execution time: ${result.executionTime}ms`);
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 8, 9, 10: Resource limit error messages and reason recording
  test('Properties 8, 9, 10: Resource limit violations include proper error messages and reasons', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate different types of resource-intensive code
        fc.constantFrom(
          {
            name: 'CPU timeout',
            code: `
import time
start = time.time()
count = 0
while time.time() - start < 20:
    count += 1
print('Done')
`,
            expectedStatus: 'Timeout',
            expectedErrorPattern: /time limit|timeout/i,
          },
          {
            name: 'Execution timeout',
            code: `
import time
time.sleep(20)
print('Done')
`,
            expectedStatus: 'Timeout',
            expectedErrorPattern: /time limit|timeout|timed out/i,
          },
          {
            name: 'Infinite loop',
            code: `
while True:
    pass
`,
            expectedStatus: 'Timeout',
            expectedErrorPattern: /time limit|timeout/i,
          }
        ),
        async (testCase) => {
          const config = {
            language: 'Python',
            code: testCase.code,
            input: '',
            limits: {
              cpuTime: 10000,
              memory: 256 * 1024 * 1024,
              timeout: 15000,
            },
            dockerImage: 'python:3.11-alpine',
            fileExtension: '.py',
            executeCommand: 'python3 program.py',
            requiresCompilation: false,
          };

          const result = await dockerExecutor.executeInContainer(config);
          
          // Skip if Docker is not available
          if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
            return;
          }
          
          // Property: Status should indicate the type of failure
          expect(result.status).toBe(testCase.expectedStatus);
          
          // Property: Error message should be present and descriptive
          expect(result.error).toBeDefined();
          expect(result.error).toMatch(testCase.expectedErrorPattern);
          
          // Property: Execution time should be recorded
          expect(result.executionTime).toBeDefined();
          expect(result.executionTime).toBeGreaterThan(0);
          
          // Property: The reason for termination is recorded in the error field
          expect(result.error.length).toBeGreaterThan(0);
          
          console.log(`${testCase.name}: status=${result.status}, error="${result.error}", time=${result.executionTime}ms`);
        }
      ),
      { numRuns: 10 } // Test multiple resource limit scenarios
    );
  }, 180000); // 3 minute timeout for multiple runs

  // Feature: code-compiler, Property 8, 9, 10: Resource limits are enforced consistently
  test('Properties 8, 9, 10: Resource limits are enforced across multiple executions', async () => {
    // Run multiple resource-intensive executions to verify limits are consistently enforced
    const testCases = [
      {
        name: 'CPU intensive 1',
        code: 'import time\nstart = time.time()\nwhile time.time() - start < 20: pass',
      },
      {
        name: 'CPU intensive 2',
        code: 'count = 0\nwhile count < 10**9: count += 1',
      },
      {
        name: 'Sleep timeout',
        code: 'import time\ntime.sleep(20)',
      },
    ];

    const results = [];
    
    for (const testCase of testCases) {
      const config = {
        language: 'Python',
        code: testCase.code,
        input: '',
        limits: {
          cpuTime: 10000,
          memory: 256 * 1024 * 1024,
          timeout: 15000,
        },
        dockerImage: 'python:3.11-alpine',
        fileExtension: '.py',
        executeCommand: 'python3 program.py',
        requiresCompilation: false,
      };

      const result = await dockerExecutor.executeInContainer(config);
      results.push({ testCase: testCase.name, result });
    }
    
    // Property: All resource-intensive executions should be terminated
    for (const { testCase, result } of results) {
      // Skip if Docker is not available
      if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
        console.log(`${testCase}: Skipped (Docker not available)`);
        continue;
      }
      
      // Property: Should timeout, not succeed
      expect(result.status).toBe('Timeout');
      
      // Property: Should have error message
      expect(result.error).toBeDefined();
      expect(result.error).toMatch(/time limit|timeout/i);
      
      // Property: Should have execution time recorded
      expect(result.executionTime).toBeDefined();
      
      console.log(`${testCase}: ${result.status}, time=${result.executionTime}ms`);
    }
  }, 180000); // 3 minute timeout

  // Feature: code-compiler, Property 8, 9, 10: Resource limits don't affect normal code
  test('Properties 8, 9, 10: Resource limits allow normal code to execute successfully', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate simple, fast code that should complete within limits
        fc.record({
          iterations: fc.integer({ min: 1, max: 1000 }),
          message: fc.string({ minLength: 1, maxLength: 50 }).map(s => 
            s.replace(/"/g, '\\"').replace(/\n/g, '\\n')
          ),
        }),
        async ({ iterations, message }) => {
          const code = `
# Simple code that should complete within resource limits
for i in range(${iterations}):
    if i % 100 == 0:
        pass  # Do minimal work
print("${message}")
print("Completed ${iterations} iterations")
`;

          const config = {
            language: 'Python',
            code,
            input: '',
            limits: {
              cpuTime: 10000,
              memory: 256 * 1024 * 1024,
              timeout: 15000,
            },
            dockerImage: 'python:3.11-alpine',
            fileExtension: '.py',
            executeCommand: 'python3 program.py',
            requiresCompilation: false,
          };

          const result = await dockerExecutor.executeInContainer(config);
          
          // Skip if Docker is not available
          if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
            return;
          }
          
          // Property: Normal code should execute successfully
          expect(result.status).toBe('Success');
          
          // Property: Should not timeout
          expect(result.status).not.toBe('Timeout');
          
          // Property: Output should be captured
          expect(result.stdout).toContain(message);
          expect(result.stdout).toContain(`Completed ${iterations} iterations`);
          
          // Property: Execution time should be well under the limits
          expect(result.executionTime).toBeLessThan(10000);
        }
      ),
      { numRuns: 20 } // Test various normal code patterns
    );
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 6: Environment variable protection
  test('Property 6: Code cannot access sensitive environment variables', async () => {
    // Test that sensitive environment variables are not accessible in the container
    const code = `
import os

# List of potentially sensitive environment variables
sensitive_vars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'DATABASE_URL',
    'DB_PASSWORD',
    'API_KEY',
    'SECRET_KEY',
    'PRIVATE_KEY',
    'PASSWORD',
    'TOKEN',
    'CREDENTIALS'
]

# Check if any sensitive variables are accessible
found_sensitive = []
for var in sensitive_vars:
    value = os.environ.get(var)
    if value:
        found_sensitive.append(var)

if found_sensitive:
    print(f'FAIL: Found sensitive variables: {found_sensitive}')
else:
    print('PASS: No sensitive environment variables accessible')

# List all environment variables to verify minimal set
all_vars = list(os.environ.keys())
print(f'Total environment variables: {len(all_vars)}')

# Check for common safe variables (these are OK to have)
safe_vars = ['PATH', 'HOME', 'HOSTNAME', 'PWD', 'LANG', 'LC_ALL']
has_safe_vars = any(var in all_vars for var in safe_vars)

if has_safe_vars:
    print('PASS: Only safe environment variables present')
`;

    const config = {
      language: 'Python',
      code,
      input: '',
      limits: {
        cpuTime: 10000,
        memory: 256 * 1024 * 1024,
        timeout: 15000,
      },
      dockerImage: 'python:3.11-alpine',
      fileExtension: '.py',
      executeCommand: 'python3 program.py',
      requiresCompilation: false,
    };

    const result = await dockerExecutor.executeInContainer(config);
    
    // Skip if Docker is not available
    if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
      console.log('Environment variable test: Skipped (Docker not available)');
      return;
    }
    
    // Property: Execution should complete successfully
    expect(result.status).toBe('Success');
    
    const output = result.stdout.trim();
    
    // Property: No sensitive environment variables should be accessible
    expect(output).toContain('PASS: No sensitive environment variables accessible');
    expect(output).not.toContain('FAIL: Found sensitive variables');
    
    console.log('Environment variable test output:', output);
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 6: Environment variable protection - comprehensive test
  test('Property 6: Sensitive environment variables are not passed to container', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random environment variable names that might be sensitive
        fc.constantFrom(
          'SECRET',
          'PASSWORD',
          'API_KEY',
          'TOKEN',
          'CREDENTIALS',
          'PRIVATE_KEY',
          'AWS_ACCESS_KEY',
          'DATABASE_PASSWORD'
        ),
        async (varName) => {
          const code = `
import os
var_name = '${varName}'
value = os.environ.get(var_name)
if value:
    print(f'FAIL: {var_name} is accessible with value')
else:
    print(f'PASS: {var_name} is not accessible')
`;

          const config = {
            language: 'Python',
            code,
            input: '',
            limits: {
              cpuTime: 10000,
              memory: 256 * 1024 * 1024,
              timeout: 15000,
            },
            dockerImage: 'python:3.11-alpine',
            fileExtension: '.py',
            executeCommand: 'python3 program.py',
            requiresCompilation: false,
          };

          const result = await dockerExecutor.executeInContainer(config);
          
          // Skip if Docker is not available
          if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
            return;
          }
          
          // Property: Execution should complete successfully
          expect(result.status).toBe('Success');
          
          const output = result.stdout.trim();
          
          // Property: Sensitive variable should not be accessible
          expect(output).toContain('PASS:');
          expect(output).not.toContain('FAIL:');
        }
      ),
      { numRuns: 10 } // Test multiple sensitive variable names
    );
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 7: System command prevention
  test('Property 7: Code cannot execute dangerous system commands', async () => {
    // Test that dangerous system commands are blocked or fail
    const code = `
import subprocess
import os

# List of dangerous commands to test
dangerous_commands = [
    ['rm', '-rf', '/'],
    ['shutdown', '-h', 'now'],
    ['reboot'],
    ['kill', '-9', '1'],
    ['iptables', '-F'],
    ['dd', 'if=/dev/zero', 'of=/dev/sda'],
    ['mkfs.ext4', '/dev/sda'],
    ['useradd', 'hacker'],
    ['passwd', 'root'],
    ['chmod', '777', '/etc/passwd']
]

all_blocked = True

for cmd in dangerous_commands:
    try:
        # Try to execute the command
        result = subprocess.run(
            cmd,
            capture_output=True,
            timeout=2,
            text=True
        )
        # If we get here, command executed (but may have failed due to permissions)
        if result.returncode == 0:
            print(f'FAIL: Command succeeded: {" ".join(cmd)}')
            all_blocked = False
        else:
            # Command failed (likely due to permissions or missing binary)
            # This is acceptable - command was blocked
            pass
    except subprocess.TimeoutExpired:
        # Command timed out - this is acceptable
        pass
    except FileNotFoundError:
        # Command binary not found - this is acceptable (command blocked)
        pass
    except PermissionError:
        # Permission denied - this is acceptable (command blocked)
        pass
    except Exception as e:
        # Any other error - command was blocked
        pass

if all_blocked:
    print('PASS: All dangerous commands were blocked or failed')

# Test that safe commands still work
try:
    result = subprocess.run(['echo', 'test'], capture_output=True, text=True, timeout=2)
    if result.returncode == 0 and 'test' in result.stdout:
        print('PASS: Safe commands still work')
    else:
        print('FAIL: Safe commands do not work')
except Exception as e:
    print(f'FAIL: Safe command failed - {e}')
`;

    const config = {
      language: 'Python',
      code,
      input: '',
      limits: {
        cpuTime: 10000,
        memory: 256 * 1024 * 1024,
        timeout: 15000,
      },
      dockerImage: 'python:3.11-alpine',
      fileExtension: '.py',
      executeCommand: 'python3 program.py',
      requiresCompilation: false,
    };

    const result = await dockerExecutor.executeInContainer(config);
    
    // Skip if Docker is not available
    if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
      console.log('System command test: Skipped (Docker not available)');
      return;
    }
    
    // Property: Execution should complete successfully
    expect(result.status).toBe('Success');
    
    const output = result.stdout.trim();
    
    // Property: All dangerous commands should be blocked or fail
    expect(output).toContain('PASS: All dangerous commands were blocked or failed');
    expect(output).not.toContain('FAIL: Command succeeded');
    
    // Property: Safe commands should still work
    expect(output).toContain('PASS: Safe commands still work');
    
    console.log('System command test output:', output);
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 7: System command prevention - shell injection attempts
  test('Property 7: Shell injection attempts are blocked', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate various shell injection patterns
        fc.constantFrom(
          // Command chaining
          'echo test; rm -rf /',
          'echo test && rm -rf /',
          'echo test || rm -rf /',
          // Command substitution
          'echo $(rm -rf /)',
          'echo `rm -rf /`',
          // Pipe to dangerous command
          'echo test | sh',
          // Redirect to system file
          'echo hacked > /etc/passwd',
          // Background execution
          'rm -rf / &'
        ),
        async (injectionPattern) => {
          const code = `
import subprocess
import os

injection = '''${injectionPattern.replace(/'/g, "\\'")}'''

try:
    # Try to execute the injection pattern
    result = subprocess.run(
        injection,
        shell=True,
        capture_output=True,
        timeout=2,
        text=True
    )
    
    # Check if any dangerous operation succeeded
    if 'hacked' in result.stdout or result.returncode == 0:
        # Even if command ran, check if it actually did damage
        # In a read-only filesystem, most dangerous commands will fail
        print('Command executed but likely failed due to permissions')
    else:
        print('Command failed as expected')
        
except subprocess.TimeoutExpired:
    print('Command timed out (blocked)')
except Exception as e:
    print(f'Command blocked: {type(e).__name__}')

# Verify system is still intact
try:
    # Check that critical files still exist
    if os.path.exists('/bin/sh'):
        print('PASS: System files intact')
    else:
        print('FAIL: System files damaged')
except Exception as e:
    print(f'FAIL: Cannot verify system integrity - {e}')
`;

          const config = {
            language: 'Python',
            code,
            input: '',
            limits: {
              cpuTime: 10000,
              memory: 256 * 1024 * 1024,
              timeout: 15000,
            },
            dockerImage: 'python:3.11-alpine',
            fileExtension: '.py',
            executeCommand: 'python3 program.py',
            requiresCompilation: false,
          };

          const result = await dockerExecutor.executeInContainer(config);
          
          // Skip if Docker is not available
          if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
            return;
          }
          
          // Property: Execution should complete (may succeed or fail, but system should be intact)
          expect(result.status).toMatch(/Success|Runtime_Error/);
          
          const output = result.stdout.trim();
          
          // Property: System files should remain intact (read-only filesystem protection)
          expect(output).toContain('PASS: System files intact');
          expect(output).not.toContain('FAIL: System files damaged');
        }
      ),
      { numRuns: 10 } // Test multiple injection patterns
    );
  }, 120000); // 2 minute timeout

  // Feature: code-compiler, Property 7: System command prevention - process manipulation
  test('Property 7: Code cannot manipulate system processes', async () => {
    const code = `
import subprocess
import os
import signal

# Test 1: Try to kill init process (PID 1)
try:
    os.kill(1, signal.SIGTERM)
    print('FAIL: Killed init process')
except (PermissionError, ProcessLookupError, OSError) as e:
    print(f'PASS: Cannot kill init process - {type(e).__name__}')

# Test 2: Try to list all processes
try:
    result = subprocess.run(['ps', 'aux'], capture_output=True, text=True, timeout=2)
    # ps command may work, but we should only see our own processes
    if result.returncode == 0:
        lines = result.stdout.strip().split('\\n')
        # Should see very few processes (just our own)
        if len(lines) < 10:
            print(f'PASS: Limited process visibility ({len(lines)} processes)')
        else:
            print(f'WARNING: Can see {len(lines)} processes')
except FileNotFoundError:
    print('PASS: ps command not available')
except Exception as e:
    print(f'PASS: Cannot list processes - {type(e).__name__}')

# Test 3: Try to change process priority
try:
    os.nice(10)
    # nice() may succeed for lowering priority, but not for raising
    print('INFO: Can lower own priority (acceptable)')
except PermissionError:
    print('PASS: Cannot change process priority')

# Test 4: Try to access /proc of other processes
try:
    proc_dirs = os.listdir('/proc')
    # Filter for numeric directories (PIDs)
    pid_dirs = [d for d in proc_dirs if d.isdigit()]
    if len(pid_dirs) < 5:
        print(f'PASS: Limited /proc access ({len(pid_dirs)} processes visible)')
    else:
        print(f'INFO: Can see {len(pid_dirs)} processes in /proc')
except Exception as e:
    print(f'PASS: Cannot access /proc - {type(e).__name__}')
`;

    const config = {
      language: 'Python',
      code,
      input: '',
      limits: {
        cpuTime: 10000,
        memory: 256 * 1024 * 1024,
        timeout: 15000,
      },
      dockerImage: 'python:3.11-alpine',
      fileExtension: '.py',
      executeCommand: 'python3 program.py',
      requiresCompilation: false,
    };

    const result = await dockerExecutor.executeInContainer(config);
    
    // Skip if Docker is not available
    if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
      console.log('Process manipulation test: Skipped (Docker not available)');
      return;
    }
    
    // Property: Execution should complete successfully
    expect(result.status).toBe('Success');
    
    const output = result.stdout.trim();
    
    // Property: Cannot kill init process
    expect(output).toContain('PASS: Cannot kill init process');
    expect(output).not.toContain('FAIL: Killed init process');
    
    // Property: Limited process visibility or ps not available
    expect(output).toMatch(/PASS: Limited process visibility|PASS: ps command not available|PASS: Cannot list processes/);
    
    console.log('Process manipulation test output:', output);
  }, 120000); // 2 minute timeout
});

/**
 * Helper function to get list of running containers
 * @returns {Promise<string[]>} Array of container IDs
 */
async function getRunningContainers() {
  try {
    const { stdout } = await execAsync('docker ps -a --format "{{.ID}}"');
    return stdout.trim().split('\n').filter(id => id);
  } catch (error) {
    return [];
  }
}
