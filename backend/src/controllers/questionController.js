const { Question, Exam, ExamQuestion } = require('../models');
const csv = require('csv-parser');
const fs = require('fs');

const createQuestion = async (req, res) => {
  try {
    const {
      questionText,
      questionType,
      marks,
      difficulty,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      explanation,
    } = req.body;

    const question = await Question.create({
      questionText,
      questionType,
      marks,
      difficulty,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      explanation,
    });

    res.status(201).json({ message: 'Question created successfully', question });
  } catch (error) {
    res.status(500).json({ message: 'Error creating question', error: error.message });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ question });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching question', error: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await question.update(req.body);
    res.json({ message: 'Question updated successfully', question });
  } catch (error) {
    res.status(500).json({ message: 'Error updating question', error: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await question.destroy();
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error: error.message });
  }
};

const uploadQuestionsCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const questions = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        questions.push({
          questionText: row.questionText,
          questionType: row.questionType,
          marks: parseFloat(row.marks),
          difficulty: row.difficulty || 'Medium',
          optionA: row.optionA,
          optionB: row.optionB,
          optionC: row.optionC,
          optionD: row.optionD,
          correctAnswer: row.correctAnswer,
          explanation: row.explanation,
        });
      })
      .on('end', async () => {
        try {
          const createdQuestions = await Question.bulkCreate(questions);
          fs.unlinkSync(filePath);
          res.status(201).json({
            message: `${createdQuestions.length} questions uploaded successfully`,
            questionsCount: createdQuestions.length,
          });
        } catch (error) {
          fs.unlinkSync(filePath);
          res.status(500).json({ message: 'Error saving questions', error: error.message });
        }
      });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading questions', error: error.message });
  }
};

const addQuestionsToExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { questionIds } = req.body;

    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    for (let i = 0; i < questionIds.length; i++) {
      const question = await Question.findByPk(questionIds[i]);
      if (question) {
        await ExamQuestion.create({
          examId,
          questionId: questionIds[i],
          displayOrder: i + 1,
        });
      }
    }

    res.status(201).json({ message: 'Questions added to exam successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding questions to exam', error: error.message });
  }
};

const removeQuestionFromExam = async (req, res) => {
  try {
    const { examId, questionId } = req.params;

    const result = await ExamQuestion.destroy({
      where: { examId, questionId },
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Question not found in exam' });
    }

    res.json({ message: 'Question removed from exam successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing question from exam', error: error.message });
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  uploadQuestionsCSV,
  addQuestionsToExam,
  removeQuestionFromExam,
};
