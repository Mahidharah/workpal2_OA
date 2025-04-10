// src/repositories/registeredRepository.js
const Registered = require('../models/registered');

class RegisteredRepository {
  // Create a registration entry or return existing one
  static async findOrCreate({ teacher_email, student_email, registration_date }) {
    try {
      const [registration] = await Registered.findOrCreate({
        where: { teacher_email, student_email },
        defaults: { registration_date },
      });

      // Log the registration details
      console.log('Registration details:', registration.toJSON());

      return registration;
    } catch (error) {
      throw new Error(`Error in registration: ${error.message}`);
    }
  }

  // Fetch students registered under a teacher
  static async findStudentsByTeacher(teacherEmail) {
    const registrations = await Registered.findAll({
      where: { teacher_email: teacherEmail },
      attributes: ['student_email'],
    });

    return registrations.map(registration => registration.student_email);
  }
}

module.exports = RegisteredRepository;