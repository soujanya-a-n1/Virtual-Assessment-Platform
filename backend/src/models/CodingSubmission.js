const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CodingSubmission = sequelize.define('CodingSubmission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  codingQuestionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'coding_questions',
      key: 'id',
    },
  },
  submissionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'exam_submissions',
      key: 'id',
    },
  },
  language: {
    type: DataTypes.ENUM('C', 'C++', 'Java', 'Python'),
    allowNull: false,
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  submissionTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  executionTime: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Submitted', 'Running', 'Passed', 'Failed', 'Error'),
    defaultValue: 'Submitted',
  },
  output: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  error: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  marksObtained: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  },
}, {
  tableName: 'coding_submissions',
  timestamps: true,
});

module.exports = CodingSubmission;
