// src/server.js
const express = require('express');
const routes = require('./routes');
require('dotenv').config();
const sequelize = require('./config/database');

const Teacher = require('./models/teacher');
const Student = require('./models/student');
const Registered = require('./models/registered');

// Define Associations After Models Are Loaded
Teacher.hasMany(Registered, { foreignKey: 'teacher_email' });
Student.hasMany(Registered, { foreignKey: 'student_email' });
Registered.belongsTo(Teacher, { foreignKey: 'teacher_email' });
Registered.belongsTo(Student, { foreignKey: 'student_email' });

const app = express();
app.use(express.json());

app.use(routes);

// Sync Sequelize models with the database
sequelize.sync().then(() => {
  console.log('Database synchronized');
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}).catch((err) => {
  console.error('Error synchronizing the database:', err);
});

module.exports = app;  // Export app for testing