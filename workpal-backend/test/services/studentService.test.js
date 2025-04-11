// tests/services/studentService.test.js
const StudentService = require('../../src/services/studentService');
const RegisteredRepository = require('../../src/repositories/registeredRepository');
const StudentRepository = require('../../src/repositories/studentRepository');
const TeacherRepository = require('../../src/repositories/teacherRepository');
const sequelize = require('../../src/config/database');

// Mock the repository methods
jest.mock('../../src/repositories/registeredRepository');
jest.mock('../../src/repositories/studentRepository');
jest.mock('../../src/repositories/teacherRepository');


describe('StudentService', () => {
  describe('getCommonStudents', () => {
    it('should return common students for valid teachers', async () => {
      const teacherEmails = ['teacherken@gmail.com', 'teacherjoe@gmail.com'];

      const mockTeachers = [
        { email: 'teacherken@gmail.com' },
        { email: 'teacherjoe@gmail.com' },
      ];

      // Mock the repository methods
      TeacherRepository.findByEmails.mockResolvedValue(mockTeachers);
      RegisteredRepository.findStudentsByTeacher.mockResolvedValue([
        'studentagnes@gmail.com', 'studentlucas@gmail.com',
      ]);

      // Mock the second teacher's student list
      RegisteredRepository.findStudentsByTeacher.mockResolvedValueOnce([
        'studentagnes@gmail.com', 'studentmiche@gmail.com',
      ]);

      const commonStudents = await StudentService.getCommonStudents(teacherEmails);

      expect(commonStudents).toEqual(['studentagnes@gmail.com']);
      expect(TeacherRepository.findByEmails).toHaveBeenCalledWith(teacherEmails);
      expect(RegisteredRepository.findStudentsByTeacher).toHaveBeenCalledTimes(2);
    });

    it('should throw an error if any teacher is not found', async () => {
      const teacherEmails = ['nonexistentteacher@gmail.com'];

      // Mock that the teacher is not found
      TeacherRepository.findByEmails.mockResolvedValue([]);

      try {
        await StudentService.getCommonStudents(teacherEmails);
      } catch (error) {
        expect(error.message).toBe('Teacher not found');
      }
    });
  });

  describe('suspendStudent', () => {
    it('should suspend a student and delete their registrations', async () => {
      const studentEmail = 'studenttobesuspended@gmail.com';
      const mockStudent = { email: studentEmail, is_suspended: false, save: jest.fn() };

      // Mock the repository methods
      StudentRepository.findByEmail.mockResolvedValue(mockStudent);
      RegisteredRepository.deleteByStudentEmail.mockResolvedValue(true);

      const result = await StudentService.suspendStudent(studentEmail);

      expect(result).toBe(true);
      expect(mockStudent.is_suspended).toBe(true);
      expect(StudentRepository.findByEmail).toHaveBeenCalledWith(studentEmail);
      expect(RegisteredRepository.deleteByStudentEmail).toHaveBeenCalledWith(mockStudent, expect.any(Object));
      expect(mockStudent.save).toHaveBeenCalled();
    });

    it('should throw an error if student is not found', async () => {
      const studentEmail = 'nonexistentstudent@example.com';

      // Mock that the student is not found
      StudentRepository.findByEmail.mockResolvedValue(null);

      try {
        await StudentService.suspendStudent(studentEmail);
      } catch (error) {
        expect(error.message).toBe('Student not found');
      }
    });

    it('should throw an error if student is already suspended', async () => {
      const studentEmail = 'suspendedstudent@example.com';
      const mockStudent = { email: studentEmail, is_suspended: true, save: jest.fn() };

      // Mock the repository methods
      StudentRepository.findByEmail.mockResolvedValue(mockStudent);

      try {
        await StudentService.suspendStudent(studentEmail);
      } catch (error) {
        expect(error.message).toBe('Student already suspended');
      }
    });

    it('should handle transaction rollback in case of failure', async () => {
      const studentEmail = 'studenttobesuspended@gmail.com';
      const mockStudent = { email: studentEmail, is_suspended: false, save: jest.fn() };

      // Mock the repository methods
      StudentRepository.findByEmail.mockResolvedValue(mockStudent);
      RegisteredRepository.deleteByStudentEmail.mockRejectedValue(new Error('Failed to delete registration'));

      try {
        await StudentService.suspendStudent(studentEmail);
      } catch (error) {
        expect(error.message).toBe('Failed to delete registration');
      }
    });
  });
});