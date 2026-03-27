const GradingEngine = require('./GradingEngine');
const CodingSubmission = require('../models/CodingSubmission');

// Mock the CodingSubmission model
jest.mock('../models/CodingSubmission');

describe('GradingEngine', () => {
  let gradingEngine;

  beforeEach(() => {
    gradingEngine = new GradingEngine();
    jest.clearAllMocks();
  });

  describe('calculateProportionalMarks', () => {
    test('should return 0 when totalTests is 0', () => {
      const marks = gradingEngine.calculateProportionalMarks(0, 0, 10);
      expect(marks).toBe(0);
    });

    test('should return 0 when no tests passed', () => {
      const marks = gradingEngine.calculateProportionalMarks(0, 5, 10);
      expect(marks).toBe(0);
    });

    test('should return full marks when all tests passed', () => {
      const marks = gradingEngine.calculateProportionalMarks(5, 5, 10);
      expect(marks).toBe(10);
    });

    test('should calculate proportional marks correctly', () => {
      const marks = gradingEngine.calculateProportionalMarks(3, 5, 10);
      expect(marks).toBe(6);
    });

    test('should round to 2 decimal places', () => {
      const marks = gradingEngine.calculateProportionalMarks(2, 3, 10);
      expect(marks).toBe(6.67);
    });

    test('should handle partial marks correctly', () => {
      const marks = gradingEngine.calculateProportionalMarks(1, 4, 20);
      expect(marks).toBe(5);
    });
  });

  describe('updateSubmissionGrade', () => {
    test('should update submission with grading results', async () => {
      CodingSubmission.update.mockResolvedValue([1]);

      const gradingResult = {
        marksObtained: 7.5,
        totalTestCases: 10,
        passedTestCases: 7,
      };

      await gradingEngine.updateSubmissionGrade(1, gradingResult);

      expect(CodingSubmission.update).toHaveBeenCalledWith(
        {
          marksObtained: 7.5,
          totalTestCases: 10,
          passedTestCases: 7,
          status: 'Graded',
        },
        {
          where: { id: 1 },
        }
      );
    });

    test('should throw error if update fails', async () => {
      const error = new Error('Database error');
      CodingSubmission.update.mockRejectedValue(error);

      const gradingResult = {
        marksObtained: 5,
        totalTestCases: 5,
        passedTestCases: 5,
      };

      await expect(
        gradingEngine.updateSubmissionGrade(1, gradingResult)
      ).rejects.toThrow('Database error');
    });
  });

  describe('gradeSubmission', () => {
    test('should grade submission with all tests passed', async () => {
      CodingSubmission.update.mockResolvedValue([1]);

      const testResults = [
        { passed: true },
        { passed: true },
        { passed: true },
      ];

      const result = await gradingEngine.gradeSubmission(1, testResults, 15);

      expect(result).toEqual({
        marksObtained: 15,
        totalTestCases: 3,
        passedTestCases: 3,
        percentage: 100,
        status: 'Graded',
      });
    });

    test('should grade submission with no tests passed', async () => {
      CodingSubmission.update.mockResolvedValue([1]);

      const testResults = [
        { passed: false },
        { passed: false },
      ];

      const result = await gradingEngine.gradeSubmission(1, testResults, 10);

      expect(result).toEqual({
        marksObtained: 0,
        totalTestCases: 2,
        passedTestCases: 0,
        percentage: 0,
        status: 'Graded',
      });
    });

    test('should grade submission with partial tests passed', async () => {
      CodingSubmission.update.mockResolvedValue([1]);

      const testResults = [
        { passed: true },
        { passed: false },
        { passed: true },
        { passed: false },
      ];

      const result = await gradingEngine.gradeSubmission(1, testResults, 20);

      expect(result).toEqual({
        marksObtained: 10,
        totalTestCases: 4,
        passedTestCases: 2,
        percentage: 50,
        status: 'Graded',
      });
    });

    test('should handle empty test results', async () => {
      CodingSubmission.update.mockResolvedValue([1]);

      const testResults = [];

      const result = await gradingEngine.gradeSubmission(1, testResults, 10);

      expect(result).toEqual({
        marksObtained: 0,
        totalTestCases: 0,
        passedTestCases: 0,
        percentage: 0,
        status: 'Graded',
      });
    });

    test('should call updateSubmissionGrade with correct parameters', async () => {
      CodingSubmission.update.mockResolvedValue([1]);

      const testResults = [
        { passed: true },
        { passed: true },
        { passed: false },
      ];

      await gradingEngine.gradeSubmission(1, testResults, 30);

      expect(CodingSubmission.update).toHaveBeenCalledWith(
        {
          marksObtained: 20,
          totalTestCases: 3,
          passedTestCases: 2,
          status: 'Graded',
        },
        {
          where: { id: 1 },
        }
      );
    });

    test('should throw error if grading fails', async () => {
      const error = new Error('Grading failed');
      CodingSubmission.update.mockRejectedValue(error);

      const testResults = [{ passed: true }];

      await expect(
        gradingEngine.gradeSubmission(1, testResults, 10)
      ).rejects.toThrow('Grading failed');
    });
  });
});
