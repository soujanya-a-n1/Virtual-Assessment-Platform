const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentExamEnrollment = sequelize.define('StudentExamEnrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  enrollmentStatus: {
    type: DataTypes.ENUM('Active', 'Completed', 'Cancelled', 'Pending'),
    defaultValue: 'Active',
  },
  enrolledAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'student_exam_enrollments',
});

module.exports = StudentExamEnrollment;
