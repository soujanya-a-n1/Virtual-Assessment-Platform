const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'departments',
  timestamps: true,
});

module.exports = Department;
