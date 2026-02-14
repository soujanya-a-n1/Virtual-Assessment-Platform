const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentAnswer = sequelize.define('StudentAnswer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentAnswer: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  marksObtained: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  answeredAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  lastModifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isReviewed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
  tableName: 'student_answers',
});

module.exports = StudentAnswer;
