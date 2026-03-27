/**
 * Windows Compatibility Utilities
 * 
 * Provides utilities for Windows/Docker compatibility:
 * - OS detection
 * - Path conversion for Docker on Windows
 * - Line ending normalization (CRLF to LF)
 * 
 * Requirements: 15.1, 15.2, 15.3, 15.5, 15.6
 */

const os = require('os');

/**
 * Check if running on Windows
 * @returns {boolean} True if Windows
 */
function isWindows() {
  return os.platform() === 'win32';
}

/**
 * Convert Windows path to Docker-compatible format
 * Example: C:\path\to\dir -> /c/path/to/dir
 * @param {string} windowsPath - Windows path
 * @returns {string} Docker-compatible path
 */
function convertWindowsPathToDockerPath(windowsPath) {
  if (!isWindows()) {
    return windowsPath;
  }
  
  // Convert backslashes to forward slashes
  let dockerPath = windowsPath.replace(/\\/g, '/');
  
  // Convert drive letter (C: -> /c)
  dockerPath = dockerPath.replace(/^([A-Z]):/i, (match, drive) => `/${drive.toLowerCase()}`);
  
  return dockerPath;
}

/**
 * Normalize code for Docker execution
 * Converts Windows line endings (CRLF) to Unix line endings (LF)
 * @param {string} code - Source code
 * @returns {string} Normalized code
 */
function normalizeCodeForDocker(code) {
  // Convert CRLF to LF
  return code.replace(/\r\n/g, '\n');
}

module.exports = {
  isWindows,
  convertWindowsPathToDockerPath,
  normalizeCodeForDocker,
};
