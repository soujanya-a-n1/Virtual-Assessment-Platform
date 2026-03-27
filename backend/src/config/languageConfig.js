/**
 * Language Configuration Module
 * 
 * Provides language-specific compilation and execution commands for all supported languages.
 * Each language configuration includes Docker image, file extension, compilation/execution commands,
 * and whether the language requires compilation.
 */

const LANGUAGE_CONFIGS = {
  'C': {
    dockerImage: 'gcc:latest',
    fileExtension: '.c',
    compileCommand: 'gcc -o program program.c -Wall',
    executeCommand: './program',
    requiresCompilation: true,
  },
  'C++': {
    dockerImage: 'gcc:latest',
    fileExtension: '.cpp',
    compileCommand: 'g++ -o program program.cpp -Wall -std=c++17',
    executeCommand: './program',
    requiresCompilation: true,
  },
  'Java': {
    dockerImage: 'openjdk:17-slim',
    fileExtension: '.java',
    compileCommand: 'javac Main.java',
    executeCommand: 'java Main',
    requiresCompilation: true,
    mainClassName: 'Main',
  },
  'C#': {
    dockerImage: 'mcr.microsoft.com/dotnet/sdk:7.0',
    fileExtension: '.cs',
    compileCommand: 'dotnet build',
    executeCommand: 'dotnet run',
    requiresCompilation: true,
  },
  'Node.js': {
    dockerImage: 'node:18-alpine',
    fileExtension: '.js',
    executeCommand: 'node program.js',
    requiresCompilation: false,
  },
  'Python': {
    dockerImage: 'python:3.11-alpine',
    fileExtension: '.py',
    executeCommand: 'python3 program.py',
    requiresCompilation: false,
  },
  'JavaScript': {
    dockerImage: 'node:18-alpine',
    fileExtension: '.js',
    executeCommand: 'node program.js',
    requiresCompilation: false,
  },
};

/**
 * Get language-specific configuration
 * @param {string} language - Programming language name
 * @returns {Object} Language configuration object
 * @throws {Error} If language is not supported
 */
function getLanguageConfig(language) {
  const config = LANGUAGE_CONFIGS[language];
  
  if (!config) {
    throw new Error(`Unsupported language: ${language}. Supported languages are: ${Object.keys(LANGUAGE_CONFIGS).join(', ')}`);
  }
  
  return config;
}

/**
 * Get list of all supported languages
 * @returns {Array<string>} Array of supported language names
 */
function getSupportedLanguages() {
  return Object.keys(LANGUAGE_CONFIGS);
}

/**
 * Check if a language is supported
 * @param {string} language - Programming language name
 * @returns {boolean} True if language is supported
 */
function isLanguageSupported(language) {
  return LANGUAGE_CONFIGS.hasOwnProperty(language);
}

module.exports = {
  LANGUAGE_CONFIGS,
  getLanguageConfig,
  getSupportedLanguages,
  isLanguageSupported,
};
