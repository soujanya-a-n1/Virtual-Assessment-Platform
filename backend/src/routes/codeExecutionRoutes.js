const express = require('express');
const router = express.Router();
const codeExecutionController = require('../controllers/codeExecutionController');
const authenticate = require('../middleware/authenticate');

router.post('/execute', authenticate, codeExecutionController.executeCode);
router.get('/runtimes', authenticate, codeExecutionController.getRuntimes);

module.exports = router;
