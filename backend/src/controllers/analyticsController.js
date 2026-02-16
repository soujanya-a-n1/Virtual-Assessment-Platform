const { ExamSubmission, Exam, User, StudentAnswer, Question } = require('../models');
const { Op } = require('sequelize');

const getAnalytics = async (req, res) => {
  try {
    const submissions = await ExamSubmission.findAll({
      include: [
        { 
          association: 'exam', 
          attributes: ['id', 'title', 'totalMarks', 'passingMarks'] 
        },
        {
          association: 'student',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['submitTime', 'DESC']]
    });

    const totalStudents = await User.count({ where: { role: 'student' } });
    const totalExams = await Exam.count();
    const totalQuestions = await Question.count();
    const totalSubmissions = submissions.length;
    const passedCount = submissions.filter((s) => s.isPassed).length;
    const failedCount = submissions.filter((s) => s.isPassed === false).length;

    const avgScore =
      submissions.length > 0
        ? submissions.reduce((sum, s) => sum + (s.obtainedMarks || 0), 0) / submissions.length
        : 0;

    const passPercentage =
      submissions.length > 0 ? ((passedCount / submissions.length) * 100).toFixed(2) : 0;

    // Format recent submissions with time ago
    const recentSubmissions = submissions.slice(0, 10).map(submission => {
      const timeAgo = getTimeAgo(submission.submitTime);
      return {
        studentName: submission.student 
          ? `${submission.student.firstName} ${submission.student.lastName}`
          : 'Unknown Student',
        examTitle: submission.exam ? submission.exam.title : 'Unknown Exam',
        obtainedMarks: submission.obtainedMarks || 0,
        totalMarks: submission.exam ? submission.exam.totalMarks : 0,
        isPassed: submission.isPassed,
        timeAgo: timeAgo
      };
    });

    res.json({
      analytics: {
        totalExams,
        totalSubmissions,
        totalStudents,
        totalQuestions,
        passedCount,
        failedCount,
        passPercentage,
        averageScore: avgScore.toFixed(2),
        recentSubmissions
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

// Helper function to calculate time ago
const getTimeAgo = (date) => {
  if (!date) return 'Recently';
  
  const now = new Date();
  const submittedDate = new Date(date);
  const diffMs = now - submittedDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return submittedDate.toLocaleDateString();
};

const getExamAnalytics = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const submissions = await ExamSubmission.findAll({
      where: { examId },
      include: { association: 'studentAnswers', include: 'question' },
    });

    const totalSubmissions = submissions.length;
    const passedCount = submissions.filter((s) => s.isPassed).length;
    const failedCount = submissions.filter((s) => s.isPassed === false).length;

    const avgScore =
      totalSubmissions > 0
        ? submissions.reduce((sum, s) => sum + (s.obtainedMarks || 0), 0) / totalSubmissions
        : 0;

    const passPercentage =
      totalSubmissions > 0 ? ((passedCount / totalSubmissions) * 100).toFixed(2) : 0;

    const questionAnalytics = {};
    submissions.forEach((submission) => {
      (submission.studentAnswers || []).forEach((answer) => {
        if (!questionAnalytics[answer.questionId]) {
          questionAnalytics[answer.questionId] = {
            correct: 0,
            incorrect: 0,
            notAnswered: 0,
          };
        }

        if (answer.studentAnswer === null || answer.studentAnswer === '') {
          questionAnalytics[answer.questionId].notAnswered++;
        } else if (answer.isCorrect) {
          questionAnalytics[answer.questionId].correct++;
        } else {
          questionAnalytics[answer.questionId].incorrect++;
        }
      });
    });

    res.json({
      examAnalytics: {
        examId,
        examTitle: exam.title,
        totalSubmissions,
        passedCount,
        failedCount,
        passPercentage,
        averageScore: avgScore.toFixed(2),
        questionAnalytics,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exam analytics', error: error.message });
  }
};

const getStudentAnalytics = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const submissions = await ExamSubmission.findAll({
      where: { userId: studentId },
      include: { association: 'exam', attributes: ['id', 'title', 'totalMarks', 'passingMarks'] },
    });

    const totalExamsTaken = submissions.length;
    const passedCount = submissions.filter((s) => s.isPassed).length;
    const failedCount = submissions.filter((s) => s.isPassed === false).length;

    const avgScore =
      totalExamsTaken > 0
        ? submissions.reduce((sum, s) => sum + (s.obtainedMarks || 0), 0) / totalExamsTaken
        : 0;

    const passPercentage =
      totalExamsTaken > 0 ? ((passedCount / totalExamsTaken) * 100).toFixed(2) : 0;

    res.json({
      studentAnalytics: {
        studentId,
        studentName: `${student.firstName} ${student.lastName}`,
        totalExamsTaken,
        passedCount,
        failedCount,
        passPercentage,
        averageScore: avgScore.toFixed(2),
        submissions: submissions.map((s) => ({
          examId: s.examId,
          examTitle: s.exam.title,
          obtainedMarks: s.obtainedMarks,
          totalMarks: s.exam.totalMarks,
          isPassed: s.isPassed,
          submittedAt: s.submitTime,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student analytics', error: error.message });
  }
};

module.exports = {
  getAnalytics,
  getExamAnalytics,
  getStudentAnalytics,
};
