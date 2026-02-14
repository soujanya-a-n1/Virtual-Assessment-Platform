const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get(
  '/',
  authenticate,
  authorize('Super Admin', 'Admin', 'Examiner'),
  analyticsController.getAnalytics
);
router.get(
  '/exams/:examId',
  authenticate,
  authorize('Super Admin', 'Admin', 'Examiner'),
  analyticsController.getExamAnalytics
);
router.get(
  '/students/:studentId',
  authenticate,
  analyticsController.getStudentAnalytics
);

module.exports = router;
