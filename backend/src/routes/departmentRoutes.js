const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/', authenticate, departmentController.getAllDepartments);
router.get('/:id', authenticate, departmentController.getDepartmentById);
router.post('/', authenticate, authorize('Super Admin', 'Admin'), departmentController.createDepartment);
router.put('/:id', authenticate, authorize('Super Admin', 'Admin'), departmentController.updateDepartment);
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), departmentController.deleteDepartment);

module.exports = router;
