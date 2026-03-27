const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CodingQuestion = sequelize.define('CodingQuestion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  examId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'exams',
      key: 'id',
    },
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'courses',
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  language: {
    type: DataTypes.ENUM('python', 'javascript', 'java', 'cpp', 'c', 'csharp', 'nodejs'),
    defaultValue: 'python',
  },
  inputFormat: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  outputFormat: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sampleInput: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sampleOutput: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  starterCode: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  difficulty: {
    type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
    defaultValue: 'Medium',
  },
  marks: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 10.00,
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 5, // seconds
  },
  memoryLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 256, // MB
  },
}, {
  tableName: 'coding_questions',
  timestamps: true,
});

module.exports = CodingQuestion;
