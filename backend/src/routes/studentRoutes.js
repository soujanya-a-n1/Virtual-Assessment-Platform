const express = require('express');
const router = express.Router();
const multer = require('multer');
const studentController = require('../controllers/studentController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Configure multer for CSV upload
const upload = multer({ dest: 'uploads/csv/' });

router.get('/', authenticate, studentController.getAllStudents);
router.get('/:id', authenticate, studentController.getStudentById);
router.post('/', authenticate, authorize('Super Admin', 'Admin'), studentController.createStudent);
router.put('/:id', authenticate, authorize('Super Admin', 'Admin'), studentController.updateStudent);
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), studentController.deleteStudent);
router.post('/import-csv', authenticate, authorize('Super Admin', 'Admin'), upload.single('file'), studentController.importStudentsFromCSV);

module.exports = router;
