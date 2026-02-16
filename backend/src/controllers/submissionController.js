const { ExamSubmission, StudentAnswer, ProctoringLog, Exam, Question, User } = require('../models');
const { Op } = require('sequelize');

const startExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if already started
    let submission = await ExamSubmission.findOne({
      where: {
        userId: req.user.id,
        examId,
        status: { [Op.in]: ['In Progress', 'Submitted'] },
      },
    });

    if (submission) {
      return res.status(400).json({ message: 'Exam already started' });
    }

    submission = await ExamSubmission.create({
      userId: req.user.id,
      examId,
      status: 'In Progress',
      startedAt: new Date(),
    });

    const questions = await exam.getQuestions();

    res.status(201).json({
      message: 'Exam started successfully',
      submission: {
        id: submission.id,
        exam,
        questions,
        duration: exam.duration,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error starting exam', error: error.message });
  }
};

const autoSaveAnswer = async (req, res) => {
  try {
    const { submissionId, questionId, answer } = req.body;

    const submission = await ExamSubmission.findByPk(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    let studentAnswer = await StudentAnswer.findOne({
      where: { submissionId, questionId },
    });

    if (studentAnswer) {
      await studentAnswer.update({
        studentAnswer: answer,
        lastModifiedAt: new Date(),
      });
    } else {
      studentAnswer = await StudentAnswer.create({
        submissionId,
        questionId,
        studentAnswer: answer,
        answeredAt: new Date(),
        lastModifiedAt: new Date(),
      });
    }

    res.json({ message: 'Answer auto-saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving answer', error: error.message });
  }
};

const submitExam = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await ExamSubmission.findByPk(submissionId, {
      include: { association: 'studentAnswers', include: 'question' },
    });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    let totalMarks = 0;
    const answers = submission.studentAnswers || [];

    for (const answer of answers) {
      const question = await Question.findByPk(answer.questionId);
      if (question) {
        const isCorrect = answer.studentAnswer === question.correctAnswer;
        answer.isCorrect = isCorrect;
        answer.marksObtained = isCorrect ? question.marks : 0;
        totalMarks += answer.marksObtained;
        await answer.save();
      }
    }

    const exam = await Exam.findByPk(submission.examId);
    const isPassed = totalMarks >= exam.passingMarks;

    await submission.update({
      status: 'Submitted',
      submitTime: new Date(),
      totalTimeSpent: Math.floor((new Date() - submission.startedAt) / 1000),
      obtainedMarks: totalMarks,
      isPassed,
    });

    res.json({
      message: 'Exam submitted successfully',
      result: {
        obtainedMarks: totalMarks,
        totalMarks: exam.totalMarks,
        isPassed,
        passingMarks: exam.passingMarks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting exam', error: error.message });
  }
};

const autoSubmitExam = async (submissionId) => {
  try {
    const submission = await ExamSubmission.findByPk(submissionId);
    if (submission && submission.status === 'In Progress') {
      await submission.update({
        status: 'Submitted',
        submitTime: new Date(),
        autoSubmitted: true,
      });
    }
  } catch (error) {
    console.error('Error in auto-submit:', error);
  }
};

const getSubmissionDetails = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await ExamSubmission.findByPk(submissionId, {
      include: [
        { 
          model: Exam, 
          as: 'exam',
          attributes: ['id', 'title', 'description', 'totalMarks', 'passingMarks', 'duration']
        },
        {
          model: StudentAnswer,
          as: 'studentAnswers',
          include: [{ 
            model: Question, 
            as: 'question',
            attributes: ['id', 'questionText', 'questionType', 'marks', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'explanation']
          }],
        },
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'evaluator',
          attributes: ['id', 'firstName', 'lastName'],
          required: false
        }
      ],
    });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json({ submission });
  } catch (error) {
    console.error('Error fetching submission details:', error);
    res.status(500).json({ message: 'Error fetching submission', error: error.message });
  }
};

const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await ExamSubmission.findAll({
      include: [
        { 
          model: Exam, 
          as: 'exam', 
          attributes: ['id', 'title', 'totalMarks', 'passingMarks'] 
        },
        { 
          model: User, 
          as: 'student', 
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [{
            association: 'studentProfile',
            attributes: ['id', 'rollNumber']
          }]
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
};

const evaluateSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { evaluationNotes } = req.body;

    const submission = await ExamSubmission.findByPk(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    await submission.update({
      status: 'Evaluated',
      evaluationNotes,
      evaluatedBy: req.user.id,
      evaluatedAt: new Date(),
    });

    res.json({ message: 'Submission evaluated successfully', submission });
  } catch (error) {
    res.status(500).json({ message: 'Error evaluating submission', error: error.message });
  }
};

module.exports = {
  startExam,
  autoSaveAnswer,
  submitExam,
  autoSubmitExam,
  getSubmissionDetails,
  getAllSubmissions,
  evaluateSubmission,
};
