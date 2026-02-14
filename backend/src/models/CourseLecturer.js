const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseLecturer = sequelize.define('CourseLecturer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id',
    },
  },
  lecturerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'lecturers',
      key: 'id',
    },
  },
  assignedDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'course_lecturers',
  timestamps: true,
});

module.exports = CourseLecturer;
