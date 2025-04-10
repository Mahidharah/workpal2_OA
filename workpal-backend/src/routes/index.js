// src/routes/index.js
const express = require('express');
const router = express.Router();
const TeacherController = require('../controllers/teacherController');
const RegisterController = require('../controllers/registerController');
const StudentController = require('../controllers/studentController.js');

// Define the route to get all teachers
router.get('/api/teachers', TeacherController.getAll);

// Route to register students to a teacher
router.post('/api/register', RegisterController.registerStudents);

// Endpoint to get common students
router.get('/api/commonstudents', StudentController.getCommonStudents);

module.exports = router;