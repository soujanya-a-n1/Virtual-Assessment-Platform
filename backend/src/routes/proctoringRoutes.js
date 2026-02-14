const express = require('express');
const router = express.Router();
const proctoringController = require('../controllers/proctoringController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.post('/log', authenticate, proctoringController.logProctoringEvent);
router.get('/:submissionId/logs', authenticate, proctoringController.getProctoringLogs);
router.get('/:submissionId/report', authenticate, authorize('Proctor', 'Admin', 'Super Admin'), proctoringController.getProctoringReport);

module.exports = router;
