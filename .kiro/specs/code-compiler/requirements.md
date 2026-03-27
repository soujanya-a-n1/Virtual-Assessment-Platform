# Requirements Document: Multi-Language Code Compiler

## Introduction

This document specifies the requirements for a secure, multi-language code compilation and execution system for the Virtual Assessment Platform. The system will enable students to write, compile, and execute code in seven programming languages (C, C++, Java, C#/.NET, Node.js, Python, JavaScript) with automatic test case validation and grading. The compiler must execute code in isolated Docker containers with resource limits and security sandboxing to prevent malicious code execution.

## Glossary

- **Compiler_Service**: The backend service responsible for compiling and executing student code submissions
- **Docker_Container**: An isolated execution environment for running student code
- **Test_Case**: A pair of input and expected output used to validate code correctness
- **Sample_Test_Case**: A test case visible to students for understanding the problem
- **Hidden_Test_Case**: A test case not visible to students, used for final grading
- **Execution_Result**: The output, errors, execution time, and status from running code
- **Code_Submission**: A student's submitted code along with language selection and metadata
- **Resource_Limit**: Constraints on CPU time, memory usage, and execution timeout
- **Sandbox**: A restricted execution environment with no network access and limited filesystem
- **Compilation_Error**: Errors that occur during the compilation phase before execution
- **Runtime_Error**: Errors that occur during code execution
- **Test_Result**: The outcome of comparing code output against expected test case output
- **Grading_Engine**: The component that calculates marks based on test case results
- **Code_Editor**: The frontend component with syntax highlighting for writing code
- **Execution_Queue**: A queue system for managing concurrent code execution requests
- **Language_Runtime**: The compiler/interpreter environment for a specific programming language

## Requirements

### Requirement 1: Multi-Language Support

**User Story:** As a student, I want to write code in my preferred programming language, so that I can solve coding problems using familiar syntax and tools.

#### Acceptance Criteria

1. THE Compiler_Service SHALL support compilation and execution of C code
2. THE Compiler_Service SHALL support compilation and execution of C++ code
3. THE Compiler_Service SHALL support compilation and execution of Java code
4. THE Compiler_Service SHALL support compilation and execution of C# (.NET) code
5. THE Compiler_Service SHALL support execution of Node.js code
6. THE Compiler_Service SHALL support execution of Python code
7. THE Compiler_Service SHALL support execution of JavaScript code
8. WHEN a student selects a language, THE Code_Editor SHALL provide appropriate syntax highlighting for that language
9. WHEN code is submitted, THE Compiler_Service SHALL use the correct Language_Runtime based on the selected language

### Requirement 2: Secure Code Execution

**User Story:** As a system administrator, I want all code to execute in isolated containers, so that malicious code cannot harm the server or access sensitive data.

#### Acceptance Criteria

1. WHEN code is executed, THE Compiler_Service SHALL create a new Docker_Container for that execution
2. WHILE code is executing, THE Docker_Container SHALL have no network access
3. WHILE code is executing, THE Docker_Container SHALL have read-only access to system files
4. WHILE code is executing, THE Docker_Container SHALL have write access only to a temporary working directory
5. WHEN execution completes, THE Compiler_Service SHALL destroy the Docker_Container
6. THE Compiler_Service SHALL prevent code from accessing environment variables containing sensitive information
7. THE Compiler_Service SHALL prevent code from executing system commands that could compromise security

### Requirement 3: Resource Limits

**User Story:** As a system administrator, I want to enforce resource limits on code execution, so that poorly written or malicious code cannot consume excessive server resources.

#### Acceptance Criteria

1. WHEN code is executed, THE Compiler_Service SHALL enforce a maximum CPU time limit of 10 seconds
2. WHEN code is executed, THE Compiler_Service SHALL enforce a maximum memory limit of 256 MB
3. WHEN code is executed, THE Compiler_Service SHALL enforce a maximum execution timeout of 15 seconds
4. IF code exceeds the CPU time limit, THEN THE Compiler_Service SHALL terminate execution and return a timeout error
5. IF code exceeds the memory limit, THEN THE Compiler_Service SHALL terminate execution and return a memory limit error
6. IF code exceeds the execution timeout, THEN THE Compiler_Service SHALL terminate execution and return a timeout error
7. WHEN execution is terminated due to resource limits, THE Compiler_Service SHALL record the reason in the Execution_Result

### Requirement 4: Test Case Management

**User Story:** As an examiner, I want to create multiple test cases for each coding question, so that I can thoroughly validate student solutions.

#### Acceptance Criteria

1. THE system SHALL allow examiners to create Sample_Test_Cases for coding questions
2. THE system SHALL allow examiners to create Hidden_Test_Cases for coding questions
3. WHEN creating a Test_Case, THE system SHALL require both input data and expected output data
4. THE system SHALL store Sample_Test_Cases with visibility flag set to true
5. THE system SHALL store Hidden_Test_Cases with visibility flag set to false
6. WHEN a student views a coding question, THE system SHALL display all Sample_Test_Cases
7. WHEN a student views a coding question, THE system SHALL NOT display Hidden_Test_Cases
8. THE system SHALL allow examiners to edit existing Test_Cases
9. THE system SHALL allow examiners to delete Test_Cases
10. THE system SHALL support multiple Test_Cases per coding question

### Requirement 5: Code Compilation

**User Story:** As a student, I want to see clear compilation errors when my code has syntax issues, so that I can fix them before execution.

#### Acceptance Criteria

1. WHEN code in a compiled language (C, C++, Java, C#) is submitted, THE Compiler_Service SHALL attempt compilation before execution
2. IF compilation fails, THEN THE Compiler_Service SHALL capture the Compilation_Error messages
3. IF compilation fails, THEN THE Compiler_Service SHALL return the error messages to the student
4. IF compilation fails, THEN THE Compiler_Service SHALL NOT attempt to execute the code
5. WHEN compilation succeeds, THE Compiler_Service SHALL proceed to execute the compiled code
6. THE Compiler_Service SHALL include compiler warnings in the Compilation_Error output
7. WHEN displaying Compilation_Errors, THE Code_Editor SHALL highlight the relevant line numbers

### Requirement 6: Code Execution and Output Capture

**User Story:** As a student, I want to see the output and errors from my code execution, so that I can debug and improve my solution.

#### Acceptance Criteria

1. WHEN code is executed, THE Compiler_Service SHALL capture all standard output (stdout)
2. WHEN code is executed, THE Compiler_Service SHALL capture all standard error (stderr)
3. WHEN code is executed, THE Compiler_Service SHALL measure the execution time in milliseconds
4. WHEN execution completes successfully, THE Compiler_Service SHALL return the captured output
5. IF a Runtime_Error occurs, THEN THE Compiler_Service SHALL capture the error message and stack trace
6. WHEN execution completes, THE Compiler_Service SHALL record the execution status (Success, Runtime_Error, Timeout, Memory_Limit_Exceeded)
7. THE Compiler_Service SHALL limit output size to 10,000 characters to prevent memory issues
8. IF output exceeds the size limit, THEN THE Compiler_Service SHALL truncate the output and indicate truncation

### Requirement 7: Test Case Validation

**User Story:** As a student, I want my code to be automatically tested against test cases, so that I can verify my solution is correct.

#### Acceptance Criteria

1. WHEN code execution completes successfully, THE Compiler_Service SHALL run the code against all Test_Cases
2. FOR each Test_Case, THE Compiler_Service SHALL provide the input to the code via stdin
3. FOR each Test_Case, THE Compiler_Service SHALL compare the code output with the expected output
4. WHEN comparing outputs, THE Compiler_Service SHALL ignore leading and trailing whitespace
5. WHEN comparing outputs, THE Compiler_Service SHALL ignore differences in line ending formats (CRLF vs LF)
6. WHEN outputs match, THE Compiler_Service SHALL mark the Test_Result as passed
7. WHEN outputs do not match, THE Compiler_Service SHALL mark the Test_Result as failed
8. FOR each Test_Result, THE Compiler_Service SHALL record whether the test passed or failed
9. THE Compiler_Service SHALL return Test_Results for Sample_Test_Cases to the student
10. THE Compiler_Service SHALL NOT return Test_Results for Hidden_Test_Cases to the student until grading is complete

### Requirement 8: Automatic Grading

**User Story:** As an examiner, I want the system to automatically grade code submissions based on test case results, so that grading is objective and efficient.

#### Acceptance Criteria

1. WHEN all Test_Cases have been executed, THE Grading_Engine SHALL calculate the marks obtained
2. THE Grading_Engine SHALL award marks proportionally based on the number of Test_Cases passed
3. IF all Test_Cases pass, THEN THE Grading_Engine SHALL award full marks for the question
4. IF no Test_Cases pass, THEN THE Grading_Engine SHALL award zero marks
5. IF some Test_Cases pass, THEN THE Grading_Engine SHALL award partial marks proportional to the pass rate
6. THE Grading_Engine SHALL store the calculated marks in the Code_Submission record
7. WHEN grading is complete, THE system SHALL update the submission status to "Graded"
8. THE Grading_Engine SHALL include both Sample_Test_Cases and Hidden_Test_Cases in the marks calculation

### Requirement 9: Real-Time Feedback

**User Story:** As a student, I want to receive immediate feedback on my code submission, so that I know whether my solution is correct.

#### Acceptance Criteria

1. WHEN a student submits code, THE system SHALL display a "Running" status indicator
2. WHEN compilation fails, THE system SHALL display Compilation_Errors within 5 seconds
3. WHEN execution completes, THE system SHALL display the Execution_Result within 20 seconds
4. THE system SHALL display which Sample_Test_Cases passed and which failed
5. FOR failed Sample_Test_Cases, THE system SHALL show the expected output and actual output
6. THE system SHALL display the execution time for the code
7. THE system SHALL display the final marks obtained after grading
8. IF execution is queued, THEN THE system SHALL display the queue position

### Requirement 10: Queue Management

**User Story:** As a system administrator, I want to manage concurrent code execution requests through a queue, so that the server is not overwhelmed by simultaneous executions.

#### Acceptance Criteria

1. WHEN code is submitted for execution, THE Compiler_Service SHALL add it to the Execution_Queue
2. THE Compiler_Service SHALL process executions from the Execution_Queue in FIFO order
3. THE Compiler_Service SHALL limit concurrent executions to 5 Docker_Containers at a time
4. WHEN an execution completes, THE Compiler_Service SHALL start the next queued execution
5. WHEN code is queued, THE system SHALL return the queue position to the student
6. THE Compiler_Service SHALL update queue positions as executions complete
7. IF the Execution_Queue exceeds 50 pending executions, THEN THE system SHALL reject new submissions with a "Server busy" message

### Requirement 11: Database Schema Updates

**User Story:** As a developer, I want the database schema to support test cases and expanded language options, so that the system can store all necessary data.

#### Acceptance Criteria

1. THE system SHALL create a test_cases table with fields: id, codingQuestionId, input, expectedOutput, isVisible, createdAt, updatedAt
2. THE system SHALL update the coding_submissions language enum to include: C, C++, Java, C#, Node.js, Python, JavaScript
3. THE system SHALL create a test_results table with fields: id, submissionId, testCaseId, passed, actualOutput, executionTime, createdAt
4. THE system SHALL add a compilationError field to the coding_submissions table
5. THE system SHALL add a totalTestCases field to the coding_submissions table
6. THE system SHALL add a passedTestCases field to the coding_submissions table
7. THE system SHALL add foreign key constraints between test_cases and coding_questions
8. THE system SHALL add foreign key constraints between test_results and coding_submissions
9. THE system SHALL add foreign key constraints between test_results and test_cases

### Requirement 12: Frontend Code Editor Enhancement

**User Story:** As a student, I want a professional code editor with syntax highlighting and line numbers, so that I can write code more efficiently.

#### Acceptance Criteria

1. THE Code_Editor SHALL display line numbers for all code
2. THE Code_Editor SHALL provide syntax highlighting for C code
3. THE Code_Editor SHALL provide syntax highlighting for C++ code
4. THE Code_Editor SHALL provide syntax highlighting for Java code
5. THE Code_Editor SHALL provide syntax highlighting for C# code
6. THE Code_Editor SHALL provide syntax highlighting for Node.js code
7. THE Code_Editor SHALL provide syntax highlighting for Python code
8. THE Code_Editor SHALL provide syntax highlighting for JavaScript code
9. THE Code_Editor SHALL support code indentation with Tab key
10. THE Code_Editor SHALL support auto-closing of brackets and quotes
11. THE Code_Editor SHALL auto-save code to local storage every 10 seconds
12. WHEN a student returns to a question, THE Code_Editor SHALL restore previously saved code from local storage

### Requirement 13: Docker Environment Setup

**User Story:** As a developer, I want Docker images configured for all supported languages, so that code can be executed in consistent environments.

#### Acceptance Criteria

1. THE system SHALL provide a Docker image with GCC compiler for C code execution
2. THE system SHALL provide a Docker image with G++ compiler for C++ code execution
3. THE system SHALL provide a Docker image with JDK for Java code execution
4. THE system SHALL provide a Docker image with .NET SDK for C# code execution
5. THE system SHALL provide a Docker image with Node.js runtime for Node.js code execution
6. THE system SHALL provide a Docker image with Python interpreter for Python code execution
7. THE system SHALL provide a Docker image with Node.js runtime for JavaScript code execution
8. WHEN a Docker_Container is created, THE system SHALL mount only the necessary code file and input data
9. THE system SHALL configure Docker_Containers with the specified Resource_Limits
10. THE system SHALL configure Docker_Containers with network disabled

### Requirement 14: Error Handling and Logging

**User Story:** As a system administrator, I want comprehensive error logging for code execution, so that I can diagnose and fix issues.

#### Acceptance Criteria

1. WHEN a Docker_Container fails to start, THE Compiler_Service SHALL log the error with timestamp and details
2. WHEN code execution fails, THE Compiler_Service SHALL log the failure reason and code submission ID
3. WHEN a timeout occurs, THE Compiler_Service SHALL log the execution time and resource usage
4. THE Compiler_Service SHALL log all compilation errors with the submission ID
5. THE Compiler_Service SHALL log queue statistics (queue length, average wait time) every minute
6. IF a Docker_Container cannot be destroyed, THEN THE Compiler_Service SHALL log a critical error and attempt cleanup
7. THE Compiler_Service SHALL log all security violations (attempted network access, filesystem violations)
8. THE system SHALL store execution logs for at least 30 days for auditing

### Requirement 15: Windows Environment Compatibility

**User Story:** As a developer, I want the system to work on Windows with Docker Desktop, so that I can develop and test locally.

#### Acceptance Criteria

1. THE Compiler_Service SHALL detect the operating system at startup
2. WHEN running on Windows, THE Compiler_Service SHALL use Windows-compatible Docker commands
3. WHEN running on Windows, THE Compiler_Service SHALL handle Windows file path formats correctly
4. THE system SHALL provide setup documentation for Docker Desktop on Windows
5. THE system SHALL handle line ending conversions between Windows (CRLF) and Linux (LF) in Docker containers
6. WHEN mounting files into Docker_Containers on Windows, THE system SHALL use appropriate path conversion

### Requirement 16: API Endpoints

**User Story:** As a frontend developer, I want well-defined API endpoints for code compilation, so that I can integrate the compiler with the UI.

#### Acceptance Criteria

1. THE system SHALL provide a POST /api/coding-questions/:id/compile endpoint for compiling code
2. THE system SHALL provide a POST /api/coding-questions/:id/execute endpoint for executing code
3. THE system SHALL provide a POST /api/coding-questions/:id/submit endpoint for final submission with grading
4. THE system SHALL provide a GET /api/coding-questions/:id/test-cases endpoint for retrieving visible test cases
5. THE system SHALL provide a POST /api/test-cases endpoint for creating test cases (examiner only)
6. THE system SHALL provide a PUT /api/test-cases/:id endpoint for updating test cases (examiner only)
7. THE system SHALL provide a DELETE /api/test-cases/:id endpoint for deleting test cases (examiner only)
8. THE system SHALL provide a GET /api/coding-submissions/:id/results endpoint for retrieving detailed test results
9. WHEN an API endpoint is called, THE system SHALL validate authentication tokens
10. WHEN an API endpoint is called, THE system SHALL validate user permissions (student vs examiner)

### Requirement 17: Test Case Input/Output Formats

**User Story:** As an examiner, I want to specify test case inputs and outputs in a clear format, so that the system can correctly validate student code.

#### Acceptance Criteria

1. THE system SHALL accept test case input as plain text strings
2. THE system SHALL accept test case expected output as plain text strings
3. THE system SHALL support multi-line input for test cases
4. THE system SHALL support multi-line expected output for test cases
5. WHEN providing input to code, THE Compiler_Service SHALL write the input to stdin
6. WHEN capturing output from code, THE Compiler_Service SHALL read from stdout
7. THE system SHALL preserve newline characters in test case input and output
8. THE system SHALL support empty input for test cases that require no input
9. THE system SHALL support empty expected output for test cases that should produce no output

### Requirement 18: Compilation and Execution Commands

**User Story:** As a developer, I want standardized compilation and execution commands for each language, so that code runs consistently.

#### Acceptance Criteria

1. FOR C code, THE Compiler_Service SHALL use "gcc -o program program.c" for compilation and "./program" for execution
2. FOR C++ code, THE Compiler_Service SHALL use "g++ -o program program.cpp" for compilation and "./program" for execution
3. FOR Java code, THE Compiler_Service SHALL use "javac Main.java" for compilation and "java Main" for execution
4. FOR C# code, THE Compiler_Service SHALL use "dotnet build" for compilation and "dotnet run" for execution
5. FOR Node.js code, THE Compiler_Service SHALL use "node program.js" for execution
6. FOR Python code, THE Compiler_Service SHALL use "python3 program.py" for execution
7. FOR JavaScript code, THE Compiler_Service SHALL use "node program.js" for execution
8. THE Compiler_Service SHALL set appropriate compiler flags for optimization and warnings
9. THE Compiler_Service SHALL use UTF-8 encoding for all source files

### Requirement 19: Pretty Printing for Test Results

**User Story:** As a student, I want test results displayed in a clear, readable format, so that I can understand what went wrong.

#### Acceptance Criteria

1. THE system SHALL format Test_Results with clear labels for each test case
2. FOR each failed test case, THE system SHALL display the input, expected output, and actual output side-by-side
3. THE system SHALL highlight differences between expected and actual output
4. THE system SHALL display execution time for each test case
5. THE system SHALL display a summary showing total tests, passed tests, and failed tests
6. THE system SHALL use color coding (green for passed, red for failed) in the UI
7. THE system SHALL display a progress bar showing the percentage of tests passed

### Requirement 20: Round-Trip Testing for Serialization

**User Story:** As a developer, I want to ensure that test case data is correctly serialized and deserialized, so that data integrity is maintained.

#### Acceptance Criteria

1. WHEN a Test_Case is saved to the database, THE system SHALL serialize the input and expected output
2. WHEN a Test_Case is retrieved from the database, THE system SHALL deserialize the input and expected output
3. FOR all Test_Cases, serializing then deserializing SHALL produce equivalent data
4. THE system SHALL preserve special characters in test case data during serialization
5. THE system SHALL preserve Unicode characters in test case data during serialization
6. THE system SHALL preserve whitespace characters (spaces, tabs, newlines) during serialization
