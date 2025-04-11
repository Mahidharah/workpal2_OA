// src/repositories/studentRepository.js
const Student = require('../models/student');

class StudentRepository {
  // Find students by their emails
  static async findByEmails(emails) {
    return Student.findAll({ where: { email: emails } });
  }

  // Find a student by their email
  static async findByEmail(email) {
    return Student.findOne({ where: { email } });
  }

  // Find all students who are not suspended
  static async findAllNotSuspended() {
    return Student.findAll({ where: { suspended: false } });
  }
}

module.exports = StudentRepository;