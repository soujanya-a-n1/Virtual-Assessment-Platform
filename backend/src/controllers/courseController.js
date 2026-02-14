const { Course, Department, Lecturer, CourseLecturer } = require('../models');

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        { model: Department, as: 'department' },
        { model: Lecturer, as: 'lecturers', through: { attributes: [] } },
      ],
      order: [['name', 'ASC']],
    });
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: Department, as: 'department' },
        { model: Lecturer, as: 'lecturers', through: { attributes: [] } },
      ],
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { name, code, description, credits, departmentId, isActive } = req.body;

    const existingCourse = await Course.findOne({ where: { code } });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course code already exists' });
    }

    const course = await Course.create({
      name,
      code,
      description,
      credits,
      departmentId,
      isActive,
    });

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { name, code, description, credits, departmentId, isActive } = req.body;
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.update({ name, code, description, credits, departmentId, isActive });
    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

const assignLecturer = async (req, res) => {
  try {
    const { courseId, lecturerId } = req.body;

    const course = await Course.findByPk(courseId);
    const lecturer = await Lecturer.findByPk(lecturerId);

    if (!course || !lecturer) {
      return res.status(404).json({ message: 'Course or Lecturer not found' });
    }

    const existing = await CourseLecturer.findOne({ where: { courseId, lecturerId } });
    if (existing) {
      return res.status(400).json({ message: 'Lecturer already assigned to this course' });
    }

    await CourseLecturer.create({ courseId, lecturerId });
    res.status(201).json({ message: 'Lecturer assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning lecturer', error: error.message });
  }
};

const removeLecturer = async (req, res) => {
  try {
    const { courseId, lecturerId } = req.body;

    const result = await CourseLecturer.destroy({ where: { courseId, lecturerId } });

    if (result === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ message: 'Lecturer removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing lecturer', error: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  assignLecturer,
  removeLecturer,
};
