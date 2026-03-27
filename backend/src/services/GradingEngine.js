const CodingSubmission = require('../models/CodingSubmission');

/**
 * GradingEngine - Calculates marks based on test case results
 * 
 * Implements proportional grading where marks are awarded based on
 * the percentage of test cases passed.
 */
class GradingEngine {
  constructor() {
    this.logger = console; // Using console for logging, can be replaced with proper logger
  }
  /**
   * Calculate proportional marks based on test results
   * 
   * Formula: (passedTests / totalTests) × totalMarks
   * 
   * @param {number} passedTests - Number of test cases passed
   * @param {number} totalTests - Total number of test cases
   * @param {number} totalMarks - Total marks available for the question
   * @returns {number} Marks obtained (rounded to 2 decimal places)
   */
  calculateProportionalMarks(passedTests, totalTests, totalMarks) {
    if (totalTests === 0) {
      return 0;
    }
    
    const marks = (passedTests / totalTests) * totalMarks;
    return Math.round(marks * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Update submission with grading results
   * 
   * @param {number} submissionId - Submission ID
   * @param {Object} gradingResult - Grading result object
   * @param {number} gradingResult.marksObtained - Marks obtained
   * @param {number} gradingResult.totalTestCases - Total test cases
   * @param {number} gradingResult.passedTestCases - Passed test cases
   * @returns {Promise<void>}
   */
  async updateSubmissionGrade(submissionId, gradingResult) {
    try {
      await CodingSubmission.update({
        marksObtained: gradingResult.marksObtained,
        totalTestCases: gradingResult.totalTestCases,
        passedTestCases: gradingResult.passedTestCases,
        status: 'Graded',
      }, {
        where: { id: submissionId },
      });
      
      this.logger.info('Submission graded successfully', {
        submissionId,
        marksObtained: gradingResult.marksObtained,
        passedTestCases: gradingResult.passedTestCases,
        totalTestCases: gradingResult.totalTestCases,
      });
    } catch (error) {
      this.logger.error('Failed to update submission grade', {
        submissionId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Grade a submission based on test results
   * 
   * @param {number} submissionId - Submission ID
   * @param {Array} testResults - Array of test result objects
   * @param {number} totalMarks - Total marks for the question
   * @returns {Promise<Object>} Grading result with marksObtained, percentage, status
   */
  async gradeSubmission(submissionId, testResults, totalMarks) {
    try {
      // Count passed and total tests
      const totalTests = testResults.length;
      const passedTests = testResults.filter(result => result.passed).length;
      
      // Calculate marks using proportional formula
      const marksObtained = this.calculateProportionalMarks(
        passedTests,
        totalTests,
        totalMarks
      );
      
      // Calculate percentage
      const percentage = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
      
      // Create grading result
      const gradingResult = {
        marksObtained,
        totalTestCases: totalTests,
        passedTestCases: passedTests,
        percentage: Math.round(percentage * 100) / 100,
        status: 'Graded',
      };
      
      // Update submission with grading results
      await this.updateSubmissionGrade(submissionId, gradingResult);
      
      this.logger.info('Submission graded', {
        submissionId,
        gradingResult,
      });
      
      return gradingResult;
    } catch (error) {
      logger.error('Failed to grade submission', {
        submissionId,
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = GradingEngine;
