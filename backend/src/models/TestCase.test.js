const fc = require('fast-check');
const TestCase = require('./TestCase');
const CodingQuestion = require('./CodingQuestion');
const sequelize = require('../config/database');

// Feature: code-compiler, Property 52: Test case data round-trip
describe('TestCase Model - Property-Based Tests', () => {
  let testQuestionId;

  beforeAll(async () => {
    // Ensure database connection is established
    await sequelize.authenticate();
    
    // Sync models (create tables if they don't exist)
    await sequelize.sync();
    
    // Create a test coding question for our test cases
    const question = await CodingQuestion.create({
      title: 'Test Question for Round-Trip',
      description: 'Test description',
      marks: 10,
      difficulty: 'Easy',
      examId: null, // We'll use null for testing
    });
    testQuestionId = question.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (testQuestionId) {
      await TestCase.destroy({ where: { codingQuestionId: testQuestionId } });
      await CodingQuestion.destroy({ where: { id: testQuestionId } });
    }
    
    // Note: Don't close database connection here as other test suites may need it
    // Jest will handle cleanup after all tests complete
  });

  afterEach(async () => {
    // Clean up test cases after each test
    await TestCase.destroy({ where: { codingQuestionId: testQuestionId } });
  });

  // Feature: code-compiler, Property 52: Test case data round-trip
  test('Property 52: Test case data preserves special characters during round-trip', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate strings with special characters
        fc.string({ minLength: 0, maxLength: 100 }),
        fc.string({ minLength: 0, maxLength: 100 }),
        async (input, expectedOutput) => {
          // Create test case with generated data
          const testCase = await TestCase.create({
            codingQuestionId: testQuestionId,
            input,
            expectedOutput,
            isVisible: true,
            orderIndex: 0,
          });

          // Retrieve the test case from database
          const retrieved = await TestCase.findByPk(testCase.id);

          // Verify data integrity
          expect(retrieved).not.toBeNull();
          expect(retrieved.input).toBe(input);
          expect(retrieved.expectedOutput).toBe(expectedOutput);

          // Clean up
          await testCase.destroy();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: code-compiler, Property 52: Test case data preserves Unicode characters during round-trip
  test('Property 52: Test case data preserves Unicode characters during round-trip', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate strings with Unicode characters
        fc.string(),
        fc.string(),
        async (input, expectedOutput) => {
          // Create test case with Unicode data
          const testCase = await TestCase.create({
            codingQuestionId: testQuestionId,
            input,
            expectedOutput,
            isVisible: false,
            orderIndex: 1,
          });

          // Retrieve the test case from database
          const retrieved = await TestCase.findByPk(testCase.id);

          // Verify Unicode data integrity
          expect(retrieved).not.toBeNull();
          expect(retrieved.input).toBe(input);
          expect(retrieved.expectedOutput).toBe(expectedOutput);

          // Clean up
          await testCase.destroy();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: code-compiler, Property 52: Test case data preserves whitespace characters during round-trip
  test('Property 52: Test case data preserves whitespace (spaces, tabs, newlines) during round-trip', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate strings with various whitespace characters
        fc.array(
          fc.oneof(
            fc.constant(' '),      // space
            fc.constant('\t'),     // tab
            fc.constant('\n'),     // newline
            fc.constant('\r'),     // carriage return
            fc.constant('\r\n'),   // CRLF
            fc.string({ minLength: 1, maxLength: 10 }) // regular text
          ),
          { minLength: 0, maxLength: 20 }
        ).map(arr => arr.join('')),
        fc.array(
          fc.oneof(
            fc.constant(' '),
            fc.constant('\t'),
            fc.constant('\n'),
            fc.constant('\r'),
            fc.constant('\r\n'),
            fc.string({ minLength: 1, maxLength: 10 })
          ),
          { minLength: 0, maxLength: 20 }
        ).map(arr => arr.join('')),
        async (input, expectedOutput) => {
          // Create test case with whitespace data
          const testCase = await TestCase.create({
            codingQuestionId: testQuestionId,
            input,
            expectedOutput,
            isVisible: true,
            orderIndex: 2,
          });

          // Retrieve the test case from database
          const retrieved = await TestCase.findByPk(testCase.id);

          // Verify whitespace preservation
          expect(retrieved).not.toBeNull();
          expect(retrieved.input).toBe(input);
          expect(retrieved.expectedOutput).toBe(expectedOutput);
          
          // Verify exact character-by-character match
          expect(retrieved.input.length).toBe(input.length);
          expect(retrieved.expectedOutput.length).toBe(expectedOutput.length);

          // Clean up
          await testCase.destroy();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: code-compiler, Property 52: Test case data preserves mixed content during round-trip
  test('Property 52: Test case data preserves mixed special chars, Unicode, and whitespace during round-trip', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate complex strings with mixed content
        fc.array(
          fc.oneof(
            fc.string({ minLength: 1, maxLength: 5 }),  // Unicode/ASCII strings
            fc.constant('\n'),                                  // newline
            fc.constant('\t'),                                  // tab
            fc.constant(' '),                                   // space
            fc.constant('\r\n'),                                // CRLF
            fc.constantFrom('!', '@', '#', '$', '%', '^', '&', '*', '(', ')'), // special chars
            fc.constantFrom('\\', '/', '|', '<', '>', '?', '"', "'") // more special chars
          ),
          { minLength: 0, maxLength: 30 }
        ).map(arr => arr.join('')),
        fc.array(
          fc.oneof(
            fc.string({ minLength: 1, maxLength: 5 }),
            fc.constant('\n'),
            fc.constant('\t'),
            fc.constant(' '),
            fc.constant('\r\n'),
            fc.constantFrom('!', '@', '#', '$', '%', '^', '&', '*', '(', ')'),
            fc.constantFrom('\\', '/', '|', '<', '>', '?', '"', "'")
          ),
          { minLength: 0, maxLength: 30 }
        ).map(arr => arr.join('')),
        async (input, expectedOutput) => {
          // Create test case with mixed content
          const testCase = await TestCase.create({
            codingQuestionId: testQuestionId,
            input,
            expectedOutput,
            isVisible: false,
            orderIndex: 3,
          });

          // Retrieve the test case from database
          const retrieved = await TestCase.findByPk(testCase.id);

          // Verify complete data integrity
          expect(retrieved).not.toBeNull();
          expect(retrieved.input).toBe(input);
          expect(retrieved.expectedOutput).toBe(expectedOutput);
          
          // Verify byte-level equality
          expect(Buffer.from(retrieved.input).equals(Buffer.from(input))).toBe(true);
          expect(Buffer.from(retrieved.expectedOutput).equals(Buffer.from(expectedOutput))).toBe(true);

          // Clean up
          await testCase.destroy();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: code-compiler, Property 52: Test case data preserves edge cases during round-trip
  test('Property 52: Test case data preserves edge cases (empty, very long, only whitespace) during round-trip', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.constant(''),                                    // empty string
          fc.constant(' '.repeat(50)),                        // only spaces
          fc.constant('\n'.repeat(20)),                       // only newlines
          fc.constant('\t'.repeat(30)),                       // only tabs
          fc.string({ minLength: 500, maxLength: 1000 }),     // very long string
          fc.fullUnicode({ minLength: 500, maxLength: 1000 }) // very long Unicode
        ),
        fc.oneof(
          fc.constant(''),
          fc.constant(' '.repeat(50)),
          fc.constant('\n'.repeat(20)),
          fc.constant('\t'.repeat(30)),
          fc.string({ minLength: 500, maxLength: 1000 }),
          fc.fullUnicode({ minLength: 500, maxLength: 1000 })
        ),
        async (input, expectedOutput) => {
          // Create test case with edge case data
          const testCase = await TestCase.create({
            codingQuestionId: testQuestionId,
            input,
            expectedOutput,
            isVisible: true,
            orderIndex: 4,
          });

          // Retrieve the test case from database
          const retrieved = await TestCase.findByPk(testCase.id);

          // Verify edge case data integrity
          expect(retrieved).not.toBeNull();
          expect(retrieved.input).toBe(input);
          expect(retrieved.expectedOutput).toBe(expectedOutput);

          // Clean up
          await testCase.destroy();
        }
      ),
      { numRuns: 100 }
    );
  });
});

  // Feature: code-compiler, Property 11: Test case creation validation
  test('Property 11: Creating test case without input fails with validation error', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid expectedOutput
        fc.string({ minLength: 0, maxLength: 100 }),
        // Generate isVisible flag
        fc.boolean(),
        async (expectedOutput, isVisible) => {
          // Attempt to create test case without input (null)
          await expect(
            TestCase.create({
              codingQuestionId: testQuestionId,
              input: null,
              expectedOutput,
              isVisible,
              orderIndex: 0,
            })
          ).rejects.toThrow();

          // Attempt to create test case without input (undefined)
          await expect(
            TestCase.create({
              codingQuestionId: testQuestionId,
              expectedOutput,
              isVisible,
              orderIndex: 0,
            })
          ).rejects.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: code-compiler, Property 11: Test case creation validation
  test('Property 11: Creating test case without expectedOutput fails with validation error', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid input
        fc.string({ minLength: 0, maxLength: 100 }),
        // Generate isVisible flag
        fc.boolean(),
        async (input, isVisible) => {
          // Attempt to create test case without expectedOutput (null)
          await expect(
            TestCase.create({
              codingQuestionId: testQuestionId,
              input,
              expectedOutput: null,
              isVisible,
              orderIndex: 0,
            })
          ).rejects.toThrow();

          // Attempt to create test case without expectedOutput (undefined)
          await expect(
            TestCase.create({
              codingQuestionId: testQuestionId,
              input,
              isVisible,
              orderIndex: 0,
            })
          ).rejects.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: code-compiler, Property 11: Test case creation validation
  test('Property 11: Creating test case without both input and expectedOutput fails with validation error', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate isVisible flag
        fc.boolean(),
        async (isVisible) => {
          // Attempt to create test case without both fields (null)
          await expect(
            TestCase.create({
              codingQuestionId: testQuestionId,
              input: null,
              expectedOutput: null,
              isVisible,
              orderIndex: 0,
            })
          ).rejects.toThrow();

          // Attempt to create test case without both fields (undefined)
          await expect(
            TestCase.create({
              codingQuestionId: testQuestionId,
              isVisible,
              orderIndex: 0,
            })
          ).rejects.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: code-compiler, Property 11: Test case creation validation
  test('Property 11: Creating test case with both input and expectedOutput succeeds', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid input (including empty string)
        fc.string({ minLength: 0, maxLength: 100 }),
        // Generate valid expectedOutput (including empty string)
        fc.string({ minLength: 0, maxLength: 100 }),
        // Generate isVisible flag
        fc.boolean(),
        async (input, expectedOutput, isVisible) => {
          // Create test case with both fields
          const testCase = await TestCase.create({
            codingQuestionId: testQuestionId,
            input,
            expectedOutput,
            isVisible,
            orderIndex: 0,
          });

          // Verify creation succeeded
          expect(testCase).toBeDefined();
          expect(testCase.id).toBeDefined();
          expect(testCase.input).toBe(input);
          expect(testCase.expectedOutput).toBe(expectedOutput);
          expect(testCase.isVisible).toBe(isVisible);

          // Clean up
          await testCase.destroy();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: code-compiler, Property 11: Test case creation validation
  test('Property 11: Creating test case with empty strings for input and expectedOutput succeeds', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate isVisible flag
        fc.boolean(),
        async (isVisible) => {
          // Empty strings are valid (different from null/undefined)
          const testCase = await TestCase.create({
            codingQuestionId: testQuestionId,
            input: '',
            expectedOutput: '',
            isVisible,
            orderIndex: 0,
          });

          // Verify creation succeeded
          expect(testCase).toBeDefined();
          expect(testCase.id).toBeDefined();
          expect(testCase.input).toBe('');
          expect(testCase.expectedOutput).toBe('');
          expect(testCase.isVisible).toBe(isVisible);

          // Clean up
          await testCase.destroy();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: code-compiler, Property 11: Test case creation validation
  test('Property 11: Validation error message indicates missing required field', async () => {
    // Test missing input
    try {
      await TestCase.create({
        codingQuestionId: testQuestionId,
        input: null,
        expectedOutput: 'test output',
        isVisible: true,
        orderIndex: 0,
      });
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Verify error indicates validation failure
      expect(error).toBeDefined();
      // Sequelize validation errors typically have a name property
      expect(error.name).toMatch(/Sequelize|Validation|Error/i);
    }

    // Test missing expectedOutput
    try {
      await TestCase.create({
        codingQuestionId: testQuestionId,
        input: 'test input',
        expectedOutput: null,
        isVisible: true,
        orderIndex: 0,
      });
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Verify error indicates validation failure
      expect(error).toBeDefined();
      expect(error.name).toMatch(/Sequelize|Validation|Error/i);
    }
  });
});
