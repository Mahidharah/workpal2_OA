// src/models/student.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define Student model
const Student = sequelize.define('Student', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,  // Make email the primary key
  },
  is_suspended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,  // Default value for suspension status
  },
}, {
  tableName: 'Student',
  timestamps: false,  // We do not want createdAt/updatedAt columns
});

module.exports = Student;