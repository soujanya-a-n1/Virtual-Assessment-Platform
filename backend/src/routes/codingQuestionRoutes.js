const express = require('express');
const router = express.Router();
const codingQuestionController = require('../controllers/codingQuestionController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Coding Questions CRUD
router.get('/', authenticate, codingQuestionController.getAllCodingQuestions);
router.get('/:id', authenticate, codingQuestionController.getCodingQuestionById);
router.post('/', authenticate, authorize('Admin', 'Super Admin', 'Examiner'), codingQuestionController.createCodingQuestion);
router.put('/:id', authenticate, authorize('Admin', 'Super Admin', 'Examiner'), codingQuestionController.updateCodingQuestion);
router.delete('/:id', authenticate, authorize('Admin', 'Super Admin', 'Examiner'), codingQuestionController.deleteCodingQuestion);

// Code Submissions
router.post('/submit', authenticate, codingQuestionController.submitCode);
router.get('/submissions/my', authenticate, codingQuestionController.getStudentSubmissions);
router.get('/submissions/all', authenticate, authorize('Admin', 'Super Admin', 'Examiner'), codingQuestionController.getAllSubmissions);

module.exports = router;
