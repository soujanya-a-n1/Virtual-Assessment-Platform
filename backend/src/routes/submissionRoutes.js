const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.post('/exams/:examId/start', authenticate, authorize('Student'), submissionController.startExam);
router.post('/auto-save', authenticate, submissionController.autoSaveAnswer);
router.post('/:submissionId/submit', authenticate, authorize('Student'), submissionController.submitExam);
router.get('/:submissionId', authenticate, submissionController.getSubmissionDetails);
router.get('/', authenticate, authorize('Admin', 'Super Admin', 'Examiner'), submissionController.getAllSubmissions);
router.post('/:submissionId/evaluate', authenticate, authorize('Examiner', 'Admin', 'Super Admin'), submissionController.evaluateSubmission);

module.exports = router;
