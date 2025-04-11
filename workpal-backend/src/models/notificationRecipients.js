// src/models/notificationRecipients.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Notification = require('./notification');
const Student = require('./student');  // Assuming you have a Student model

// Define the Notification_Recipients model (many-to-many relationship between Notification and Student)
const NotificationRecipients = sequelize.define('Notification_Recipients', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // Default primary key
  },
  notification_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Notification,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  student_email: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Student,
      key: 'email',
    },
    onDelete: 'CASCADE',
  }
}, {
  tableName: 'Notification_Recipients',
  timestamps: false,
  freezeTableName: true,
  indexes: [
    {
      unique: true,
      fields: ['notification_id', 'student_email']
    }
  ]
});

module.exports = NotificationRecipients;