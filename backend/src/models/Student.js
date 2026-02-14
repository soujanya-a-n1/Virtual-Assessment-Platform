const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  studentId: {
    type: DataTypes.STRING(50),
    unique: true,
  },
  classId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'classes',
      key: 'id',
    },
  },
  departmentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'departments',
      key: 'id',
    },
  },
  enrollmentYear: {
    type: DataTypes.INTEGER,
  },
  currentSemester: {
    type: DataTypes.INTEGER,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'students',
  timestamps: true,
});

module.exports = Student;
