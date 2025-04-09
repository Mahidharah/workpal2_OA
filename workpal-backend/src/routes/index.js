// src/routes/index.js
const express = require('express');
const TeacherController = require('../controllers/teacherController');

const router = express.Router();

// Define the route to get all teachers
router.get('/api/teachers', TeacherController.getAll);

module.exports = router;