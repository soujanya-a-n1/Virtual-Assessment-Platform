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
    type: DataTypes.ENUM('C', 'C++', 'Java', 'C#', 'Node.js', 'Python', 'JavaScript'),
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
  compilationError: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  marksObtained: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  },
  totalTestCases: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  passedTestCases: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'coding_submissions',
  timestamps: true,
});

// Associations will be set up in backend/src/models/index.js
// CodingSubmission.hasMany(TestResult, { foreignKey: 'submissionId', as: 'testResults' })

module.exports = CodingSubmission;
