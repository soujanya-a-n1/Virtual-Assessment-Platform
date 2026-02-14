const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lecturer = sequelize.define('Lecturer', {
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
  employeeId: {
    type: DataTypes.STRING(50),
    unique: true,
  },
  departmentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'departments',
      key: 'id',
    },
  },
  qualification: {
    type: DataTypes.STRING(100),
  },
  specialization: {
    type: DataTypes.STRING(100),
  },
  joiningDate: {
    type: DataTypes.DATEONLY,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'lecturers',
  timestamps: true,
});

module.exports = Lecturer;
