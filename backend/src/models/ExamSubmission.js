const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExamSubmission = sequelize.define('ExamSubmission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  examId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'exams',
      key: 'id',
    },
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  submitTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  totalTimeSpent: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Not Started', 'In Progress', 'Submitted', 'Evaluated', 'Failed'),
    defaultValue: 'Not Started',
  },
  obtainedMarks: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  evaluatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  evaluationNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  evaluatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isPassed: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  autoSubmitted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  cheatingDetected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  cheatingDetails: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'exam_submissions',
});

module.exports = ExamSubmission;
