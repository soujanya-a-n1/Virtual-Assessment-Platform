const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProctoringLog = sequelize.define('ProctoringLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  eventType: {
    type: DataTypes.ENUM('Tab Switch', 'Copy Paste', 'Right Click', 'Fullscreen Exit', 'Camera Off', 'Microphone Off'),
    allowNull: false,
  },
  severity: {
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    defaultValue: 'Medium',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: 'proctoring_logs',
});

module.exports = ProctoringLog;
