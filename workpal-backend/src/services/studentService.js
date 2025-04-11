const RegisteredRepository = require('../repositories/registeredRepository');
const StudentRepository = require('../repositories/studentRepository');
const TeacherRepository = require('../repositories/teacherRepository');
const sequelize = require('../config/database'); // Assuming you have a Sequelize instance

class StudentService {
  static async getCommonStudents(teacherEmails) {
    // Ensure teacherEmails is an array
    if (!Array.isArray(teacherEmails)) {
      teacherEmails = [teacherEmails];
    }

    // Validate that at least one teacher email is provided
    const teachers = await TeacherRepository.findByEmails(teacherEmails);

    if (teachers.length < teacherEmails.length) {
      // If not all teachers are found, throw an error
      throw new Error('Teacher not found');
    }

    // Find the students for each teacher
    const studentLists = await Promise.all(
      teacherEmails.map((email) => RegisteredRepository.findStudentsByTeacher(email))
    );

    // Find the intersection of all the student lists (students common to all teachers)
    const commonStudents = studentLists.reduce((acc, students, index) => {
      if (index === 0) return students;
      return acc.filter((student) => students.includes(student));
    });

    return commonStudents;
  }

  static async suspendStudent(studentEmail) {
    const transaction = await sequelize.transaction(); // Start a transaction

    try {
      // Find the student
      const student = await StudentRepository.findByEmail(studentEmail);

      if (!student) {
        throw new Error('Student not found');
      }

      if (student.is_suspended) {
        throw new Error('Student already suspended');
      }

      // Set the student's suspension status to true
      student.is_suspended = true;

      // Delete all registrations associated with the student within the same transaction
      await RegisteredRepository.deleteByStudentEmail(student, transaction);

      // Save the student object (set is_suspended = true)
      await student.save({ transaction });

      // Commit the transaction if everything is successful
      await transaction.commit();
      console.log(`Student ${studentEmail} has been suspended and registrations deleted.`);
      return true;
    } catch (error) {
      // Rollback the transaction if anything goes wrong
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = StudentService;