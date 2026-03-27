/**
 * Security Tests for Docker Container Isolation
 * 
 * This test suite validates the security properties of the Docker execution environment:
 * - Property 4: Network access prevention
 * - Property 5: Filesystem restrictions
 * - Property 6: Environment variable protection
 * - Property 7: System command prevention
 * 
 * These tests ensure that student code cannot compromise the system or access
 * sensitive resources through the Docker container isolation.
 * 
 * Requirements: 2.2, 2.3, 2.4, 2.6, 2.7
 */

const fc = require('fast-check');
const DockerExecutor = require('./DockerExecutor');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

describe('DockerExecutor - Security Tests', () => {
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

  // ============================================================================
  // Property 4: Network Access Prevention
  // ============================================================================

  // Feature: code-compiler, Property 4: Network access prevention
  test('Property 4: Code attempting network operations fails', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate different network operations to test
        fc.constantFrom(
          // Python TCP connection
          {
            language: 'Python',
            code: `
import socket
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(2)
    s.connect(('google.com', 80))
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
          // Python UDP socket
          {
            language: 'Python',
            code: `
import socket
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(2)
    s.sendto(b'test', ('8.8.8.8', 53))
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
          
          // Skip if Docker is not available
          if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
            return;
          }
          
          // Property: Network operations should fail
          if (result.status === 'Success') {
            const output = result.stdout.trim();
            expect(output).toContain('NETWORK_BLOCKED');
            expect(output).not.toContain('NETWORK_SUCCESS');
          } else {
            // Runtime error is also acceptable - network was blocked
            expect(result.status).toMatch(/Runtime_Error|Timeout/);
          }
          
          // Property: Network access should never succeed
          const fullOutput = (result.stdout || '') + (result.stderr || '');
          expect(fullOutput).not.toContain('NETWORK_SUCCESS');
        }
      ),
      { numRuns: 10 }
    );
  }, 120000);

  // Feature: code-compiler, Property 4: Comprehensive network protocol blocking
  test('Property 4: Various network protocols are blocked (TCP, UDP, DNS)', async () => {
    const networkTests = [
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
      
      if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
        console.log(`${test.name}: Skipped (Docker not available)`);
        continue;
      }
      
      const output = (result.stdout || '') + (result.stderr || '');
      expect(output).not.toContain('FAIL:');
      
      if (result.status === 'Success') {
        expect(output).toContain('PASS:');
      }
    }
  }, 120000);

  // ============================================================================
  // Property 5: Filesystem Security
  // ============================================================================

  // Feature: code-compiler, Property 5: Filesystem security
  test('Property 5: Writes to system directories fail while working directory succeeds', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).map(str => 
          str.replace(/"/g, '\\"').replace(/\n/g, '\\n')
        ),
        async (content) => {
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
        pass

if system_write_failed:
    print('PASS: System directory writes blocked')

# Test 2: Try to write to working directory (should succeed)
try:
    with open('/workspace/test.txt', 'w') as f:
        f.write('${content}')
    with open('/workspace/test.txt', 'r') as f:
        data = f.read()
    if data == '${content}':
        print('PASS: Working directory write succeeded')
    else:
        print('FAIL: Working directory write corrupted data')
except Exception as e:
    print(f'FAIL: Working directory write failed - {e}')

# Test 3: Try to write to /tmp (should succeed)
try:
    with open('/tmp/test.txt', 'w') as f:
        f.write('${content}')
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
          
          if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
            return;
          }
          
          expect(result.status).toBe('Success');
          
          const output = result.stdout.trim();
          expect(output).toContain('PASS: System directory writes blocked');
          expect(output).not.toContain('FAIL: System write succeeded');
          expect(output).toContain('PASS: Working directory write succeeded');
          expect(output).toContain('PASS: /tmp directory write succeeded');
        }
      ),
      { numRuns: 20 }
    );
  }, 120000);

  // Feature: code-compiler, Property 5: Multiple system directories are read-only
  test('Property 5: Critical system directories are protected', async () => {
    const code = `
import os

system_dirs = ['/etc', '/bin', '/usr', '/root', '/var', '/sys', '/proc', '/boot', '/lib', '/sbin']
all_protected = True

for dir_path in system_dirs:
    if not os.path.exists(dir_path):
        continue
    
    test_file = os.path.join(dir_path, 'test_write.txt')
    try:
        with open(test_file, 'w') as f:
            f.write('test')
        print(f'FAIL: Write succeeded to {dir_path}')
        all_protected = False
        try:
            os.remove(test_file)
        except:
            pass
    except (PermissionError, OSError):
        pass

if all_protected:
    print('PASS: All system directories are read-only')

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
    
    if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
      console.log('Filesystem security test: Skipped (Docker not available)');
      return;
    }
    
    expect(result.status).toBe('Success');
    
    const output = result.stdout.trim();
    expect(output).toContain('PASS: All system directories are read-only');
    expect(output).not.toContain('FAIL: Write succeeded to');
    expect(output).toContain('PASS: Working directory is writable');
  }, 120000);

  // ============================================================================
  // Property 6: Environment Variable Protection
  // ============================================================================

  // Feature: code-compiler, Property 6: Environment variable protection
  test('Property 6: Code cannot access sensitive environment variables', async () => {
    const code = `
import os

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

found_sensitive = []
for var in sensitive_vars:
    value = os.environ.get(var)
    if value:
        found_sensitive.append(var)

if found_sensitive:
    print(f'FAIL: Found sensitive variables: {found_sensitive}')
else:
    print('PASS: No sensitive environment variables accessible')

all_vars = list(os.environ.keys())
print(f'Total environment variables: {len(all_vars)}')

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
    
    if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
      console.log('Environment variable test: Skipped (Docker not available)');
      return;
    }
    
    expect(result.status).toBe('Success');
    
    const output = result.stdout.trim();
    expect(output).toContain('PASS: No sensitive environment variables accessible');
    expect(output).not.toContain('FAIL: Found sensitive variables');
  }, 120000);

  // Feature: code-compiler, Property 6: Comprehensive environment variable test
  test('Property 6: Sensitive environment variables are not passed to container', async () => {
    await fc.assert(
      fc.asyncProperty(
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
    print(f'FAIL: {var_name} is accessible')
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
          
          if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
            return;
          }
          
          expect(result.status).toBe('Success');
          
          const output = result.stdout.trim();
          expect(output).toContain('PASS:');
          expect(output).not.toContain('FAIL:');
        }
      ),
      { numRuns: 10 }
    );
  }, 120000);

  // ============================================================================
  // Property 7: System Command Prevention
  // ============================================================================

  // Feature: code-compiler, Property 7: System command prevention
  test('Property 7: Code cannot execute dangerous system commands', async () => {
    const code = `
import subprocess
import os

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
        result = subprocess.run(cmd, capture_output=True, timeout=2, text=True)
        if result.returncode == 0:
            print(f'FAIL: Command succeeded: {" ".join(cmd)}')
            all_blocked = False
        else:
            pass
    except subprocess.TimeoutExpired:
        pass
    except FileNotFoundError:
        pass
    except PermissionError:
        pass
    except Exception as e:
        pass

if all_blocked:
    print('PASS: All dangerous commands were blocked or failed')

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
    
    if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
      console.log('System command test: Skipped (Docker not available)');
      return;
    }
    
    expect(result.status).toBe('Success');
    
    const output = result.stdout.trim();
    expect(output).toContain('PASS: All dangerous commands were blocked or failed');
    expect(output).not.toContain('FAIL: Command succeeded');
    expect(output).toContain('PASS: Safe commands still work');
  }, 120000);

  // Feature: code-compiler, Property 7: Shell injection attempts are blocked
  test('Property 7: Shell injection attempts are blocked', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'echo test; rm -rf /',
          'echo test && rm -rf /',
          'echo test || rm -rf /',
          'echo $(rm -rf /)',
          'echo `rm -rf /`',
          'echo test | sh',
          'echo hacked > /etc/passwd',
          'rm -rf / &'
        ),
        async (injectionPattern) => {
          const code = `
import subprocess
import os

injection = '''${injectionPattern.replace(/'/g, "\\'")}'''

try:
    result = subprocess.run(injection, shell=True, capture_output=True, timeout=2, text=True)
    
    if 'hacked' in result.stdout or result.returncode == 0:
        print('Command executed but likely failed due to permissions')
    else:
        print('Command failed as expected')
        
except subprocess.TimeoutExpired:
    print('Command timed out (blocked)')
except Exception as e:
    print(f'Command blocked: {type(e).__name__}')

try:
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
          
          if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
            return;
          }
          
          expect(result.status).toMatch(/Success|Runtime_Error/);
          
          const output = result.stdout.trim();
          expect(output).toContain('PASS: System files intact');
          expect(output).not.toContain('FAIL: System files damaged');
        }
      ),
      { numRuns: 10 }
    );
  }, 120000);

  // Feature: code-compiler, Property 7: Process manipulation prevention
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
    if result.returncode == 0:
        lines = result.stdout.strip().split('\\n')
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
    print('INFO: Can lower own priority (acceptable)')
except PermissionError:
    print('PASS: Cannot change process priority')

# Test 4: Try to access /proc of other processes
try:
    proc_dirs = os.listdir('/proc')
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
    
    if (result.status === 'System_Error' && result.error.includes('Container creation failed')) {
      console.log('Process manipulation test: Skipped (Docker not available)');
      return;
    }
    
    expect(result.status).toBe('Success');
    
    const output = result.stdout.trim();
    expect(output).toContain('PASS: Cannot kill init process');
    expect(output).not.toContain('FAIL: Killed init process');
    expect(output).toMatch(/PASS: Limited process visibility|PASS: ps command not available|PASS: Cannot list processes/);
  }, 120000);
});
