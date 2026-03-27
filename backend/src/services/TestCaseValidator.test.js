const fc = require('fast-check');
const TestCaseValidator = require('./TestCaseValidator');

// Feature: code-compiler, Property 20: Output comparison with normalization
describe('TestCaseValidator - Property-Based Tests', () => {
  let validator;

  beforeEach(() => {
    validator = new TestCaseValidator();
  });

  describe('normalizeOutput', () => {
    test('should handle empty strings', () => {
      expect(validator.normalizeOutput('')).toBe('');
    });

    test('should handle null and undefined', () => {
      expect(validator.normalizeOutput(null)).toBe('');
      expect(validator.normalizeOutput(undefined)).toBe('');
    });

    test('should trim leading and trailing whitespace', () => {
      expect(validator.normalizeOutput('  hello  ')).toBe('hello');
      expect(validator.normalizeOutput('\n\nhello\n\n')).toBe('hello');
      expect(validator.normalizeOutput('\t\thello\t\t')).toBe('hello');
    });

    test('should normalize CRLF to LF', () => {
      expect(validator.normalizeOutput('hello\r\nworld')).toBe('hello\nworld');
      expect(validator.normalizeOutput('line1\r\nline2\r\nline3')).toBe('line1\nline2\nline3');
    });

    test('should normalize CR to LF', () => {
      expect(validator.normalizeOutput('hello\rworld')).toBe('hello\nworld');
    });
  });

  describe('compareOutputs', () => {
    test('should match identical strings', () => {
      expect(validator.compareOutputs('hello', 'hello')).toBe(true);
      expect(validator.compareOutputs('123', '123')).toBe(true);
    });

    test('should match after trimming whitespace', () => {
      expect(validator.compareOutputs('hello', '  hello  ')).toBe(true);
      expect(validator.compareOutputs('  hello  ', 'hello')).toBe(true);
    });

    test('should match with different line endings', () => {
      expect(validator.compareOutputs('hello\nworld', 'hello\r\nworld')).toBe(true);
      expect(validator.compareOutputs('hello\r\nworld', 'hello\nworld')).toBe(true);
    });

    test('should not match different content', () => {
      expect(validator.compareOutputs('hello', 'world')).toBe(false);
      expect(validator.compareOutputs('123', '456')).toBe(false);
    });
  });

  // Feature: code-compiler, Property 20: Output comparison with normalization
  test('Property 20: Output comparison ignores leading/trailing whitespace', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate a base output string
        fc.string({ minLength: 1, maxLength: 100 }),
        // Generate leading whitespace
        fc.oneof(
          fc.constant(''),
          fc.constant(' '),
          fc.constant('  '),
          fc.constant('\t'),
          fc.constant('\n'),
          fc.constant('   \t\n')
        ),
        // Generate trailing whitespace
        fc.oneof(
          fc.constant(''),
          fc.constant(' '),
          fc.constant('  '),
          fc.constant('\t'),
          fc.constant('\n'),
          fc.constant('   \t\n')
        ),
        async (baseOutput, leadingWs, trailingWs) => {
          // Skip empty base outputs to ensure meaningful test
          fc.pre(baseOutput.trim().length > 0);
          
          const expected = baseOutput.trim();
          const actual = leadingWs + baseOutput.trim() + trailingWs;
          
          // Outputs should match after normalization
          const result = validator.compareOutputs(expected, actual);
          expect(result).toBe(true);
        }
      ),
      { numRuns: 10 }
    );
  });

  // Feature: code-compiler, Property 20: Output comparison ignores line ending differences
  test('Property 20: Output comparison ignores line ending format differences (CRLF vs LF)', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate array of lines
        fc.array(
          fc.string({ minLength: 1, maxLength: 50 }),
          { minLength: 1, maxLength: 10 }
        ),
        async (lines) => {
          // Create expected output with LF
          const expectedLF = lines.join('\n');
          
          // Create actual output with CRLF
          const actualCRLF = lines.join('\r\n');
          
          // Create actual output with CR
          const actualCR = lines.join('\r');
          
          // All should match after normalization
          expect(validator.compareOutputs(expectedLF, actualCRLF)).toBe(true);
          expect(validator.compareOutputs(expectedLF, actualCR)).toBe(true);
          expect(validator.compareOutputs(actualCRLF, actualCR)).toBe(true);
        }
      ),
      { numRuns: 10 }
    );
  });

  // Feature: code-compiler, Property 20: Output comparison with mixed whitespace and line endings
  test('Property 20: Output comparison ignores both whitespace and line ending differences', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate array of lines
        fc.array(
          fc.string({ minLength: 1, maxLength: 50 }),
          { minLength: 1, maxLength: 10 }
        ),
        // Generate leading whitespace
        fc.oneof(
          fc.constant(''),
          fc.constant(' '),
          fc.constant('  '),
          fc.constant('\t'),
          fc.constant('\n'),
          fc.constant('   \t\n  ')
        ),
        // Generate trailing whitespace
        fc.oneof(
          fc.constant(''),
          fc.constant(' '),
          fc.constant('  '),
          fc.constant('\t'),
          fc.constant('\n'),
          fc.constant('   \t\n  ')
        ),
        // Generate line ending type for expected
        fc.constantFrom('\n', '\r\n', '\r'),
        // Generate line ending type for actual
        fc.constantFrom('\n', '\r\n', '\r'),
        async (lines, leadingWs, trailingWs, expectedLineEnding, actualLineEnding) => {
          // Create expected output
          const expected = leadingWs + lines.join(expectedLineEnding) + trailingWs;
          
          // Create actual output with different line endings
          const actual = leadingWs + lines.join(actualLineEnding) + trailingWs;
          
          // Should match after normalization
          const result = validator.compareOutputs(expected, actual);
          expect(result).toBe(true);
        }
      ),
      { numRuns: 10 }
    );
  });

  // Feature: code-compiler, Property 20: Output comparison correctly identifies different content
  test('Property 20: Output comparison correctly identifies non-matching outputs', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate two different strings
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.string({ minLength: 1, maxLength: 100 }),
        async (str1, str2) => {
          // Only test when strings are actually different after normalization
          const normalized1 = validator.normalizeOutput(str1);
          const normalized2 = validator.normalizeOutput(str2);
          
          fc.pre(normalized1 !== normalized2);
          fc.pre(normalized1.length > 0 && normalized2.length > 0);
          
          // Should not match
          const result = validator.compareOutputs(str1, str2);
          expect(result).toBe(false);
        }
      ),
      { numRuns: 10 }
    );
  });

  // Feature: code-compiler, Property 20: Output comparison with various whitespace patterns
  test('Property 20: Output comparison handles complex whitespace patterns', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate base content
        fc.array(
          fc.string({ minLength: 1, maxLength: 20 }),
          { minLength: 1, maxLength: 5 }
        ),
        async (words) => {
          // Create expected output with single spaces
          const expected = words.join(' ');
          
          // Create actual output with various whitespace
          const actual = words.map((word, idx) => {
            if (idx === 0) return word;
            // Add random whitespace before each word
            const ws = [' ', '  ', '\t', ' \t '][idx % 4];
            return ws + word;
          }).join('');
          
          // After normalization, internal whitespace differences remain
          // but leading/trailing are removed
          const normalizedExpected = validator.normalizeOutput(expected);
          const normalizedActual = validator.normalizeOutput(actual);
          
          // They should have the same trimmed content
          expect(normalizedExpected.replace(/\s+/g, ' ')).toBe(
            normalizedActual.replace(/\s+/g, ' ')
          );
        }
      ),
      { numRuns: 10 }
    );
  });

  // Feature: code-compiler, Property 20: Output comparison with empty and whitespace-only strings
  test('Property 20: Output comparison handles empty and whitespace-only strings', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate whitespace-only strings
        fc.oneof(
          fc.constant(''),
          fc.constant(' '),
          fc.constant('  '),
          fc.constant('\t'),
          fc.constant('\n'),
          fc.constant('\r\n'),
          fc.constant('   \t\n\r\n  ')
        ),
        fc.oneof(
          fc.constant(''),
          fc.constant(' '),
          fc.constant('  '),
          fc.constant('\t'),
          fc.constant('\n'),
          fc.constant('\r\n'),
          fc.constant('   \t\n\r\n  ')
        ),
        async (ws1, ws2) => {
          // All whitespace-only strings should normalize to empty and match
          const result = validator.compareOutputs(ws1, ws2);
          expect(result).toBe(true);
        }
      ),
      { numRuns: 10 }
    );
  });

  // Feature: code-compiler, Property 20: Normalization is idempotent
  test('Property 20: Normalizing output multiple times produces same result', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 0, maxLength: 200 }),
        async (output) => {
          // Normalizing once
          const normalized1 = validator.normalizeOutput(output);
          
          // Normalizing again should produce same result
          const normalized2 = validator.normalizeOutput(normalized1);
          
          expect(normalized1).toBe(normalized2);
        }
      ),
      { numRuns: 10 }
    );
  });

  // Feature: code-compiler, Property 20: Output comparison with real-world test case scenarios
  test('Property 20: Output comparison works with realistic test case outputs', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate realistic outputs (numbers, arrays, formatted text)
        fc.oneof(
          // Number outputs
          fc.array(fc.integer(), { minLength: 1, maxLength: 10 })
            .map(arr => arr.join('\n')),
          // Array outputs
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 })
            .map(arr => '[' + arr.join(', ') + ']'),
          // Formatted text
          fc.array(
            fc.record({
              key: fc.string({ minLength: 1, maxLength: 10 }),
              value: fc.integer()
            }),
            { minLength: 1, maxLength: 5 }
          ).map(arr => arr.map(obj => `${obj.key}: ${obj.value}`).join('\n'))
        ),
        // Generate line ending variation
        fc.constantFrom('\n', '\r\n', '\r'),
        // Generate whitespace variation
        fc.record({
          leading: fc.constantFrom('', ' ', '  ', '\t', '\n'),
          trailing: fc.constantFrom('', ' ', '  ', '\t', '\n')
        }),
        async (baseOutput, lineEnding, whitespace) => {
          // Create expected output (clean)
          const expected = baseOutput;
          
          // Create actual output with variations
          const actual = whitespace.leading + 
                        baseOutput.replace(/\n/g, lineEnding) + 
                        whitespace.trailing;
          
          // Should match after normalization
          const result = validator.compareOutputs(expected, actual);
          expect(result).toBe(true);
        }
      ),
      { numRuns: 10 }
    );
  });

  // Feature: code-compiler, Property 19: Test case execution
  describe('Property 19: Test case execution with stdin', () => {
    test('Property 19: All test cases are executed with input provided via stdin', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate array of test cases (1-10 test cases)
          fc.array(
            fc.record({
              input: fc.string({ minLength: 0, maxLength: 100 }),
              expectedOutput: fc.string({ minLength: 0, maxLength: 100 }),
              isVisible: fc.boolean(),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          async (testCasesData) => {
            // Mock database - create test cases
            const mockTestCases = testCasesData.map((data, index) => ({
              id: index + 1,
              codingQuestionId: 1,
              input: data.input,
              expectedOutput: data.expectedOutput,
              isVisible: data.isVisible,
              orderIndex: index,
            }));

            // Mock TestCase.findAll to return our test cases
            const originalFindAll = TestCase.findAll;
            TestCase.findAll = jest.fn().mockResolvedValue(mockTestCases);

            // Mock TestResult.create to track created results
            const createdResults = [];
            const originalCreate = TestResult.create;
            TestResult.create = jest.fn().mockImplementation(async (data) => {
              const result = { id: createdResults.length + 1, ...data };
              createdResults.push(result);
              return result;
            });

            try {
              // Track which inputs were passed to executeFunc
              const executedInputs = [];
              
              // Mock execute function that captures input and returns output
              const mockExecuteFunc = async (input) => {
                executedInputs.push(input);
                
                // Echo the input as output (simple test behavior)
                return {
                  output: input,
                  error: null,
                  executionTime: Math.random() * 100,
                };
              };

              // Execute validateAllTestCases
              const results = await validator.validateAllTestCases(
                1, // submissionId
                1, // questionId
                mockExecuteFunc
              );

              // Verify all test cases were executed
              expect(results.length).toBe(mockTestCases.length);
              expect(executedInputs.length).toBe(mockTestCases.length);

              // Verify each test case's input was passed to executeFunc via stdin
              mockTestCases.forEach((testCase, index) => {
                expect(executedInputs[index]).toBe(testCase.input);
              });

              // Verify TestResult was created for each test case
              expect(createdResults.length).toBe(mockTestCases.length);

              // Verify each result has the correct testCaseId and input was used
              createdResults.forEach((result, index) => {
                expect(result.testCaseId).toBe(mockTestCases[index].id);
                expect(result.submissionId).toBe(1);
              });
            } finally {
              // Restore original functions
              TestCase.findAll = originalFindAll;
              TestResult.create = originalCreate;
            }
          }
        ),
        { numRuns: 10 }
      );
    });

    test('Property 19: Test cases are executed in order with correct input', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate ordered test cases with distinct inputs
          fc.array(
            fc.record({
              input: fc.string({ minLength: 1, maxLength: 50 }),
              expectedOutput: fc.string({ minLength: 0, maxLength: 50 }),
            }),
            { minLength: 2, maxLength: 5 }
          ),
          async (testCasesData) => {
            // Ensure inputs are unique for this test
            const uniqueInputs = [...new Set(testCasesData.map(tc => tc.input))];
            fc.pre(uniqueInputs.length === testCasesData.length);

            // Mock database - create test cases
            const mockTestCases = testCasesData.map((data, index) => ({
              id: index + 1,
              codingQuestionId: 1,
              input: data.input,
              expectedOutput: data.expectedOutput,
              isVisible: true,
              orderIndex: index,
            }));

            // Mock TestCase.findAll
            const originalFindAll = TestCase.findAll;
            TestCase.findAll = jest.fn().mockResolvedValue(mockTestCases);

            // Mock TestResult.create
            const originalCreate = TestResult.create;
            TestResult.create = jest.fn().mockImplementation(async (data) => ({
              id: 1,
              ...data,
            }));

            try {
              // Track execution order
              const executionOrder = [];
              
              // Mock execute function
              const mockExecuteFunc = async (input) => {
                executionOrder.push(input);
                return {
                  output: `Output for: ${input}`,
                  error: null,
                  executionTime: 10,
                };
              };

              // Execute validateAllTestCases
              await validator.validateAllTestCases(1, 1, mockExecuteFunc);

              // Verify test cases were executed in order
              expect(executionOrder.length).toBe(mockTestCases.length);
              mockTestCases.forEach((testCase, index) => {
                expect(executionOrder[index]).toBe(testCase.input);
              });
            } finally {
              // Restore original functions
              TestCase.findAll = originalFindAll;
              TestResult.create = originalCreate;
            }
          }
        ),
        { numRuns: 10 }
      );
    });

    test('Property 19: Empty input is correctly passed via stdin', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate test cases with some empty inputs
          fc.array(
            fc.record({
              input: fc.constantFrom('', 'test', '123', 'hello world'),
              expectedOutput: fc.string({ minLength: 0, maxLength: 50 }),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          async (testCasesData) => {
            // Mock database
            const mockTestCases = testCasesData.map((data, index) => ({
              id: index + 1,
              codingQuestionId: 1,
              input: data.input,
              expectedOutput: data.expectedOutput,
              isVisible: true,
              orderIndex: index,
            }));

            const originalFindAll = TestCase.findAll;
            TestCase.findAll = jest.fn().mockResolvedValue(mockTestCases);

            const originalCreate = TestResult.create;
            TestResult.create = jest.fn().mockImplementation(async (data) => ({
              id: 1,
              ...data,
            }));

            try {
              const receivedInputs = [];
              
              const mockExecuteFunc = async (input) => {
                receivedInputs.push(input);
                return {
                  output: input === '' ? 'no input' : input,
                  error: null,
                  executionTime: 5,
                };
              };

              await validator.validateAllTestCases(1, 1, mockExecuteFunc);

              // Verify empty inputs are passed correctly
              mockTestCases.forEach((testCase, index) => {
                expect(receivedInputs[index]).toBe(testCase.input);
                if (testCase.input === '') {
                  expect(receivedInputs[index]).toBe('');
                }
              });
            } finally {
              TestCase.findAll = originalFindAll;
              TestResult.create = originalCreate;
            }
          }
        ),
        { numRuns: 10 }
      );
    });

    test('Property 19: Multi-line input is correctly passed via stdin', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate test cases with multi-line inputs
          fc.array(
            fc.record({
              lines: fc.array(
                fc.string({ minLength: 0, maxLength: 30 }),
                { minLength: 1, maxLength: 5 }
              ),
              expectedOutput: fc.string({ minLength: 0, maxLength: 50 }),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          async (testCasesData) => {
            // Create multi-line inputs
            const mockTestCases = testCasesData.map((data, index) => ({
              id: index + 1,
              codingQuestionId: 1,
              input: data.lines.join('\n'),
              expectedOutput: data.expectedOutput,
              isVisible: true,
              orderIndex: index,
            }));

            const originalFindAll = TestCase.findAll;
            TestCase.findAll = jest.fn().mockResolvedValue(mockTestCases);

            const originalCreate = TestResult.create;
            TestResult.create = jest.fn().mockImplementation(async (data) => ({
              id: 1,
              ...data,
            }));

            try {
              const receivedInputs = [];
              
              const mockExecuteFunc = async (input) => {
                receivedInputs.push(input);
                return {
                  output: input,
                  error: null,
                  executionTime: 10,
                };
              };

              await validator.validateAllTestCases(1, 1, mockExecuteFunc);

              // Verify multi-line inputs are passed correctly
              mockTestCases.forEach((testCase, index) => {
                expect(receivedInputs[index]).toBe(testCase.input);
                // Verify newlines are preserved
                if (testCase.input.includes('\n')) {
                  expect(receivedInputs[index]).toContain('\n');
                }
              });
            } finally {
              TestCase.findAll = originalFindAll;
              TestResult.create = originalCreate;
            }
          }
        ),
        { numRuns: 10 }
      );
    });

    test('Property 19: Special characters in input are correctly passed via stdin', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate test cases with special characters
          fc.array(
            fc.record({
              input: fc.oneof(
                fc.string({ minLength: 0, maxLength: 50 }),
                fc.constantFrom(
                  'hello\tworld',
                  'test\r\nline',
                  'special!@#$%^&*()',
                  'unicode: 你好',
                  'quotes: "test" \'test\'',
                  'backslash: \\test\\'
                )
              ),
              expectedOutput: fc.string({ minLength: 0, maxLength: 50 }),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          async (testCasesData) => {
            const mockTestCases = testCasesData.map((data, index) => ({
              id: index + 1,
              codingQuestionId: 1,
              input: data.input,
              expectedOutput: data.expectedOutput,
              isVisible: true,
              orderIndex: index,
            }));

            const originalFindAll = TestCase.findAll;
            TestCase.findAll = jest.fn().mockResolvedValue(mockTestCases);

            const originalCreate = TestResult.create;
            TestResult.create = jest.fn().mockImplementation(async (data) => ({
              id: 1,
              ...data,
            }));

            try {
              const receivedInputs = [];
              
              const mockExecuteFunc = async (input) => {
                receivedInputs.push(input);
                return {
                  output: input,
                  error: null,
                  executionTime: 10,
                };
              };

              await validator.validateAllTestCases(1, 1, mockExecuteFunc);

              // Verify special characters are preserved
              mockTestCases.forEach((testCase, index) => {
                expect(receivedInputs[index]).toBe(testCase.input);
              });
            } finally {
              TestCase.findAll = originalFindAll;
              TestResult.create = originalCreate;
            }
          }
        ),
        { numRuns: 10 }
      );
    });
  });
});
