const { ExamSubmission, Exam, User, StudentAnswer, Question } = require('../models');
const { Op } = require('sequelize');

// Get student's own results
exports.getMyResults = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, examId } = req.query;

    const whereClause = { userId };
    if (status) whereClause.status = status;
    if (examId) whereClause.examId = examId;

    const results = await ExamSubmission.findAll({
      where: whereClause,
      include: [
        {
          model: Exam,
          as: 'exam',
          attributes: ['id', 'title', 'totalMarks', 'passingMarks', 'duration'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Error fetching results', error: error.message });
  }
};

// Get detailed result for a specific submission
exports.getResultDetails = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const submission = await ExamSubmission.findOne({
      where: { id: submissionId },
      include: [
        {
          model: Exam,
          as: 'exam',
          attributes: ['id', 'title', 'description', 'totalMarks', 'passingMarks', 'duration', 'totalQuestions'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: User,
          as: 'evaluator',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check authorization
    if (userRole === 'Student' && submission.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get all answers with questions
    const answers = await StudentAnswer.findAll({
      where: { submissionId },
      include: [
        {
          model: Question,
          as: 'question',
          attributes: ['id', 'questionText', 'questionType', 'marks', 'correctAnswer', 'optionA', 'optionB', 'optionC', 'optionD', 'explanation'],
        },
      ],
      order: [['id', 'ASC']],
    });

    res.json({
      submission,
      answers,
    });
  } catch (error) {
    console.error('Error fetching result details:', error);
    res.status(500).json({ message: 'Error fetching result details', error: error.message });
  }
};

// Get all results (Admin/Examiner)
exports.getAllResults = async (req, res) => {
  try {
    const { status, examId, userId, startDate, endDate } = req.query;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (examId) whereClause.examId = examId;
    if (userId) whereClause.userId = userId;
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const results = await ExamSubmission.findAll({
      where: whereClause,
      include: [
        {
          model: Exam,
          as: 'exam',
          attributes: ['id', 'title', 'totalMarks', 'passingMarks'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(results);
  } catch (error) {
    console.error('Error fetching all results:', error);
    res.status(500).json({ message: 'Error fetching results', error: error.message });
  }
};

// Get result statistics
exports.getResultStatistics = async (req, res) => {
  try {
    const { examId } = req.params;

    const submissions = await ExamSubmission.findAll({
      where: { 
        examId,
        status: 'Evaluated',
      },
      attributes: ['obtainedMarks', 'isPassed'],
    });

    if (submissions.length === 0) {
      return res.json({
        totalSubmissions: 0,
        averageScore: 0,
        passRate: 0,
        highestScore: 0,
        lowestScore: 0,
      });
    }

    const marks = submissions.map(s => parseFloat(s.obtainedMarks));
    const passedCount = submissions.filter(s => s.isPassed).length;

    const statistics = {
      totalSubmissions: submissions.length,
      averageScore: (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(2),
      passRate: ((passedCount / submissions.length) * 100).toFixed(2),
      highestScore: Math.max(...marks).toFixed(2),
      lowestScore: Math.min(...marks).toFixed(2),
      passedCount,
      failedCount: submissions.length - passedCount,
    };

    res.json(statistics);
  } catch (error) {
    console.error('Error fetching result statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};
