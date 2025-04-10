// src/repositories/teacherRepository.js
const Teacher = require('../models/teacher');

class TeacherRepository {
  // Find a teacher by email
  static async findByEmail(email) {
    return Teacher.findOne({ where: { email } });
  }

  // Get all teachers
  static async findAll() {
    return Teacher.findAll();
  }
}

module.exports = TeacherRepository;