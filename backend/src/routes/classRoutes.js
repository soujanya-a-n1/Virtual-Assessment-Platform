const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/', authenticate, classController.getAllClasses);
router.get('/:id', authenticate, classController.getClassById);
router.post('/', authenticate, authorize('Super Admin', 'Admin'), classController.createClass);
router.put('/:id', authenticate, authorize('Super Admin', 'Admin'), classController.updateClass);
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), classController.deleteClass);

module.exports = router;
