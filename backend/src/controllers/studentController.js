const { Student, User, Department, Class, Role, UserRole } = require('../models');
const fs = require('fs');
const csv = require('csv-parser');

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        { 
          model: User, 
          as: 'user',
          attributes: { exclude: ['password'] },
        },
        { model: Department, as: 'department' },
        { model: Class, as: 'class' },
      ],
      order: [['id', 'DESC']],
    });
    res.json({ students });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        { 
          model: User, 
          as: 'user',
          attributes: { exclude: ['password'] },
        },
        { model: Department, as: 'department' },
        { model: Class, as: 'class' },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ student });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      studentId,
      classId,
      departmentId,
      enrollmentYear,
      currentSemester,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      isActive: true,
    });

    // Assign Student role
    const studentRole = await Role.findOne({ where: { name: 'Student' } });
    if (studentRole) {
      await UserRole.create({ userId: user.id, roleId: studentRole.id });
    }

    // Create student profile
    const student = await Student.create({
      userId: user.id,
      studentId,
      classId,
      departmentId,
      enrollmentYear,
      currentSemester,
      isActive: true,
    });

    const studentData = await Student.findByPk(student.id, {
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Department, as: 'department' },
        { model: Class, as: 'class' },
      ],
    });

    res.status(201).json({ message: 'Student created successfully', student: studentData });
  } catch (error) {
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      studentId,
      classId,
      departmentId,
      enrollmentYear,
      currentSemester,
      isActive,
    } = req.body;

    const student = await Student.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }],
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update user info
    await student.user.update({ firstName, lastName, phone, isActive });

    // Update student profile
    await student.update({
      studentId,
      classId,
      departmentId,
      enrollmentYear,
      currentSemester,
      isActive,
    });

    const updatedStudent = await Student.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Department, as: 'department' },
        { model: Class, as: 'class' },
      ],
    });

    res.json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // This will cascade delete the user as well
    await User.destroy({ where: { id: student.userId } });

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
};

const importStudentsFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const students = [];
    const errors = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        students.push(row);
      })
      .on('end', async () => {
        const studentRole = await Role.findOne({ where: { name: 'Student' } });

        for (const [index, studentData] of students.entries()) {
          try {
            // Check if user exists
            const existingUser = await User.findOne({ where: { email: studentData.email } });
            if (existingUser) {
              errors.push({ row: index + 1, error: 'Email already exists' });
              continue;
            }

            // Create user
            const user = await User.create({
              firstName: studentData.firstName,
              lastName: studentData.lastName,
              email: studentData.email,
              password: studentData.password || 'Student@123',
              phone: studentData.phone,
              isActive: true,
            });

            // Assign role
            if (studentRole) {
              await UserRole.create({ userId: user.id, roleId: studentRole.id });
            }

            // Create student profile
            await Student.create({
              userId: user.id,
              studentId: studentData.studentId,
              classId: studentData.classId || null,
              departmentId: studentData.departmentId || null,
              enrollmentYear: studentData.enrollmentYear || new Date().getFullYear(),
              currentSemester: studentData.currentSemester || 1,
              isActive: true,
            });
          } catch (error) {
            errors.push({ row: index + 1, error: error.message });
          }
        }

        // Delete uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
          message: 'Import completed',
          totalRows: students.length,
          successCount: students.length - errors.length,
          errorCount: errors.length,
          errors,
        });
      });
  } catch (error) {
    res.status(500).json({ message: 'Error importing students', error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  importStudentsFromCSV,
};
