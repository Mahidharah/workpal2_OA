// src/controllers/teacherController.js
const TeacherService = require('../services/teacherService');

class TeacherController {
  // Endpoint to get all teachers
  static async getAll(req, res) {
    try {
      const teachers = await TeacherService.getAllTeachers();
      res.status(200).json(teachers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = TeacherController;