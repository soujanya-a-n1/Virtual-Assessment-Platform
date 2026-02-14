const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/', authenticate, lecturerController.getAllLecturers);
router.get('/:id', authenticate, lecturerController.getLecturerById);
router.post('/', authenticate, authorize('Super Admin', 'Admin'), lecturerController.createLecturer);
router.put('/:id', authenticate, authorize('Super Admin', 'Admin'), lecturerController.updateLecturer);
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), lecturerController.deleteLecturer);

module.exports = router;
