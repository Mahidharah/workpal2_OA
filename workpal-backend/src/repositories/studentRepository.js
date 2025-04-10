// src/repositories/studentRepository.js
const Student = require('../models/student');

class StudentRepository {
  // Find students by their emails
  static async findByEmails(emails) {
    return Student.findAll({ where: { email: emails } });
  }
}

module.exports = StudentRepository;