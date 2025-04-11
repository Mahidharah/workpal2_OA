// src/repositories/teacherRepository.js
const Teacher = require('../models/teacher');

class TeacherRepository {
  // Find a teacher by email
  static async findByEmail(email) {
    return Teacher.findOne({ where: { email } });
  }

  // Find teachers by a list of emails
  static async findByEmails(emails) {
    return Teacher.findAll({ where: { email: emails } });
  }

  // Get all teachers
  static async findAll() {
    return Teacher.findAll();
  }
}

module.exports = TeacherRepository;