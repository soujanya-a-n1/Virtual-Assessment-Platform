const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const authenticate = require('../middleware/authenticate');

// All routes require authentication
router.use(authenticate);

// Get chat history
router.get('/history', chatbotController.getChatHistory);

// Send message
router.post('/message', chatbotController.sendMessage);

// Get quick suggestions
router.get('/suggestions', chatbotController.getQuickSuggestions);

// Clear chat history
router.delete('/history', chatbotController.clearChatHistory);

module.exports = router;
