const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TestCase = sequelize.define('TestCase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  codingQuestionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'coding_questions',
      key: 'id',
    },
  },
  input: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expectedOutput: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isVisible: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'test_cases',
  timestamps: true,
});

module.exports = TestCase;
