const { StudentExamEnrollment, Exam, Student, User, Course, Class } = require('../models');
const { Op } = require('sequelize');

// Assign students to an exam
const assignStudentsToExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { studentIds, classIds, courseId } = req.body;

    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    let studentsToEnroll = [];

    // If specific student IDs are provided
    if (studentIds && studentIds.length > 0) {
      studentsToEnroll = studentIds;
    }
    // If class IDs are provided, get all students from those classes
    else if (classIds && classIds.length > 0) {
      const students = await Student.findAll({
        where: { classId: { [Op.in]: classIds }, isActive: true },
        attributes: ['userId']
      });
      studentsToEnroll = students.map(s => s.userId);
    }
    // If course ID is provided, get all students enrolled in that course
    else if (courseId) {
      const students = await Student.findAll({
        include: [{
          model: Class,
          as: 'class',
          where: { isActive: true }
        }],
        where: { isActive: true },
        attributes: ['userId']
      });
      studentsToEnroll = students.map(s => s.userId);
    }

    if (studentsToEnroll.length === 0) {
      return res.status(400).json({ message: 'No students to enroll' });
    }

    // Create enrollments
    const enrollments = [];
    for (const userId of studentsToEnroll) {
      // Check if already enrolled
      const existing = await StudentExamEnrollment.findOne({
        where: { userId, examId }
      });

      if (!existing) {
        enrollments.push({
          userId,
          examId,
          enrollmentStatus: 'Active',
          enrolledAt: new Date()
        });
      }
    }

    if (enrollments.length > 0) {
      await StudentExamEnrollment.bulkCreate(enrollments);
    }

    res.status(201).json({
      message: `${enrollments.length} student(s) enrolled successfully`,
      enrolledCount: enrollments.length,
      skippedCount: studentsToEnroll.length - enrollments.length
    });
  } catch (error) {
    console.error('Error assigning students to exam:', error);
    res.status(500).json({ message: 'Error assigning students', error: error.message });
  }
};

// Get enrolled students for an exam
const getExamEnrollments = async (req, res) => {
  try {
    const { examId } = req.params;

    const enrollments = await StudentExamEnrollment.findAll({
      where: { examId },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [{
            model: Student,
            as: 'studentProfile',
            attributes: ['studentId', 'classId', 'departmentId'],
            include: [
              {
                model: Class,
                as: 'class',
                attributes: ['name', 'code']
              }
            ]
          }]
        }
      ],
      order: [['enrolledAt', 'DESC']]
    });

    res.json({ enrollments });
  } catch (error) {
    console.error('Error fetching exam enrollments:', error);
    res.status(500).json({ message: 'Error fetching enrollments', error: error.message });
  }
};

// Remove student from exam
const removeStudentFromExam = async (req, res) => {
  try {
    const { examId, userId } = req.params;

    const result = await StudentExamEnrollment.destroy({
      where: { examId, userId }
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({ message: 'Student removed from exam successfully' });
  } catch (error) {
    console.error('Error removing student from exam:', error);
    res.status(500).json({ message: 'Error removing student', error: error.message });
  }
};

// Get available students for assignment (not yet enrolled)
const getAvailableStudents = async (req, res) => {
  try {
    const { examId } = req.params;
    const { courseId, classId } = req.query;

    // Get already enrolled student IDs
    const enrolledStudents = await StudentExamEnrollment.findAll({
      where: { examId },
      attributes: ['userId']
    });
    const enrolledUserIds = enrolledStudents.map(e => e.userId);

    // Build where clause
    const whereClause = {
      isActive: true,
      userId: { [Op.notIn]: enrolledUserIds.length > 0 ? enrolledUserIds : [0] }
    };

    if (classId) {
      whereClause.classId = classId;
    }

    // Get available students
    const students = await Student.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'code']
        }
      ],
      order: [['studentId', 'ASC']]
    });

    res.json({ students });
  } catch (error) {
    console.error('Error fetching available students:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

// Get classes for assignment
const getClassesForAssignment = async (req, res) => {
  try {
    const { courseId } = req.query;

    const whereClause = { isActive: true };
    
    const classes = await Class.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'code', 'academicYear', 'semester'],
      include: [{
        model: Student,
        as: 'students',
        attributes: ['id'],
        where: { isActive: true },
        required: false
      }],
      order: [['name', 'ASC']]
    });

    // Add student count to each class
    const classesWithCount = classes.map(cls => ({
      ...cls.toJSON(),
      studentCount: cls.students ? cls.students.length : 0
    }));

    res.json({ classes: classesWithCount });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Error fetching classes', error: error.message });
  }
};

// Bulk update enrollment status
const updateEnrollmentStatus = async (req, res) => {
  try {
    const { examId } = req.params;
    const { userIds, status } = req.body;

    if (!['Active', 'Completed', 'Cancelled', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await StudentExamEnrollment.update(
      { enrollmentStatus: status },
      {
        where: {
          examId,
          userId: { [Op.in]: userIds }
        }
      }
    );

    res.json({ message: 'Enrollment status updated successfully' });
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

module.exports = {
  assignStudentsToExam,
  getExamEnrollments,
  removeStudentFromExam,
  getAvailableStudents,
  getClassesForAssignment,
  updateEnrollmentStatus
};
