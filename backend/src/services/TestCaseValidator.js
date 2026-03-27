const { TestCase, TestResult } = require('../models');

class TestCaseValidator {
  normalizeOutput(output) {
    if (output === null || output === undefined) {
      return '';
    }
    const str = String(output);
    const normalized = str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return normalized.trim();
  }

  compareOutputs(expected, actual) {
    const normalizedExpected = this.normalizeOutput(expected);
    const normalizedActual = this.normalizeOutput(actual);
    return normalizedExpected === normalizedActual;
  }

  async validateAllTestCases(submissionId, questionId, executeFunc) {
    const testCases = await TestCase.findAll({
      where: { codingQuestionId: questionId },
      order: [['orderIndex', 'ASC']],
    });

    const results = [];

    for (const testCase of testCases) {
      try {
        const execution = await executeFunc(testCase.input);
        const passed = this.compareOutputs(testCase.expectedOutput, execution.output);

        const testResult = await TestResult.create({
          submissionId,
          testCaseId: testCase.id,
          passed,
          actualOutput: execution.output,
          executionTime: execution.executionTime,
          error: execution.error,
        });

        results.push(testResult);
      } catch (error) {
        const testResult = await TestResult.create({
          submissionId,
          testCaseId: testCase.id,
          passed: false,
          actualOutput: null,
          executionTime: 0,
          error: error.message,
        });

        results.push(testResult);
      }
    }

    return results;
  }
}

module.exports = TestCaseValidator;
