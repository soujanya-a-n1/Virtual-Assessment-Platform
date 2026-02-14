const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  questionType: {
    type: DataTypes.ENUM('Multiple Choice', 'True/False', 'Short Answer', 'Essay', 'Matching'),
    allowNull: false,
  },
  marks: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
    defaultValue: 'Medium',
  },
  optionA: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  optionB: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  optionC: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  optionD: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  correctAnswer: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'questions',
});

module.exports = Question;
