// src/routes/index.js
const express = require('express');
const router = express.Router();
const TeacherController = require('../controllers/teacherController');
const RegisterController = require('../controllers/registerController');
const StudentController = require('../controllers/studentController.js');
const NotificationController = require('../controllers/notificationController');


// Endpoint to get all teachers
router.get('/api/teachers', TeacherController.getAll);

// Endpoint to register students to a teacher
router.post('/api/register', RegisterController.registerStudents);

// Endpoint to get common students
router.get('/api/commonstudents', StudentController.getCommonStudents);

// Endpoint to suspend a student  
router.post('/api/suspend', StudentController.suspendStudent);

// Endpoint to retrieve notification recipients after creating a notification
router.post('/api/retrievefornotifications', NotificationController.retrieveForNotifications);

module.exports = router;