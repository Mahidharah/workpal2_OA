// src/repositories/teacherRepository.js
const Teacher = require('../models/teacher');

class TeacherRepository {
  // Get all teachers from the database
  static async findAll() {
    return Teacher.findAll();
  }
}

module.exports = TeacherRepository;