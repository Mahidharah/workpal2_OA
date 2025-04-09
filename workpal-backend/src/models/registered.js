// src/models/registered.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Teacher = require('./teacher');
const Student = require('./student');

// Define Registered model (many-to-many relationship between Teacher and Student)
const Registered = sequelize.define('Registered', {
  teacher_email: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Teacher,
      key: 'email',  // Foreign key to Teacher's email
    },
    onDelete: 'CASCADE',
  },
  student_email: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Student,
      key: 'email',  // Foreign key to Student's email
    },
    onDelete: 'CASCADE',
  },
  registration_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'Registered',
  timestamps: false,  // We do not want createdAt/updatedAt columns
});

// Define the composite primary key for the Registered table
Registered.removeAttribute('id');  // Ensure no unnecessary ID field
Registered.primaryKey = ['teacher_email', 'student_email'];  // Composite primary key

module.exports = Registered;