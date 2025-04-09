// src/models/teacher.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Registered = require('./registered');

// Define Teacher model
const Teacher = sequelize.define('Teacher', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,  // Make email the primary key
  },
}, {
  tableName: 'Teacher',
  timestamps: false,  // We do not want createdAt/updatedAt columns
});

module.exports = Teacher;