// src/services/registerService.js
const TeacherRepository = require('../repositories/teacherRepository');
const StudentRepository = require('../repositories/studentRepository');
const RegisteredRepository = require('../repositories/registeredRepository');

class RegisterService {
  // Register students under a teacher
  static async registerStudentsToTeacher(teacherEmail, students) {
    // Find the teacher by email
    const teacher = await TeacherRepository.findByEmail(teacherEmail);
    if (!teacher) {
      throw new Error('Teacher not found: ' + teacherEmail);
    }

    // Extract only the email addresses from the student list
    const studentEmails = students;  // `students` is an array of emails

    // Find all students by email
    const studentRecords = await StudentRepository.findByEmails(studentEmails);

    // Check if any students are suspended
    const suspendedStudents = studentRecords.filter(student => student.is_suspended);
    if (suspendedStudents.length > 0) {
      // Log the suspended students
      console.log('Suspended students:', suspendedStudents.map(student => student.email));
      throw new Error('Students to be registered are suspended: ' + suspendedStudents.map(student => student.email).join(', '));
    }

    // Check if all students exist
    if (studentRecords.length !== studentEmails.length) {
      // Log the missing students
      const missingStudents = studentEmails.filter(email => !studentRecords.some(student => student.email === email));
      console.log('Missing students:', missingStudents);
      throw new Error('One or more students not found: ' + missingStudents.join(', '));
    }

    // Create registrations for each student
    const registrationPromises = studentEmails.map(email => {
      return RegisteredRepository.findOrCreate({
        teacher_email: teacherEmail,
        student_email: email,  // Using email directly here since it's available
        registration_date: new Date(),
      });
    });

    // Wait for all registrations to be created
    await Promise.all(registrationPromises);
  }
}

module.exports = RegisterService;
