const RegisteredRepository = require('../repositories/registeredRepository');

class StudentService {
  static async getCommonStudents(teacherEmails) {
    // Ensure teacherEmails is an array
    if (!Array.isArray(teacherEmails)) {
      teacherEmails = [teacherEmails];
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
}

module.exports = StudentService;