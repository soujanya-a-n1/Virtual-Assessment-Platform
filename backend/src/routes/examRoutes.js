const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.post(
  '/',
  authenticate,
  authorize('Examiner', 'Admin', 'Super Admin'),
  examController.createExam
);
router.get('/', authenticate, examController.getAllExams);
router.get('/:id', authenticate, examController.getExamById);
router.put(
  '/:id',
  authenticate,
  authorize('Examiner', 'Admin', 'Super Admin'),
  examController.updateExam
);
router.delete(
  '/:id',
  authenticate,
  authorize('Examiner', 'Admin', 'Super Admin'),
  examController.deleteExam
);
router.post(
  '/:id/publish',
  authenticate,
  authorize('Examiner', 'Admin', 'Super Admin'),
  examController.publishExam
);

module.exports = router;
