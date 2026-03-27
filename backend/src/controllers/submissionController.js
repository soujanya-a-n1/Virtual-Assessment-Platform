const { ExamSubmission, StudentAnswer, ProctoringLog, Exam, Question, User, CodingQuestion, TestCase } = require('../models');
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
        status: { [Op.in]: ['In Progress', 'Submitted', 'Evaluated'] },
      },
    });

    if (submission && (submission.status === 'Submitted' || submission.status === 'Evaluated')) {
      return res.status(400).json({ message: 'Exam already submitted' });
    }

    // Resume existing in-progress submission
    if (!submission) {
      submission = await ExamSubmission.create({
        userId: req.user.id,
        examId,
        status: 'In Progress',
        startedAt: new Date(),
      });
    }

    const questions = await exam.getQuestions({
      include: [
        {
          model: CodingQuestion,
          as: 'codingDetails',
          required: false,
          include: [
            {
              model: TestCase,
              as: 'testCases',
              required: false,
            }
          ]
        }
      ]
    });

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

    console.log('=== SUBMIT EXAM DEBUG ===');
    console.log('Submission ID:', submissionId);
    console.log('User ID:', req.user.id);

    const submission = await ExamSubmission.findByPk(submissionId, {
      include: { 
        association: 'studentAnswers', 
        include: {
          association: 'question',
          attributes: ['id', 'questionText', 'questionType', 'marks', 'correctAnswer', 'optionA', 'optionB', 'optionC', 'optionD']
        }
      },
    });

    if (!submission) {
      console.log('Submission not found');
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.userId !== req.user.id) {
      console.log('Unauthorized access attempt');
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (submission.status === 'Evaluated') {
      console.log('Submission already evaluated');
      return res.status(400).json({ message: 'Exam already submitted and evaluated' });
    }

    let totalMarks = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;
    const answers = submission.studentAnswers || [];
    
    console.log(`Total answers to evaluate: ${answers.length}`);

    for (const answer of answers) {
      const question = answer.question;
      
      if (!question) {
        console.log(`Question not found for answer ID: ${answer.id}`);
        continue;
      }

      // Get student answer and correct answer
      const studentAnswer = (answer.studentAnswer || '').toString().trim();
      const correctAnswer = (question.correctAnswer || '').toString().trim();
      
      // Check if student answered
      if (!studentAnswer) {
        console.log(`Question ${question.id}: Unanswered`);
        answer.isCorrect = false;
        answer.marksObtained = 0;
        unanswered++;
        await answer.save();
        continue;
      }
      
      // Normalize answers for comparison (uppercase, trim)
      const normalizedStudentAnswer = studentAnswer.toUpperCase();
      const normalizedCorrectAnswer = correctAnswer.toUpperCase();
      
      console.log(`Question ${question.id} (${question.questionType}):`);
      console.log(`  Student Answer: "${studentAnswer}" (normalized: "${normalizedStudentAnswer}")`);
      console.log(`  Correct Answer: "${correctAnswer}" (normalized: "${normalizedCorrectAnswer}")`);
      
      // Check if answer is correct
      const isCorrect = normalizedStudentAnswer === normalizedCorrectAnswer;
      const marksObtained = isCorrect ? parseFloat(question.marks) : 0;
      
      console.log(`  Is Correct: ${isCorrect}`);
      console.log(`  Marks: ${marksObtained} / ${question.marks}`);
      
      // Update answer record
      answer.isCorrect = isCorrect;
      answer.marksObtained = marksObtained;
      totalMarks += marksObtained;
      
      if (isCorrect) {
        correctAnswers++;
      } else {
        wrongAnswers++;
      }
      
      await answer.save();
    }

    console.log(`\n=== Evaluation Summary ===`);
    console.log(`Total Questions: ${answers.length}`);
    console.log(`Correct Answers: ${correctAnswers}`);
    console.log(`Wrong Answers: ${wrongAnswers}`);
    console.log(`Unanswered: ${unanswered}`);
    console.log(`Total Marks Obtained: ${totalMarks}`);

    // Get exam details
    const exam = await Exam.findByPk(submission.examId);
    const isPassed = totalMarks >= exam.passingMarks;
    
    console.log(`Exam Total Marks: ${exam.totalMarks}`);
    console.log(`Passing Marks: ${exam.passingMarks}`);
    console.log(`Is Passed: ${isPassed}`);

    // Calculate time spent
    const timeSpent = Math.floor((new Date() - new Date(submission.startedAt)) / 1000);

    // Update submission
    await submission.update({
      status: 'Evaluated',
      submitTime: new Date(),
      totalTimeSpent: timeSpent,
      obtainedMarks: totalMarks,
      isPassed,
    });

    console.log('=== SUBMIT EXAM COMPLETE ===\n');

    res.json({
      message: 'Exam submitted and evaluated successfully',
      result: {
        obtainedMarks: totalMarks,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        isPassed,
        correctAnswers,
        wrongAnswers,
        unanswered,
        totalQuestions: answers.length,
        percentage: exam.totalMarks > 0 ? ((totalMarks / exam.totalMarks) * 100).toFixed(2) : 0,
      },
    });
  } catch (error) {
    console.error('Error submitting exam:', error);
    console.error('Stack trace:', error.stack);
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
          attributes: ['id', 'title', 'totalMarks', 'passingMarks'],
          include: [{
            association: 'course',
            attributes: ['id', 'code', 'name'],
            required: false
          }]
        },
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email']
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


const deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await ExamSubmission.findByPk(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Delete associated student answers first
    await StudentAnswer.destroy({
      where: { submissionId }
    });

    // Delete proctoring logs if any
    await ProctoringLog.destroy({
      where: { submissionId }
    });

    // Delete the submission
    await submission.destroy();

    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ message: 'Error deleting submission', error: error.message });
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
  deleteSubmission,
};
