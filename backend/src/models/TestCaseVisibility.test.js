const fc = require('fast-check');
const TestCase = require('./TestCase');
const CodingQuestion = require('./CodingQuestion');
const sequelize = require('../config/database');

// Feature: code-compiler, Property 12: Test case visibility control
describe('TestCase Visibility Control - Property-Based Tests', () => {
  let testQuestionId;

  beforeAll(async () => {
    // Ensure database connection is established
    await sequelize.authenticate();
    
    // Sync models (create tables if they don't exist)
    await sequelize.sync();
  });

  beforeEach(async () => {
    // Create a fresh test coding question for each test
    const question = await CodingQuestion.create({
      title: 'Test Question for Visibility',
      description: 'Test description',
      marks: 10,
      difficulty: 'Easy',
      examId: null,
    });
    testQuestionId = question.id;
  });

  afterEach(async () => {
    // Clean up test cases and question after each test
    if (testQuestionId) {
      await TestCase.destroy({ where: { codingQuestionId: testQuestionId } });
      await CodingQuestion.destroy({ where: { id: testQuestionId } });
      testQuestionId = null;
    }
  });

  // Feature: code-compiler, Property 12: Test case visibility control
  test('Property 12: Sample test cases are stored with isVisible = true', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate test case data
        fc.string({ minLength: 0, maxLength: 100 }),
        fc.string({ minLength: 0, maxLength: 100 }),
        async (input, expectedOutput) => {
          // Create a sample test case (visible to students)
          const sampleTestCase = await TestCase.create({
            codingQuestionId: testQuestionId,
            input,
            expectedOutput,
            isVisible: true, // Sample test case
            orderIndex: 0,
          });

          // Verify it was stored with isVisible = true
          expect(sampleTestCase.isVisible).toBe(true);

          // Retrieve from database to confirm persistence
          const retrieved = await TestCase.findByPk(sampleTestCase.id);
          expect(retrieved.isVisible).toBe(true);

          // Clean up
          await sampleTestCase.destroy();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: code-compiler, Property 12: Test case visibility control
  test('Property 12: Hidden test cases are stored with isVisible = false', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate test case data
        fc.string({ minLength: 0, maxLength: 100 }),
        fc.string({ minLength: 0, maxLength: 100 }),
        async (input, expectedOutput) => {
          // Create a hidden test case (not visible to students)
          const hiddenTestCase = await TestCase.create({
            codingQuestionId: testQuestionId,
            input,
            expectedOutput,
            isVisible: false, // Hidden test case
            orderIndex: 0,
          });

          // Verify it was stored with isVisible = false
          expect(hiddenTestCase.isVisible).toBe(false);

          // Retrieve from database to confirm persistence
          const retrieved = await TestCase.findByPk(hiddenTestCase.id);
          expect(retrieved.isVisible).toBe(false);

          // Clean up
          await hiddenTestCase.destroy();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: code-compiler, Property 12: Test case visibility control
  test(
    'Property 12: Students can only retrieve visible test cases',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate multiple test cases with mixed visibility
          fc.array(
            fc.record({
              input: fc.string({ minLength: 0, maxLength: 50 }),
              expectedOutput: fc.string({ minLength: 0, maxLength: 50 }),
              isVisible: fc.boolean(),
            }),
            { minLength: 2, maxLength: 10 }
          ),
          async (testCasesData) => {
            // Ensure we have at least one visible and one hidden test case
            const hasVisible = testCasesData.some(tc => tc.isVisible);
            const hasHidden = testCasesData.some(tc => !tc.isVisible);
            fc.pre(hasVisible && hasHidden);

            // Create all test cases
            const createdTestCases = [];
            for (const data of testCasesData) {
              const testCase = await TestCase.create({
                codingQuestionId: testQuestionId,
                input: data.input,
                expectedOutput: data.expectedOutput,
                isVisible: data.isVisible,
                orderIndex: createdTestCases.length,
              });
              createdTestCases.push(testCase);
            }

            // Simulate student query: retrieve only visible test cases
            const visibleTestCases = await TestCase.findAll({
              where: {
                codingQuestionId: testQuestionId,
                isVisible: true,
              },
            });

            // Count expected visible test cases
            const expectedVisibleCount = testCasesData.filter(tc => tc.isVisible).length;

            // Verify only visible test cases are returned
            expect(visibleTestCases.length).toBe(expectedVisibleCount);

            // Verify all returned test cases have isVisible = true
            visibleTestCases.forEach(tc => {
              expect(tc.isVisible).toBe(true);
            });

            // Verify hidden test cases are not in the result
            const visibleIds = new Set(visibleTestCases.map(tc => tc.id));
            createdTestCases.forEach(tc => {
              if (tc.isVisible) {
                expect(visibleIds.has(tc.id)).toBe(true);
              } else {
                expect(visibleIds.has(tc.id)).toBe(false);
              }
            });

            // Clean up
            for (const tc of createdTestCases) {
              await tc.destroy();
            }
          }
        ),
        { numRuns: 100 }
      );
    },
    15000
  ); // 15 second timeout for property-based test

  // Feature: code-compiler, Property 12: Test case visibility control
  test(
    'Property 12: Hidden test cases are not displayed to students',
    async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate test cases with specific visibility patterns
        fc.integer({ min: 1, max: 5 }), // number of visible test cases
        fc.integer({ min: 1, max: 5 }), // number of hidden test cases
        async (numVisible, numHidden) => {
          const createdTestCases = [];

          // Create visible test cases
          for (let i = 0; i < numVisible; i++) {
            const testCase = await TestCase.create({
              codingQuestionId: testQuestionId,
              input: `visible input ${i}`,
              expectedOutput: `visible output ${i}`,
              isVisible: true,
              orderIndex: i,
            });
            createdTestCases.push(testCase);
          }

          // Create hidden test cases
          for (let i = 0; i < numHidden; i++) {
            const testCase = await TestCase.create({
              codingQuestionId: testQuestionId,
              input: `hidden input ${i}`,
              expectedOutput: `hidden output ${i}`,
              isVisible: false,
              orderIndex: numVisible + i,
            });
            createdTestCases.push(testCase);
          }

          // Student query: get visible test cases only
          const studentView = await TestCase.findAll({
            where: {
              codingQuestionId: testQuestionId,
              isVisible: true,
            },
          });

          // Verify student sees only visible test cases
          expect(studentView.length).toBe(numVisible);

          // Verify none of the hidden test cases are in student view
          const studentViewIds = new Set(studentView.map(tc => tc.id));
          createdTestCases.forEach(tc => {
            if (!tc.isVisible) {
              expect(studentViewIds.has(tc.id)).toBe(false);
            }
          });

          // Verify all visible test cases are in student view
          createdTestCases.forEach(tc => {
            if (tc.isVisible) {
              expect(studentViewIds.has(tc.id)).toBe(true);
            }
          });

          // Clean up
          for (const tc of createdTestCases) {
            await tc.destroy();
          }
        }
      ),
      { numRuns: 100 }
    );
  },
  15000
); // 15 second timeout for property-based test

  // Feature: code-compiler, Property 12: Test case visibility control
  test(
    'Property 12: Visibility flag correctly controls student access across all test cases',
    async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate array of test cases with random visibility
        fc.array(
          fc.record({
            input: fc.string({ minLength: 0, maxLength: 50 }),
            expectedOutput: fc.string({ minLength: 0, maxLength: 50 }),
            isVisible: fc.boolean(),
          }),
          { minLength: 1, maxLength: 15 }
        ),
        async (testCasesData) => {
          // Create all test cases
          const createdTestCases = [];
          for (let i = 0; i < testCasesData.length; i++) {
            const data = testCasesData[i];
            const testCase = await TestCase.create({
              codingQuestionId: testQuestionId,
              input: data.input,
              expectedOutput: data.expectedOutput,
              isVisible: data.isVisible,
              orderIndex: i,
            });
            createdTestCases.push(testCase);
          }

          // Query for visible test cases (student perspective)
          const visibleTestCases = await TestCase.findAll({
            where: {
              codingQuestionId: testQuestionId,
              isVisible: true,
            },
          });

          // Query for all test cases (examiner perspective)
          const allTestCases = await TestCase.findAll({
            where: {
              codingQuestionId: testQuestionId,
            },
          });

          // Verify counts
          const expectedVisibleCount = testCasesData.filter(tc => tc.isVisible).length;
          const expectedTotalCount = testCasesData.length;

          expect(visibleTestCases.length).toBe(expectedVisibleCount);
          expect(allTestCases.length).toBe(expectedTotalCount);

          // Verify visibility flag controls access
          expect(visibleTestCases.length).toBeLessThanOrEqual(allTestCases.length);

          // Verify each visible test case has isVisible = true
          visibleTestCases.forEach(tc => {
            expect(tc.isVisible).toBe(true);
          });

          // Verify the difference between all and visible is exactly the hidden count
          const expectedHiddenCount = testCasesData.filter(tc => !tc.isVisible).length;
          expect(allTestCases.length - visibleTestCases.length).toBe(expectedHiddenCount);

          // Clean up
          for (const tc of createdTestCases) {
            await tc.destroy();
          }
        }
      ),
      { numRuns: 100 }
    );
  },
  15000
); // 15 second timeout for property-based test

  // Feature: code-compiler, Property 12: Test case visibility control
  test('Property 12: Default visibility is false (hidden) when not specified', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 0, maxLength: 100 }),
        fc.string({ minLength: 0, maxLength: 100 }),
        async (input, expectedOutput) => {
          // Create test case without specifying isVisible
          const testCase = await TestCase.create({
            codingQuestionId: testQuestionId,
            input,
            expectedOutput,
            // isVisible not specified - should default to false
            orderIndex: 0,
          });

          // Verify default is false (hidden)
          expect(testCase.isVisible).toBe(false);

          // Retrieve from database to confirm
          const retrieved = await TestCase.findByPk(testCase.id);
          expect(retrieved.isVisible).toBe(false);

          // Verify it's not returned in student query
          const visibleTestCases = await TestCase.findAll({
            where: {
              codingQuestionId: testQuestionId,
              isVisible: true,
            },
          });

          expect(visibleTestCases.length).toBe(0);

          // Clean up
          await testCase.destroy();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: code-compiler, Property 12: Test case visibility control
  test('Property 12: Visibility flag can be updated and persists correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 0, maxLength: 100 }),
        fc.string({ minLength: 0, maxLength: 100 }),
        fc.boolean(), // initial visibility
        fc.boolean(), // updated visibility
        async (input, expectedOutput, initialVisibility, updatedVisibility) => {
          // Create test case with initial visibility
          const testCase = await TestCase.create({
            codingQuestionId: testQuestionId,
            input,
            expectedOutput,
            isVisible: initialVisibility,
            orderIndex: 0,
          });

          // Verify initial visibility
          expect(testCase.isVisible).toBe(initialVisibility);

          // Update visibility
          await testCase.update({ isVisible: updatedVisibility });

          // Verify update
          expect(testCase.isVisible).toBe(updatedVisibility);

          // Retrieve from database to confirm persistence
          const retrieved = await TestCase.findByPk(testCase.id);
          expect(retrieved.isVisible).toBe(updatedVisibility);

          // Verify student query reflects the update
          const visibleTestCases = await TestCase.findAll({
            where: {
              codingQuestionId: testQuestionId,
              isVisible: true,
            },
          });

          if (updatedVisibility) {
            expect(visibleTestCases.length).toBe(1);
            expect(visibleTestCases[0].id).toBe(testCase.id);
          } else {
            expect(visibleTestCases.length).toBe(0);
          }

          // Clean up
          await testCase.destroy();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: code-compiler, Property 12: Test case visibility control
  test(
    'Property 12: Multiple questions maintain separate visibility controls',
    async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate test cases for multiple questions
        fc.array(
          fc.record({
            input: fc.string({ minLength: 0, maxLength: 50 }),
            expectedOutput: fc.string({ minLength: 0, maxLength: 50 }),
            isVisible: fc.boolean(),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        async (testCasesData) => {
          // Create a second question
          const question2 = await CodingQuestion.create({
            title: 'Second Test Question',
            description: 'Test description 2',
            marks: 10,
            difficulty: 'Medium',
            examId: null,
          });

          try {
            // Create test cases for first question
            const testCases1 = [];
            for (const data of testCasesData) {
              const tc = await TestCase.create({
                codingQuestionId: testQuestionId,
                input: data.input,
                expectedOutput: data.expectedOutput,
                isVisible: data.isVisible,
                orderIndex: testCases1.length,
              });
              testCases1.push(tc);
            }

            // Create test cases for second question (with opposite visibility)
            const testCases2 = [];
            for (const data of testCasesData) {
              const tc = await TestCase.create({
                codingQuestionId: question2.id,
                input: data.input,
                expectedOutput: data.expectedOutput,
                isVisible: !data.isVisible, // Opposite visibility
                orderIndex: testCases2.length,
              });
              testCases2.push(tc);
            }

            // Query visible test cases for question 1
            const visible1 = await TestCase.findAll({
              where: {
                codingQuestionId: testQuestionId,
                isVisible: true,
              },
            });

            // Query visible test cases for question 2
            const visible2 = await TestCase.findAll({
              where: {
                codingQuestionId: question2.id,
                isVisible: true,
              },
            });

            // Verify counts are correct for each question
            const expectedVisible1 = testCasesData.filter(tc => tc.isVisible).length;
            const expectedVisible2 = testCasesData.filter(tc => !tc.isVisible).length;

            expect(visible1.length).toBe(expectedVisible1);
            expect(visible2.length).toBe(expectedVisible2);

            // Verify no cross-contamination between questions
            visible1.forEach(tc => {
              expect(tc.codingQuestionId).toBe(testQuestionId);
            });
            visible2.forEach(tc => {
              expect(tc.codingQuestionId).toBe(question2.id);
            });

            // Clean up
            for (const tc of testCases1) {
              await tc.destroy();
            }
            for (const tc of testCases2) {
              await tc.destroy();
            }
          } finally {
            await CodingQuestion.destroy({ where: { id: question2.id } });
          }
        }
      ),
      { numRuns: 100 }
    );
  },
  15000
); // 15 second timeout for property-based test
});
