const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exam = sequelize.define('Exam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false,
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalMarks: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  passingMarks: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  examType: {
    type: DataTypes.ENUM('Online', 'Offline'),
    defaultValue: 'Online',
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Published', 'Scheduled', 'Active', 'Completed'),
    defaultValue: 'Draft',
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  requiresProctoring: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  shuffleQuestions: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  negativeMarkingEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  negativeMarks: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'courses',
      key: 'id',
    },
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  timestamps: true,
  tableName: 'exams',
});

module.exports = Exam;
