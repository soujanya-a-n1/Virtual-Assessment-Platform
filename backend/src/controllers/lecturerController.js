const { Lecturer, User, Department, Course, Role, UserRole } = require('../models');
const { hashPassword } = require('../utils/password');

const getAllLecturers = async (req, res) => {
  try {
    const lecturers = await Lecturer.findAll({
      include: [
        { 
          model: User, 
          as: 'user',
          attributes: { exclude: ['password'] },
        },
        { model: Department, as: 'department' },
        { model: Course, as: 'courses', through: { attributes: [] } },
      ],
      order: [['id', 'DESC']],
    });
    res.json({ lecturers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lecturers', error: error.message });
  }
};

const getLecturerById = async (req, res) => {
  try {
    const lecturer = await Lecturer.findByPk(req.params.id, {
      include: [
        { 
          model: User, 
          as: 'user',
          attributes: { exclude: ['password'] },
        },
        { model: Department, as: 'department' },
        { model: Course, as: 'courses', through: { attributes: [] } },
      ],
    });

    if (!lecturer) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    res.json({ lecturer });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lecturer', error: error.message });
  }
};

const createLecturer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      employeeId,
      departmentId,
      qualification,
      specialization,
      joiningDate,
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

    // Assign Examiner role
    const examinerRole = await Role.findOne({ where: { name: 'Examiner' } });
    if (examinerRole) {
      await UserRole.create({ userId: user.id, roleId: examinerRole.id });
    }

    // Create lecturer profile
    const lecturer = await Lecturer.create({
      userId: user.id,
      employeeId,
      departmentId,
      qualification,
      specialization,
      joiningDate,
      isActive: true,
    });

    const lecturerData = await Lecturer.findByPk(lecturer.id, {
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Department, as: 'department' },
      ],
    });

    res.status(201).json({ message: 'Lecturer created successfully', lecturer: lecturerData });
  } catch (error) {
    res.status(500).json({ message: 'Error creating lecturer', error: error.message });
  }
};

const updateLecturer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      employeeId,
      departmentId,
      qualification,
      specialization,
      joiningDate,
      isActive,
    } = req.body;

    const lecturer = await Lecturer.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }],
    });

    if (!lecturer) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    // Update user info
    await lecturer.user.update({ firstName, lastName, phone, isActive });

    // Update lecturer profile
    await lecturer.update({
      employeeId,
      departmentId,
      qualification,
      specialization,
      joiningDate,
      isActive,
    });

    const updatedLecturer = await Lecturer.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Department, as: 'department' },
      ],
    });

    res.json({ message: 'Lecturer updated successfully', lecturer: updatedLecturer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating lecturer', error: error.message });
  }
};

const deleteLecturer = async (req, res) => {
  try {
    const lecturer = await Lecturer.findByPk(req.params.id);

    if (!lecturer) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    // This will cascade delete the user as well
    await User.destroy({ where: { id: lecturer.userId } });

    res.json({ message: 'Lecturer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lecturer', error: error.message });
  }
};

const assignCourses = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseIds } = req.body;

    const lecturer = await Lecturer.findByPk(id);
    if (!lecturer) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    const { CourseLecturer } = require('../models');

    // Remove all existing course assignments
    await CourseLecturer.destroy({ where: { lecturerId: id } });

    // Add new course assignments
    if (courseIds && courseIds.length > 0) {
      const assignments = courseIds.map(courseId => ({
        courseId,
        lecturerId: id,
      }));
      await CourseLecturer.bulkCreate(assignments);
    }

    res.json({ message: 'Courses assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning courses', error: error.message });
  }
};

module.exports = {
  getAllLecturers,
  getLecturerById,
  createLecturer,
  updateLecturer,
  deleteLecturer,
  assignCourses,
};
