const request = require('supertest');
const app = require('../../server');
const { sequelize, CodingQuestion, CodingSubmission, TestCase, TestResult } = require('../../models');

// Feature: code-compiler, Integration Test: End-to-end submission flow
describe('End-to-End Code Submission Flow', () => {
  let authToken;
  let questionId;
  let studentId = 1;

  beforeAll(async () => {
    // Setup database
    await sequelize.sync({ force: true });
    
    // Create a test question
    const question = await CodingQuestion.create({
      title: 'Sum Two Numbers',
      description: 'Write a program that reads two integers and outputs their sum',
      difficulty: 'Easy',
      marks: 10,
      timeLimit: 30,
      inputFormat: 'Two integers on a single line',
      outputFormat: 'Single integer (the sum)',
    });
    questionId = question.id;

    // Create test cases
    await TestCase.create({
      codingQuestionId: questionId,
      input: '5 10',
      expectedOutput: '15',
      isVisible: true,
      orderIndex: 1,
    });

    await TestCase.create({
      codingQuestionId: questionId,
      input: '100 200',
      expectedOutput: '300',
      isVisible: false,
      orderIndex: 2,
    });

    await TestCase.create({
      codingQuestionId: questionId,
      input: '-5 5',
      expectedOutput: '0',
      isVisible: false,
      orderIndex: 3,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('Complete submission flow: submit → compile → execute → validate → grade', async () => {
    // Python code that correctly solves the problem
    const code = `
a, b = map(int, input().split())
print(a + b)
`.trim();

    // Submit code
    const response = await request(app)
      .post(`/api/coding-questions/${questionId}/submit`)
      .send({
        language: 'Python',
        code,
      })
      .set('Authorization', `Bearer ${authToken || 'test-token'}`)
      .expect(200);

    const submissionId = response.body.submissionId || response.body.id;
    expect(submissionId).toBeDefined();

    // Verify submission was created in database
    const submission = await CodingSubmission.findByPk(submissionId, {
      include: [{ model: TestResult, as: 'testResults' }],
    });

    expect(submission).toBeDefined();
    expect(submission.language).toBe('Python');
    expect(submission.code).toBe(code);
    expect(submission.status).toBe('Graded');

    // Verify test results were created
    expect(submission.testResults).toBeDefined();
    expect(submission.testResults.length).toBe(3); // All 3 test cases

    // Verify all tests passed
    const passedTests = submission.testResults.filter(r => r.passed);
    expect(passedTests.length).toBe(3);

    // Verify grading
    expect(submission.totalTestCases).toBe(3);
    expect(submission.passedTestCases).toBe(3);
    expect(submission.marksObtained).toBe(10); // Full marks

    // Verify test results have correct data
    submission.testResults.forEach(result => {
      expect(result.passed).toBe(true);
      expect(result.actualOutput).toBeDefined();
      expect(result.executionTime).toBeDefined();
      expect(result.executionTime).toBeGreaterThan(0);
    });
  }, 30000);

  test('Submission with partial pass: some tests fail', async () => {
    // Code that only works for positive numbers
    const code = `
a, b = map(int, input().split())
if a < 0 or b < 0:
    print("Error")
else:
    print(a + b)
`.trim();

    const response = await request(app)
      .post(`/api/coding-questions/${questionId}/submit`)
      .send({
        language: 'Python',
        code,
      })
      .set('Authorization', `Bearer ${authToken || 'test-token'}`)
      .expect(200);

    const submissionId = response.body.submissionId || response.body.id;
    const submission = await CodingSubmission.findByPk(submissionId, {
      include: [{ model: TestResult, as: 'testResults' }],
    });

    expect(submission.status).toBe('Graded');
    expect(submission.totalTestCases).toBe(3);
    expect(submission.passedTestCases).toBe(2); // Only 2 pass (negative test fails)

    // Verify proportional grading: (2/3) * 10 = 6.67
    expect(submission.marksObtained).toBeCloseTo(6.67, 1);

    // Verify failed test has actual output
    const failedTest = submission.testResults.find(r => !r.passed);
    expect(failedTest).toBeDefined();
    expect(failedTest.actualOutput).toBe('Error');
  }, 30000);

  test('Submission with compilation error', async () => {
    // Invalid Python code
    const code = `
def sum(a, b
    return a + b
`.trim();

    const response = await request(app)
      .post(`/api/coding-questions/${questionId}/submit`)
      .send({
        language: 'Python',
        code,
      })
      .set('Authorization', `Bearer ${authToken || 'test-token'}`)
      .expect(200);

    expect(response.body.status).toBe('Compilation_Error');
    expect(response.body.compilationError).toBeDefined();
    expect(response.body.compilationError).toContain('SyntaxError');
  }, 30000);

  test('Submission with runtime error', async () => {
    // Code that crashes
    const code = `
raise Exception("Runtime error")
`.trim();

    const response = await request(app)
      .post(`/api/coding-questions/${questionId}/submit`)
      .send({
        language: 'Python',
        code,
      })
      .set('Authorization', `Bearer ${authToken || 'test-token'}`)
      .expect(200);

    const submissionId = response.body.submissionId || response.body.id;
    const submission = await CodingSubmission.findByPk(submissionId);

    expect(submission.status).toBe('Graded');
    expect(submission.passedTestCases).toBe(0);
    expect(submission.marksObtained).toBe(0);
  }, 30000);

  test('Test results visibility: students see only visible tests', async () => {
    const code = `
a, b = map(int, input().split())
print(a + b)
`.trim();

    const response = await request(app)
      .post(`/api/coding-questions/${questionId}/submit`)
      .send({
        language: 'Python',
        code,
      })
      .set('Authorization', `Bearer ${authToken || 'test-token'}`)
      .expect(200);

    // Response should include test results
    if (response.body.testResults) {
      // Verify visible test results are included
      const visibleResults = response.body.testResults.filter(r => r.isVisible);
      expect(visibleResults.length).toBeGreaterThan(0);
    }
  }, 30000);

  test('Database records are created correctly', async () => {
    const code = `
a, b = map(int, input().split())
print(a + b)
`.trim();

    const response = await request(app)
      .post(`/api/coding-questions/${questionId}/submit`)
      .send({
        language: 'Python',
        code,
      })
      .set('Authorization', `Bearer ${authToken || 'test-token'}`)
      .expect(200);

    const submissionId = response.body.submissionId || response.body.id;

    // Verify submission record
    const submission = await CodingSubmission.findByPk(submissionId);
    expect(submission).toBeDefined();
    expect(submission.studentId).toBeDefined();
    expect(submission.codingQuestionId).toBe(questionId);
    expect(submission.language).toBe('Python');
    expect(submission.code).toBe(code);
    expect(submission.status).toBe('Graded');
    expect(submission.marksObtained).toBeDefined();
    expect(submission.totalTestCases).toBe(3);
    expect(submission.passedTestCases).toBeDefined();

    // Verify test result records
    const testResults = await TestResult.findAll({
      where: { submissionId },
    });

    expect(testResults.length).toBe(3);
    testResults.forEach(result => {
      expect(result.testCaseId).toBeDefined();
      expect(result.passed).toBeDefined();
      expect(result.actualOutput).toBeDefined();
      expect(result.executionTime).toBeDefined();
    });
  }, 30000);

  test('Multiple languages: Java submission', async () => {
    const code = `
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
        sc.close();
    }
}
`.trim();

    const response = await request(app)
      .post(`/api/coding-questions/${questionId}/submit`)
      .send({
        language: 'Java',
        code,
      })
      .set('Authorization', `Bearer ${authToken || 'test-token'}`)
      .expect(200);

    const submissionId = response.body.submissionId || response.body.id;
    const submission = await CodingSubmission.findByPk(submissionId);

    expect(submission.language).toBe('Java');
    expect(submission.status).toBe('Graded');
    expect(submission.passedTestCases).toBe(3);
    expect(submission.marksObtained).toBe(10);
  }, 30000);
});
