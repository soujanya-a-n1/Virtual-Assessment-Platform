const { Department, Course, Class, Lecturer, Student } = require('../models');

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [
        { model: Course, as: 'courses' },
        { model: Class, as: 'classes' },
      ],
      order: [['name', 'ASC']],
    });
    res.json({ departments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments', error: error.message });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id, {
      include: [
        { model: Course, as: 'courses' },
        { model: Class, as: 'classes' },
        { model: Lecturer, as: 'lecturers' },
        { model: Student, as: 'students' },
      ],
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ department });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching department', error: error.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, code, description, isActive } = req.body;

    const existingDept = await Department.findOne({ where: { code } });
    if (existingDept) {
      return res.status(400).json({ message: 'Department code already exists' });
    }

    const department = await Department.create({
      name,
      code,
      description,
      isActive,
    });

    res.status(201).json({ message: 'Department created successfully', department });
  } catch (error) {
    res.status(500).json({ message: 'Error creating department', error: error.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { name, code, description, isActive } = req.body;
    const department = await Department.findByPk(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await department.update({ name, code, description, isActive });
    res.json({ message: 'Department updated successfully', department });
  } catch (error) {
    res.status(500).json({ message: 'Error updating department', error: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await department.destroy();
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting department', error: error.message });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
