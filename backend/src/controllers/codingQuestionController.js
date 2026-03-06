const { CodingQuestion, CodingSubmission, Exam, User } = require('../models');

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
    const question = await CodingQuestion.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Coding question not found' });
    }

    res.json({ question });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coding question', error: error.message });
  }
};

// Create coding question
const createCodingQuestion = async (req, res) => {
  try {
    const {
      examId,
      title,
      description,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      difficulty,
      marks,
      timeLimit,
    } = req.body;

    const question = await CodingQuestion.create({
      examId,
      title,
      description,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      difficulty,
      marks,
      timeLimit,
    });

    res.status(201).json({ message: 'Coding question created successfully', question });
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

    await question.update(req.body);
    res.json({ message: 'Coding question updated successfully', question });
  } catch (error) {
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

// Submit code
const submitCode = async (req, res) => {
  try {
    const {
      codingQuestionId,
      submissionId,
      language,
      code,
    } = req.body;

    console.log('=== CODE SUBMISSION ===');
    console.log('Student ID:', req.user.id);
    console.log('Question ID:', codingQuestionId);
    console.log('Language:', language);
    console.log('Code length:', code?.length);

    const submission = await CodingSubmission.create({
      studentId: req.user.id,
      codingQuestionId,
      submissionId,
      language,
      code,
      submissionTime: new Date(),
      status: 'Submitted',
    });

    console.log('Submission created:', submission.id);

    res.status(201).json({
      message: 'Code submitted successfully',
      submission: {
        id: submission.id,
        status: submission.status,
        submissionTime: submission.submissionTime,
      },
    });
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

module.exports = {
  getAllCodingQuestions,
  getCodingQuestionById,
  createCodingQuestion,
  updateCodingQuestion,
  deleteCodingQuestion,
  submitCode,
  getStudentSubmissions,
  getAllSubmissions,
};
