const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/', authenticate, courseController.getAllCourses);
router.get('/:id', authenticate, courseController.getCourseById);
router.post('/', authenticate, authorize('Super Admin', 'Admin'), courseController.createCourse);
router.put('/:id', authenticate, authorize('Super Admin', 'Admin'), courseController.updateCourse);
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), courseController.deleteCourse);
router.post('/assign-lecturer', authenticate, authorize('Super Admin', 'Admin'), courseController.assignLecturer);
router.post('/remove-lecturer', authenticate, authorize('Super Admin', 'Admin'), courseController.removeLecturer);
router.post('/:id/lecturers', authenticate, authorize('Super Admin', 'Admin'), courseController.assignLecturers);

module.exports = router;
