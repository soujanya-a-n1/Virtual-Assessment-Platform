const { CodingQuestion, CodingSubmission, Exam, User, TestCase } = require('../models');
const CompilerService = require('../services/CompilerService');
const QueueManager = require('../services/QueueManager');
const TestCaseValidator = require('../services/TestCaseValidator');
const GradingEngine = require('../services/GradingEngine');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

// Initialize services
const compilerService = new CompilerService();
const queueManager = new QueueManager();
const testCaseValidator = new TestCaseValidator();
const gradingEngine = new GradingEngine();

// Get all coding questions
const getAllCodingQuestions = async (req, res) => {
  try {
    const { examId } = req.query;
    
    const whereClause = {};
    if (examId) {
      whereClause.examId = examId;
    }

    const questions = await CodingQuestion.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    res.json({ questions });
  } catch (error) {
    console.error('Error fetching coding questions:', error);
    res.status(500).json({ message: 'Error fetching coding questions', error: error.message });
  }
};

// Get coding question by ID
const getCodingQuestionById = async (req, res) => {
  try {
    const staffRoles = ['Admin', 'Super Admin', 'Examiner'];
    const role = (req.user?.role || '').trim();
    const isStaff = staffRoles.some((r) => r.toLowerCase() === role.toLowerCase());

    const question = await CodingQuestion.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Coding question not found' });
    }

    const tcWhere = { codingQuestionId: question.id };
    if (!isStaff) {
      tcWhere.isVisible = true;
    }

    const testCaseRows = await TestCase.findAll({
      where: tcWhere,
      order: [
        ['orderIndex', 'ASC'],
        ['id', 'ASC'],
      ],
    });

    const payload = question.get({ plain: true });
    payload.testCases = testCaseRows.map((t) => t.get({ plain: true }));

    res.json({ question: payload });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coding question', error: error.message });
  }
};

// Create coding question
const createCodingQuestion = async (req, res) => {
  try {
    const {
      examId,
      courseId,
      title,
      description,
      language,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      starterCode,
      difficulty,
      marks,
      timeLimit,
      memoryLimit,
      testCases,
    } = req.body;

    const question = await CodingQuestion.create({
      examId,
      courseId,
      title,
      description,
      language,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      starterCode,
      difficulty,
      marks,
      timeLimit,
      memoryLimit,
    });

    if (testCases && testCases.length > 0) {
      const { TestCase } = require('../models');
      const testCasePromises = testCases.map(tc => 
        TestCase.create({
          codingQuestionId: question.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isVisible: tc.isVisible !== undefined ? tc.isVisible : false,
          orderIndex: tc.orderIndex || 0,
        })
      );
      await Promise.all(testCasePromises);
    }

    res.status(201).json({ message: 'Coding question created successfully', codingQuestion: question });
  } catch (error) {
    console.error('Error creating coding question:', error);
    res.status(500).json({ message: 'Error creating coding question', error: error.message });
  }
};

// Update coding question
const updateCodingQuestion = async (req, res) => {
  try {
    const question = await CodingQuestion.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Coding question not found' });
    }

    const { testCases, ...questionData } = req.body;

    await question.update(questionData);

    // Replace test cases if provided
    if (testCases && Array.isArray(testCases)) {
      // Delete existing test cases
      await TestCase.destroy({ where: { codingQuestionId: question.id } });

      // Insert new ones
      if (testCases.length > 0) {
        await Promise.all(
          testCases.map((tc, index) =>
            TestCase.create({
              codingQuestionId: question.id,
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              isVisible: tc.isVisible !== undefined ? tc.isVisible : true,
              orderIndex: tc.orderIndex !== undefined ? tc.orderIndex : index,
            })
          )
        );
      }
    }

    // Return updated question with test cases
    const updatedTestCases = await TestCase.findAll({
      where: { codingQuestionId: question.id },
      order: [['orderIndex', 'ASC']],
    });

    res.json({
      message: 'Coding question updated successfully',
      question: { ...question.get({ plain: true }), testCases: updatedTestCases },
    });
  } catch (error) {
    console.error('Error updating coding question:', error);
    res.status(500).json({ message: 'Error updating coding question', error: error.message });
  }
};

// Delete coding question
const deleteCodingQuestion = async (req, res) => {
  try {
    const question = await CodingQuestion.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Coding question not found' });
    }

    await question.destroy();
    res.json({ message: 'Coding question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting coding question', error: error.message });
  }
};

// Submit code with full grading
const submitCode = async (req, res) => {
  let workDir = null;
  
  try {
    const { language, code } = req.body;
    const questionId = req.params.id;

    // Validate inputs
    if (!language || !code) {
      return res.status(400).json({ message: 'Language and code are required' });
    }

    // Verify question exists and get marks
    const question = await CodingQuestion.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Coding question not found' });
    }

    console.log('=== CODE SUBMISSION ===');
    console.log('Student ID:', req.user.id);
    console.log('Question ID:', questionId);
    console.log('Language:', language);
    console.log('Code length:', code?.length);

    // Create submission record with status "Running"
    const submission = await CodingSubmission.create({
      studentId: req.user.id,
      codingQuestionId: questionId,
      language,
      code,
      submissionTime: new Date(),
      status: 'Running',
    });

    console.log('Submission created:', submission.id);

    // Get initial queue position
    const initialQueuePosition = queueManager.queue.length;
    const queueStats = queueManager.getStats();

    // Add submission to queue for processing
    try {
      const result = await queueManager.enqueue(submission, async (sub) => {
        workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'submit-'));
        
        try {
          const { getLanguageConfig } = require('../config/languageConfig');
          const config = getLanguageConfig(language);

          // Compile if needed
          let compilationError = null;
          if (config.requiresCompilation) {
            const compileResult = await compilerService.compile(language, code, workDir);
            
            if (!compileResult.success) {
              // Update submission with compilation error
              await CodingSubmission.update({
                status: 'Compilation_Error',
                compilationError: compileResult.errors,
              }, {
                where: { id: sub.id },
              });
              
              return {
                status: 'Compilation_Error',
                compilationError: compileResult.errors,
                warnings: compileResult.warnings,
              };
            }
          } else {
            // For interpreted languages, write code to file
            const fileName = `program${config.fileExtension}`;
            const filePath = path.join(workDir, fileName);
            await fs.writeFile(filePath, code, 'utf8');
          }

          // Run against all test cases using TestCaseValidator
          const testResults = await testCaseValidator.validateAllTestCases(
            sub.id,
            questionId,
            async (input) => {
              // Execute code with test case input
              return await compilerService.execute(
                language,
                workDir,
                input,
                { cpu: 10000, memory: 256 * 1024 * 1024, timeout: 15000 }
              );
            }
          );

          // Grade submission using GradingEngine
          const gradingResult = await gradingEngine.gradeSubmission(
            sub.id,
            testResults,
            question.marks
          );

          // Filter visible test results for response
          const visibleResults = testCaseValidator.filterVisibleResults(testResults);

          return {
            status: 'Graded',
            marksObtained: gradingResult.marksObtained,
            totalTestCases: gradingResult.totalTestCases,
            passedTestCases: gradingResult.passedTestCases,
            percentage: gradingResult.percentage,
            visibleTestResults: visibleResults,
          };
        } finally {
          // Cleanup working directory
          if (workDir) {
            try {
              await fs.rm(workDir, { recursive: true, force: true });
            } catch (cleanupError) {
              console.error('Failed to cleanup working directory:', cleanupError);
            }
          }
        }
      });

      // Get queue position if still queued
      const queuePosition = queueManager.getQueuePosition(submission.id);

      // Return submission result
      res.status(201).json({
        message: 'Code submitted successfully',
        submission: {
          id: submission.id,
          status: result.status,
          marksObtained: result.marksObtained,
          totalTestCases: result.totalTestCases,
          passedTestCases: result.passedTestCases,
          percentage: result.percentage,
          visibleTestResults: result.visibleTestResults,
          compilationError: result.compilationError,
          warnings: result.warnings,
          queuePosition: queuePosition >= 0 ? queuePosition : undefined,
        },
      });
    } catch (queueError) {
      // Handle queue errors (e.g., server busy)
      console.error('Queue error:', queueError);
      
      // Update submission status to failed
      await CodingSubmission.update({
        status: 'Failed',
        error: queueError.message,
      }, {
        where: { id: submission.id },
      });

      return res.status(503).json({
        message: queueError.message,
        submission: {
          id: submission.id,
          status: 'Failed',
        },
      });
    }
  } catch (error) {
    console.error('Error submitting code:', error);
    res.status(500).json({ message: 'Error submitting code', error: error.message });
  }
};

// Get student's coding submissions
const getStudentSubmissions = async (req, res) => {
  try {
    const { codingQuestionId } = req.query;
    
    const whereClause = {
      studentId: req.user.id,
    };
    
    if (codingQuestionId) {
      whereClause.codingQuestionId = codingQuestionId;
    }

    const submissions = await CodingSubmission.findAll({
      where: whereClause,
      include: [
        {
          model: CodingQuestion,
          as: 'codingQuestion',
          attributes: ['id', 'title', 'marks'],
        },
      ],
      order: [['submissionTime', 'DESC']],
    });

    res.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
};

// Get all submissions (admin/examiner)
const getAllSubmissions = async (req, res) => {
  try {
    const { codingQuestionId } = req.query;
    
    const whereClause = {};
    if (codingQuestionId) {
      whereClause.codingQuestionId = codingQuestionId;
    }

    const submissions = await CodingSubmission.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: CodingQuestion,
          as: 'codingQuestion',
          attributes: ['id', 'title', 'marks'],
        },
      ],
      order: [['submissionTime', 'DESC']],
    });

    res.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
};

// Compile code
const compileCode = async (req, res) => {
  try {
    const { language, code } = req.body;
    const questionId = req.params.id;

    // Validate inputs
    if (!language || !code) {
      return res.status(400).json({ message: 'Language and code are required' });
    }

    // Verify question exists
    const question = await CodingQuestion.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Coding question not found' });
    }

    // Create temporary working directory
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'compile-'));

    try {
      // Call CompilerService.compile()
      const compileResult = await compilerService.compile(language, code, workDir);

      // Return compilation result
      res.json({
        success: compileResult.success,
        errors: compileResult.errors,
        warnings: compileResult.warnings,
      });
    } finally {
      // Cleanup working directory
      try {
        await fs.rm(workDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Failed to cleanup working directory:', cleanupError);
      }
    }
  } catch (error) {
    console.error('Error compiling code:', error);
    res.status(500).json({ message: 'Error compiling code', error: error.message });
  }
};

// Execute code with sample test case
const executeCode = async (req, res) => {
  try {
    const { language, code, input } = req.body;
    const questionId = req.params.id;

    // Validate inputs
    if (!language || !code) {
      return res.status(400).json({ message: 'Language and code are required' });
    }

    // Verify question exists
    const question = await CodingQuestion.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Coding question not found' });
    }

    // Create temporary working directory
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'execute-'));

    try {
      const { getLanguageConfig } = require('../config/languageConfig');
      const config = getLanguageConfig(language);

      // Compile if needed
      if (config.requiresCompilation) {
        const compileResult = await compilerService.compile(language, code, workDir);
        
        if (!compileResult.success) {
          return res.json({
            status: 'Compilation_Error',
            output: '',
            errors: compileResult.errors,
            warnings: compileResult.warnings,
            executionTime: 0,
          });
        }
      } else {
        // For interpreted languages, write code to file
        const fileName = `program${config.fileExtension}`;
        const filePath = path.join(workDir, fileName);
        await fs.writeFile(filePath, code, 'utf8');
      }

      // Execute code with sample test case input
      const execResult = await compilerService.execute(
        language,
        workDir,
        input || '',
        { cpu: 10000, memory: 256 * 1024 * 1024, timeout: 15000 }
      );

      // Return execution result
      res.json({
        status: execResult.status,
        output: execResult.output,
        errors: execResult.error,
        executionTime: execResult.executionTime,
      });
    } finally {
      // Cleanup working directory
      try {
        await fs.rm(workDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Failed to cleanup working directory:', cleanupError);
      }
    }
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({ message: 'Error executing code', error: error.message });
  }
};

// Get submission results with test details
const getSubmissionResults = async (req, res) => {
  try {
    const submissionId = req.params.id;

    // Retrieve submission
    const submission = await CodingSubmission.findByPk(submissionId, {
      include: [
        {
          model: CodingQuestion,
          as: 'codingQuestion',
          attributes: ['id', 'title', 'marks'],
        },
      ],
    });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check authorization - students can only view their own submissions
    if (req.user.role === 'Student' && submission.studentId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Determine if user can see hidden test results
    const canSeeHidden = ['Admin', 'Super Admin', 'Examiner'].includes(req.user.role);

    // Get test results with test case details
    const testResults = await testCaseValidator.getTestResults(
      submissionId,
      canSeeHidden
    );

    // Format test results for response
    const formattedResults = testResults.map(result => ({
      testCaseId: result.testCaseId,
      passed: result.passed,
      input: result.testCase.input,
      expectedOutput: result.testCase.expectedOutput,
      actualOutput: result.actualOutput,
      executionTime: result.executionTime,
      errorMessage: result.errorMessage,
      isVisible: result.testCase.isVisible,
    }));

    // Return submission results
    res.json({
      submission: {
        id: submission.id,
        status: submission.status,
        language: submission.language,
        code: submission.code,
        submissionTime: submission.submissionTime,
        marksObtained: submission.marksObtained,
        totalTestCases: submission.totalTestCases,
        passedTestCases: submission.passedTestCases,
        compilationError: submission.compilationError,
        question: submission.codingQuestion,
      },
      testResults: formattedResults,
    });
  } catch (error) {
    console.error('Error fetching submission results:', error);
    res.status(500).json({ message: 'Error fetching submission results', error: error.message });
  }
};

module.exports = {
  getAllCodingQuestions,
  getCodingQuestionById,
  createCodingQuestion,
  updateCodingQuestion,
  deleteCodingQuestion,
  compileCode,
  executeCode,
  submitCode,
  getStudentSubmissions,
  getAllSubmissions,
  getSubmissionResults,
};
