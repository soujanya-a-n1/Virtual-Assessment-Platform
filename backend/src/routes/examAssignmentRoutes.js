const express = require('express');
const router = express.Router();
const {
  assignStudentsToExam,
  getExamEnrollments,
  removeStudentFromExam,
  getAvailableStudents,
  getClassesForAssignment,
  updateEnrollmentStatus
} = require('../controllers/examAssignmentController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// All routes require authentication
router.use(authenticate);

// Assign students to exam (Admin, Examiner only)
router.post(
  '/exams/:examId/assign',
  authorize(['Admin', 'Super Admin', 'Examiner']),
  assignStudentsToExam
);

// Get exam enrollments
router.get(
  '/exams/:examId/enrollments',
  authorize(['Admin', 'Super Admin', 'Examiner', 'Proctor']),
  getExamEnrollments
);

// Remove student from exam
router.delete(
  '/exams/:examId/enrollments/:userId',
  authorize(['Admin', 'Super Admin', 'Examiner']),
  removeStudentFromExam
);

// Get available students for assignment
router.get(
  '/exams/:examId/available-students',
  authorize(['Admin', 'Super Admin', 'Examiner']),
  getAvailableStudents
);

// Get classes for assignment
router.get(
  '/classes-for-assignment',
  authorize(['Admin', 'Super Admin', 'Examiner']),
  getClassesForAssignment
);

// Update enrollment status
router.put(
  '/exams/:examId/enrollments/status',
  authorize(['Admin', 'Super Admin', 'Examiner']),
  updateEnrollmentStatus
);

module.exports = router;
