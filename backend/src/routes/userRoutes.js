const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.post('/', authenticate, authorize('Super Admin', 'Admin'), userController.createUser);
router.get('/', authenticate, authorize('Super Admin', 'Admin'), userController.getAllUsers);
router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), userController.deleteUser);
router.post('/assign-role', authenticate, authorize('Super Admin', 'Admin'), userController.assignRole);
router.post('/remove-role', authenticate, authorize('Super Admin', 'Admin'), userController.removeRole);

module.exports = router;
