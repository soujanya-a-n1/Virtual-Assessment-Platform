const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  userName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Display name of the user who sent the message'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userRole: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  sessionId: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  isResolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isGlobal: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'If true, message is visible to all users (shared chat)'
  }
}, {
  tableName: 'chat_messages',
  timestamps: true
});

module.exports = ChatMessage;
