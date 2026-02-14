const { Class, Department, Student } = require('../models');

const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        { model: Department, as: 'department' },
        { model: Student, as: 'students' },
      ],
      order: [['name', 'ASC']],
    });
    res.json({ classes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes', error: error.message });
  }
};

const getClassById = async (req, res) => {
  try {
    const classData = await Class.findByPk(req.params.id, {
      include: [
        { model: Department, as: 'department' },
        { model: Student, as: 'students' },
      ],
    });

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({ class: classData });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class', error: error.message });
  }
};

const createClass = async (req, res) => {
  try {
    const { name, code, departmentId, academicYear, semester, isActive } = req.body;

    const existingClass = await Class.findOne({ where: { code } });
    if (existingClass) {
      return res.status(400).json({ message: 'Class code already exists' });
    }

    const classData = await Class.create({
      name,
      code,
      departmentId,
      academicYear,
      semester,
      isActive,
    });

    res.status(201).json({ message: 'Class created successfully', class: classData });
  } catch (error) {
    res.status(500).json({ message: 'Error creating class', error: error.message });
  }
};

const updateClass = async (req, res) => {
  try {
    const { name, code, departmentId, academicYear, semester, isActive } = req.body;
    const classData = await Class.findByPk(req.params.id);

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await classData.update({ name, code, departmentId, academicYear, semester, isActive });
    res.json({ message: 'Class updated successfully', class: classData });
  } catch (error) {
    res.status(500).json({ message: 'Error updating class', error: error.message });
  }
};

const deleteClass = async (req, res) => {
  try {
    const classData = await Class.findByPk(req.params.id);

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await classData.destroy();
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting class', error: error.message });
  }
};

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
};
