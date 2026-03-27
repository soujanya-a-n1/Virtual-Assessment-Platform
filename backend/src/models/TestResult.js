const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TestResult = sequelize.define('TestResult', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  submissionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'coding_submissions',
      key: 'id',
    },
  },
  testCaseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'test_cases',
      key: 'id',
    },
  },
  passed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  actualOutput: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  executionTime: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'test_results',
  timestamps: true,
  updatedAt: false,
});

module.exports = TestResult;
