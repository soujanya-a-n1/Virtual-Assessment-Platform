const { Exam, Question, ExamQuestion, User } = require('../models');
const { Op } = require('sequelize');

const createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      totalQuestions,
      totalMarks,
      passingMarks,
      examType,
      status,
      startTime,
      endTime,
      requiresProctoring,
      shuffleQuestions,
      negativeMarkingEnabled,
      negativeMarks,
    } = req.body;

    const exam = await Exam.create({
      title,
      description,
      duration,
      totalQuestions,
      totalMarks,
      passingMarks,
      examType,
      status: status || 'Draft',
      startTime,
      endTime,
      requiresProctoring,
      shuffleQuestions,
      negativeMarkingEnabled,
      negativeMarks,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: 'Exam created successfully', exam });
  } catch (error) {
    res.status(500).json({ message: 'Error creating exam', error: error.message });
  }
};

const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Question,
          through: { attributes: [] },
          attributes: ['id', 'questionText'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ exams });
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ message: 'Error fetching exams', error: error.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Question,
          through: { attributes: [] },
          attributes: ['id', 'questionText', 'questionType', 'marks'],
        },
      ],
    });

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json({ exam });
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ message: 'Error fetching exam', error: error.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Allow admins and exam creators to update
    const canUpdate = ['Admin', 'Super Admin', 'Examiner'].includes(req.user.role) || 
                      exam.createdBy === req.user.id;
    
    if (!canUpdate) {
      return res.status(403).json({ message: 'Unauthorized to update this exam' });
    }

    await exam.update(req.body);
    res.json({ message: 'Exam updated successfully', exam });
  } catch (error) {
    res.status(500).json({ message: 'Error updating exam', error: error.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Allow admins and exam creators to delete
    const canDelete = ['Admin', 'Super Admin', 'Examiner'].includes(req.user.role) || 
                      exam.createdBy === req.user.id;
    
    if (!canDelete) {
      return res.status(403).json({ message: 'Unauthorized to delete this exam' });
    }

    await exam.destroy();
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exam', error: error.message });
  }
};

const publishExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    await exam.update({ status: 'Published' });
    res.json({ message: 'Exam published successfully', exam });
  } catch (error) {
    res.status(500).json({ message: 'Error publishing exam', error: error.message });
  }
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  publishExam,
};
