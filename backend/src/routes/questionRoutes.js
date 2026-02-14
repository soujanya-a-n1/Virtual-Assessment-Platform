const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const multer = require('multer');

const upload = multer({ dest: './uploads/csv' });

router.post(
  '/',
  authenticate,
  authorize('Examiner', 'Admin', 'Super Admin'),
  questionController.createQuestion
);
router.get('/', authenticate, questionController.getAllQuestions);
router.get('/:id', authenticate, questionController.getQuestionById);
router.put(
  '/:id',
  authenticate,
  authorize('Examiner', 'Admin', 'Super Admin'),
  questionController.updateQuestion
);
router.delete(
  '/:id',
  authenticate,
  authorize('Examiner', 'Admin', 'Super Admin'),
  questionController.deleteQuestion
);
router.post(
  '/upload/csv',
  authenticate,
  authorize('Examiner', 'Admin', 'Super Admin'),
  upload.single('file'),
  questionController.uploadQuestionsCSV
);
router.post(
  '/:examId/add-questions',
  authenticate,
  authorize('Examiner', 'Admin', 'Super Admin'),
  questionController.addQuestionsToExam
);
router.delete(
  '/:examId/questions/:questionId',
  authenticate,
  authorize('Examiner', 'Admin', 'Super Admin'),
  questionController.removeQuestionFromExam
);

module.exports = router;
