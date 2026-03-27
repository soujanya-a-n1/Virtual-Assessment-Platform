# Implementation Plan: Multi-Language Code Compiler

## Overview

This implementation plan breaks down the code compiler system into incremental, testable steps. The approach follows a bottom-up strategy: first establishing the core infrastructure (database, models, Docker executor), then building the compilation and execution services, followed by queue management and grading, and finally integrating with the frontend. Each major component includes property-based tests to validate correctness properties from the design document.

## Tasks

- [x] 1. Database schema updates and model creation
  - [x] 1.1 Create database migration for test_cases table
    - Create migration file in database/ directory
    - Add test_cases table with all fields: id, codingQuestionId, input, expectedOutput, isVisible, orderIndex, timestamps
    - Add foreign key constraint to coding_questions table
    - Add index on (codingQuestionId, isVisible)
    - _Requirements: 11.1, 11.7_

  - [x] 1.2 Create database migration for test_results table
    - Create migration file in database/ directory
    - Add test_results table with fields: id, submissionId, testCaseId, passed, actualOutput, executionTime, errorMessage, createdAt
    - Add foreign key constraints to coding_submissions and test_cases
    - Add index on submissionId
    - _Requirements: 11.3, 11.8, 11.9_

  - [x] 1.3 Create database migration to update coding_submissions table
    - Alter language enum to include: C, C++, Java, C#, Node.js, Python, JavaScript
    - Add compilationError TEXT field
    - Add totalTestCases INT field
    - Add passedTestCases INT field
    - _Requirements: 11.2, 11.4, 11.5, 11.6_

  - [x] 1.4 Create Sequelize model for TestCase
    - Create backend/src/models/TestCase.js
    - Define model with all fields matching database schema
    - Set up associations with CodingQuestion
    - _Requirements: 11.1_

  - [x] 1.5 Create Sequelize model for TestResult
    - Create backend/src/models/TestResult.js
    - Define model with all fields matching database schema
    - Set up associations with CodingSubmission and TestCase
    - _Requirements: 11.3_

  - [x] 1.6 Update CodingSubmission model
    - Update backend/src/models/CodingSubmission.js
    - Update language enum to include all 7 languages
    - Add compilationError, totalTestCases, passedTestCases fields
    - Set up associations with TestResult
    - _Requirements: 11.2, 11.4, 11.5, 11.6_

  - [x] 1.7 Update model associations in backend/src/models/index.js
    - Import TestCase and TestResult models
    - Set up CodingQuestion.hasMany(TestCase)
    - Set up CodingSubmission.hasMany(TestResult)
    - Set up TestCase.hasMany(TestResult)
    - Export all models
    - _Requirements: 11.1, 11.3_

  - [x] 1.8 Write property test for test case data round-trip
    - **Property 52: Test case data round-trip**
    - Test that saving and retrieving test cases with special characters, Unicode, and whitespace preserves data
    - Use fast-check to generate random test case data
    - **Validates: Requirements 20.3, 20.4, 20.5, 20.6**

- [x] 2. Language configuration module
  - [x] 2.1 Create language configuration module
    - Create backend/src/config/languageConfig.js
    - Define LANGUAGE_CONFIGS object with all 7 languages
    - Include dockerImage, fileExtension, compileCommand, executeCommand, requiresCompilation for each
    - Export getLanguageConfig(language) function
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7_

  - [x] 2.2 Write unit tests for language configuration
    - Test getLanguageConfig returns correct config for each language
    - Test error handling for unsupported languages
    - Verify all required fields are present in each config
    - _Requirements: 1.1-1.7_

- [ ] 3. Docker executor implementation
  - [x] 3.1 Create DockerExecutor class
    - Create backend/src/services/DockerExecutor.js
    - Implement createContainer(dockerImage, workDir, limits) method
    - Implement copyToContainer(containerId, sourcePath, destPath) method
    - Implement runCommand(containerId, command, input) method with timeout and resource limits
    - Implement destroyContainer(containerId) method with error handling
    - Implement executeInContainer(config) orchestration method
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3_

  - [x] 3.2 Add Docker security configuration
    - Configure containers with --network=none
    - Configure containers with --memory limit
    - Configure containers with --cpus limit
    - Configure read-only filesystem with writable /tmp
    - Remove sensitive environment variables
    - _Requirements: 2.2, 2.3, 2.4, 2.6, 3.1, 3.2_

  - [x] 3.3 Add Docker error handling and logging
    - Implement try-catch for container creation failures
    - Implement try-finally for guaranteed container cleanup
    - Add logging for container lifecycle events
    - Add critical logging for cleanup failures with force removal fallback
    - _Requirements: 14.1, 14.6_

  - [x] 3.4 Write property test for container isolation
    - **Property 3: Container isolation per execution**
    - Test that each execution creates and destroys a unique container
    - **Validates: Requirements 2.1, 2.5**

  - [x] 3.5 Write property test for network access prevention
    - **Property 4: Network access prevention**
    - Test that code attempting network operations fails
    - **Validates: Requirements 2.2**

  - [x] 3.6 Write property test for filesystem security
    - **Property 5: Filesystem security**
    - Test that writes to system directories fail while working directory succeeds
    - **Validates: Requirements 2.3, 2.4**

  - [x] 3.7 Write property test for resource limits
    - **Property 8, 9, 10: Resource limit enforcement**
    - Test CPU time, memory, and execution timeout limits
    - Verify termination and error messages
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7**

- [ ] 4. Compiler service core implementation
  - [x] 4.1 Create CompilerService class structure
    - Create backend/src/services/CompilerService.js
    - Initialize with DockerExecutor dependency
    - Import languageConfig module
    - Set up logging
    - _Requirements: 1.9, 5.1_

  - [x] 4.2 Implement compile() method
    - Accept language, code, workDir parameters
    - Get language config and check if compilation required
    - Write code to file with correct extension
    - Execute compile command in Docker container
    - Capture stdout (warnings) and stderr (errors)
    - Return {success, errors, warnings}
    - _Requirements: 5.1, 5.2, 5.6_

  - [x] 4.3 Implement execute() method
    - Accept language, executablePath, input, limits parameters
    - Execute code in Docker container with input via stdin
    - Capture stdout, stderr, exit code, execution time
    - Handle timeouts and resource limit errors
    - Return {output, error, exitCode, executionTime, status}
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [x] 4.4 Add output size limiting
    - Check output length after capture
    - Truncate to 10,000 characters if exceeded
    - Append truncation indicator
    - _Requirements: 6.7, 6.8_

  - [x] 4.5 Add compilation and execution logging
    - Log compilation errors with submission ID
    - Log execution failures with submission ID and reason
    - Log timeout events with execution time and resource usage
    - _Requirements: 14.2, 14.3, 14.4_

  - [x] 4.6 Write property test for multi-language execution
    - **Property 1: Multi-language execution support**
    - Test that valid programs in all 7 languages compile and execute successfully
    - Use simple "Hello World" or echo programs for each language
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.9**

  - [x] 4.7 Write property test for compilation before execution
    - **Property 14: Compilation before execution**
    - Test that compiled languages attempt compilation first
    - Test that compilation failures skip execution
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

  - [x] 4.8 Write property test for output capture
    - **Property 16: Output and error capture**
    - Test that stdout, stderr, and execution time are captured
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**

  - [x] 4.9 Write property test for output size limiting
    - **Property 18: Output size limiting**
    - Test that output exceeding 10,000 chars is truncated with indicator
    - **Validates: Requirements 6.7, 6.8**

- [ ] 5. Test case validator implementation
  - [x] 5.1 Create TestCaseValidator class
    - Create backend/src/services/TestCaseValidator.js
    - Implement getTestCases(questionId, includeHidden) method
    - Implement normalizeOutput(output) method for whitespace and line ending normalization
    - Implement compareOutputs(expected, actual) method
    - _Requirements: 7.3, 7.4, 7.5_

  - [x] 5.2 Implement validateAllTestCases() method
    - Accept submissionId, questionId, executeFunc parameters
    - Retrieve all test cases for the question
    - For each test case, call executeFunc with test input
    - Compare actual output with expected output using compareOutputs()
    - Create TestResult records for each test
    - Return array of test results
    - _Requirements: 7.1, 7.2, 7.3, 7.6, 7.7, 7.8_

  - [x] 5.3 Implement test result visibility logic
    - Filter test results based on test case visibility
    - Return visible test results immediately
    - Store hidden test results but don't return until grading complete
    - _Requirements: 7.9, 7.10_

  - [x] 5.4 Write property test for output comparison with normalization
    - **Property 20: Output comparison with normalization**
    - Test that whitespace and line ending differences are ignored
    - Generate outputs with various whitespace and line endings
    - **Validates: Requirements 7.3, 7.4, 7.5, 7.6, 7.7**

  - [x] 5.5 Write property test for test case execution
    - **Property 19: Test case execution**
    - Test that all test cases are executed with input via stdin
    - **Validates: Requirements 7.1, 7.2**

- [ ] 6. Grading engine implementation
  - [x] 6.1 Create GradingEngine class
    - Create backend/src/services/GradingEngine.js
    - Implement calculateProportionalMarks(passedTests, totalTests, totalMarks) method
    - Implement updateSubmissionGrade(submissionId, gradingResult) method
    - _Requirements: 8.1, 8.2_

  - [x] 6.2 Implement gradeSubmission() method
    - Accept submissionId, testResults, totalMarks parameters
    - Count passed and total tests
    - Calculate marks using proportional formula: (passed / total) × totalMarks
    - Update submission with marks, test counts, and "Graded" status
    - Return grading result
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [x] 6.3 Ensure comprehensive grading includes all test cases
    - Verify both visible and hidden test cases are included in calculation
    - _Requirements: 8.8_

  - [x] 6.4 Write property test for proportional grading
    - **Property 23: Proportional grading**
    - Test that marks = (passedTests / totalTests) × totalMarks
    - Test edge cases: 0% pass = 0 marks, 100% pass = full marks
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

  - [x] 6.5 Write property test for grade persistence
    - **Property 24: Grade persistence and status update**
    - Test that marks are stored and status updated to "Graded"
    - **Validates: Requirements 8.6, 8.7**

- [ ] 7. Queue manager implementation
  - [x] 7.1 Create QueueManager class
    - Create backend/src/services/QueueManager.js
    - Initialize with maxConcurrent = 5
    - Set up queue array and running Set
    - _Requirements: 10.3_

  - [x] 7.2 Implement enqueue() method
    - Check if queue length >= 50, reject if so
    - Create queue entry with submission and promise
    - Add 5-minute timeout for queued items
    - Push to queue and call processNext()
    - Return promise that resolves when execution completes
    - _Requirements: 10.1, 10.7_

  - [x] 7.3 Implement processNext() method
    - Check if running count < maxConcurrent
    - If capacity available, dequeue next item
    - Execute submission and resolve/reject promise
    - Remove from running set when complete
    - Call processNext() again to start next item
    - _Requirements: 10.2, 10.4_

  - [x] 7.4 Implement getQueuePosition() and getStats() methods
    - getQueuePosition returns index in queue array
    - getStats returns queue length, running count, average wait time
    - _Requirements: 10.5, 10.6_

  - [x] 7.5 Write property test for FIFO queue processing
    - **Property 30: FIFO queue processing**
    - Submit multiple executions and verify processing order
    - **Validates: Requirements 10.2**

  - [x] 7.6 Write property test for concurrent execution limit
    - **Property 31: Concurrent execution limit**
    - Submit many executions and verify max 5 run simultaneously
    - **Validates: Requirements 10.3**

  - [x] 7.7 Write property test for queue overflow rejection
    - **Property 34: Queue overflow rejection**
    - Fill queue beyond 50 and verify rejection with "Server busy" message
    - **Validates: Requirements 10.7**

- [ ] 8. Checkpoint - Core services complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. API endpoints for test case management
  - [x] 9.1 Create test case routes
    - Create backend/src/routes/testCaseRoutes.js
    - Define POST /api/test-cases (examiner only)
    - Define GET /api/coding-questions/:id/test-cases (students see visible only)
    - Define PUT /api/test-cases/:id (examiner only)
    - Define DELETE /api/test-cases/:id (examiner only)
    - Add authentication and authorization middleware
    - _Requirements: 16.5, 16.6, 16.7, 16.4_

  - [x] 9.2 Create test case controller
    - Create backend/src/controllers/testCaseController.js
    - Implement createTestCase() - validate input and expectedOutput required
    - Implement getTestCases() - filter by isVisible for students
    - Implement updateTestCase() - examiner only
    - Implement deleteTestCase() - examiner only
    - _Requirements: 4.1, 4.2, 4.3, 4.6, 4.7, 4.8, 4.9_

  - [x] 9.3 Write property test for test case creation validation
    - **Property 11: Test case creation validation**
    - Test that creating test case without input or output fails
    - **Validates: Requirements 4.3**

  - [x] 9.4 Write property test for test case visibility control
    - **Property 12: Test case visibility control**
    - Test that isVisible flag controls student access
    - **Validates: Requirements 4.4, 4.5, 4.6, 4.7**

- [ ] 10. API endpoints for code compilation and execution
  - [x] 10.1 Update coding question routes
    - Update backend/src/routes/codingQuestionRoutes.js
    - Add POST /api/coding-questions/:id/compile endpoint
    - Add POST /api/coding-questions/:id/execute endpoint
    - Update POST /api/coding-questions/:id/submit endpoint
    - Add GET /api/coding-submissions/:id/results endpoint
    - _Requirements: 16.1, 16.2, 16.3, 16.8_

  - [x] 10.2 Update coding question controller with compilation endpoint
    - Update backend/src/controllers/codingQuestionController.js
    - Implement compileCode() method
    - Call CompilerService.compile()
    - Return compilation result (success/errors/warnings)
    - _Requirements: 5.1, 5.2, 5.3, 16.1_

  - [x] 10.3 Update coding question controller with execution endpoint
    - Implement executeCode() method
    - Call CompilerService.compile() if needed
    - Call CompilerService.execute() with sample test case
    - Return execution result (output, errors, execution time)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 16.2_

  - [x] 10.4 Update coding question controller with full submission endpoint
    - Update submitCode() method
    - Create CodingSubmission record with status "Running"
    - Add submission to QueueManager
    - When executed, compile and run against all test cases
    - Call TestCaseValidator.validateAllTestCases()
    - Call GradingEngine.gradeSubmission()
    - Return submission result with visible test results and marks
    - _Requirements: 7.1, 7.9, 8.1, 9.4, 9.5, 9.6, 9.7, 16.3_

  - [x] 10.5 Implement getSubmissionResults() method
    - Retrieve submission with test results
    - Include visible test results with expected/actual output
    - Include marks and grading status
    - Include execution time
    - _Requirements: 9.4, 9.5, 9.6, 9.7, 16.8_

  - [x] 10.6 Add queue position to API responses
    - When submission is queued, include queue position in response
    - _Requirements: 9.8, 10.5_

- [ ] 11. Windows compatibility
  - [x] 11.1 Add OS detection and path handling
    - Detect OS using process.platform
    - Create utility function for Docker path conversion on Windows
    - Handle CRLF to LF conversion for code files
    - _Requirements: 15.1, 15.2, 15.3, 15.5, 15.6_

  - [x] 11.2 Write unit tests for Windows compatibility
    - Test OS detection
    - Test path conversion on Windows
    - Test line ending conversion
    - _Requirements: 15.1, 15.2, 15.3, 15.5, 15.6_

- [x] 12. Frontend code editor enhancement
  - [x] 12.1 Install Monaco Editor or CodeMirror
    - Add dependency to frontend/package.json
    - Choose Monaco Editor for VS Code-like experience
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8_

  - [x] 12.2 Update CodingQuestion component with enhanced editor
    - Update frontend/src/pages/CodingQuestion.js
    - Replace textarea with Monaco Editor component
    - Configure syntax highlighting based on selected language
    - Add line numbers display
    - Enable Tab key for indentation
    - Enable auto-closing brackets and quotes
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 12.10_

  - [x] 12.3 Implement auto-save functionality
    - Set up interval to save code to localStorage every 10 seconds
    - Update auto-save status indicator
    - _Requirements: 12.11_

  - [x] 12.4 Implement code restoration
    - On component mount, check localStorage for saved code
    - Restore code to editor if found
    - _Requirements: 12.12_

  - [x] 12.5 Write property test for auto-save
    - **Property 35: Code editor auto-save**
    - Test that code is saved to localStorage every 10 seconds
    - **Validates: Requirements 12.11**

  - [x] 12.6 Write property test for code restoration
    - **Property 36: Code restoration**
    - Test that saved code is restored when returning to question
    - **Validates: Requirements 12.12**

- [x] 13. Frontend test results display
  - [x] 13.1 Create TestResults component
    - Create frontend/src/components/TestResults.js
    - Display test case results with pass/fail indicators
    - Show expected vs actual output for failed tests
    - Display execution time for each test
    - Show summary with total/passed/failed counts
    - Display final marks obtained
    - Use color coding (green for passed, red for failed)
    - _Requirements: 9.4, 9.5, 9.6, 9.7, 19.1, 19.2, 19.4, 19.5_

  - [x] 13.2 Integrate TestResults into CodingQuestion page
    - Update frontend/src/pages/CodingQuestion.js
    - Show "Running" status when code is executing
    - Display compilation errors if compilation fails
    - Display TestResults component when execution completes
    - Show queue position if submission is queued
    - _Requirements: 9.1, 9.2, 9.3, 9.8_

- [ ] 14. Docker setup and configuration
  - [x] 14.1 Create Dockerfiles for language environments
    - Create docker/c.Dockerfile with GCC
    - Create docker/cpp.Dockerfile with G++
    - Create docker/java.Dockerfile with OpenJDK
    - Create docker/csharp.Dockerfile with .NET SDK
    - Create docker/node.Dockerfile with Node.js
    - Create docker/python.Dockerfile with Python
    - Configure each with security restrictions
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

  - [x] 14.2 Create Docker build script
    - Create scripts/build-docker-images.sh
    - Build all language Docker images
    - Tag images appropriately
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

  - [x] 14.3 Create Docker setup documentation
    - Create docs/DOCKER_SETUP.md
    - Document Docker Desktop installation for Windows
    - Document image building process
    - Document troubleshooting common issues
    - _Requirements: 15.4_

- [ ] 15. Integration testing and security validation
  - [x] 15.1 Write integration test for end-to-end submission flow
    - Test complete flow: submit code → compile → execute → validate → grade
    - Verify database records are created correctly
    - Verify test results are returned appropriately
    - _Requirements: 7.1, 8.1, 9.4, 9.5, 9.6, 9.7_

  - [x] 15.2 Write security tests for container isolation
    - **Property 4, 5, 6, 7: Security properties**
    - Test network access prevention
    - Test filesystem restrictions
    - Test environment variable protection
    - Test system command prevention
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.6, 2.7**

  - [x] 15.3 Write performance test for queue handling
    - Test 50 concurrent submissions
    - Verify all complete successfully
    - Verify queue limits are respected
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 16. Final checkpoint - Complete system integration
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based and integration tests that can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at major milestones
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- The implementation follows a bottom-up approach: infrastructure → services → API → frontend
- Docker images must be built before running the compiler service
- Windows compatibility is handled through OS detection and path conversion utilities
