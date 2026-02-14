const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  departmentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'departments',
      key: 'id',
    },
  },
  academicYear: {
    type: DataTypes.STRING(20),
  },
  semester: {
    type: DataTypes.STRING(20),
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'classes',
  timestamps: true,
});

module.exports = Class;
