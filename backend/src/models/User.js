const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { hashPassword } = require('../utils/password');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'firstName' // Explicitly map to database column
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'lastName' // Explicitly map to database column
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive' // Explicitly map to database column
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'lastLogin' // Explicitly map to database column
  },
}, {
  timestamps: true,
  tableName: 'users',
  underscored: false, // Use camelCase for auto-generated fields
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await hashPassword(user.password);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await hashPassword(user.password);
      }
    },
  },
});

module.exports = User;
