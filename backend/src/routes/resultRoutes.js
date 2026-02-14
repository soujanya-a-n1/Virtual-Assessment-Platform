const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Student routes
router.get('/my-results', authenticate, authorize('Student'), resultController.getMyResults);

// Shared routes
router.get('/:submissionId/details', authenticate, resultController.getResultDetails);

// Admin/Examiner routes
router.get('/', authenticate, authorize('Admin', 'Super Admin', 'Examiner'), resultController.getAllResults);
router.get('/exam/:examId/statistics', authenticate, authorize('Admin', 'Super Admin', 'Examiner'), resultController.getResultStatistics);

module.exports = router;
