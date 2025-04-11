// src/models/notification.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Teacher = require('./teacher');  // Assuming you have a Teacher model

// Define the Notification model
const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sender_email: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Teacher,
      key: 'email',  // Foreign key to Teacher's email
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date_sent: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,  // Default to current timestamp
  },
}, {
  tableName: 'Notification',
  timestamps: false,  // We do not need createdAt/updatedAt columns
});


module.exports = Notification;
