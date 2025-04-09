// src/services/teacherService.js
const TeacherRepository = require('../repositories/teacherRepository');

class TeacherService {
  // Get all teachers using the repository
  static async getAllTeachers() {
    return TeacherRepository.findAll();
  }
}

module.exports = TeacherService;