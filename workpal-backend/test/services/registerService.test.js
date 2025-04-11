// tests/services/registerService.test.js
const RegisterService = require('../../src/services/registerService');
const TeacherRepository = require('../../src/repositories/teacherRepository');
const StudentRepository = require('../../src/repositories/studentRepository');
const RegisteredRepository = require('../../src/repositories/registeredRepository');

// Mock the repositories
jest.mock('../../src/repositories/teacherRepository');
jest.mock('../../src/repositories/studentRepository');
jest.mock('../../src/repositories/registeredRepository');

describe('RegisterService', () => {
  describe('registerStudentsToTeacher', () => {
    const teacherEmail = 'teacheralpha@gmail.com';
    const students = ['student1@gmail.com', 'student2@gmail.com'];

    beforeEach(() => {
      // Clear mocks before each test
      TeacherRepository.findByEmail.mockClear();
      StudentRepository.findByEmails.mockClear();
      RegisteredRepository.findOrCreate.mockClear();
    });

    it('should throw error if teacher not found', async () => {
      TeacherRepository.findByEmail.mockResolvedValue(null); // Simulate teacher not found

      await expect(RegisterService.registerStudentsToTeacher(teacherEmail, students))
        .rejects
        .toThrow('Teacher not found: ' + teacherEmail);
    });

    it('should throw error if one or more students are suspended', async () => {
      const teacher = { email: teacherEmail };
      const suspendedStudent = { email: 'student1@gmail.com', is_suspended: true };
      const activeStudent = { email: 'student2@gmail.com', is_suspended: false };

      TeacherRepository.findByEmail.mockResolvedValue(teacher);
      StudentRepository.findByEmails.mockResolvedValue([suspendedStudent, activeStudent]);

      await expect(RegisterService.registerStudentsToTeacher(teacherEmail, students))
        .rejects
        .toThrow('Students to be registered are suspended: student1@gmail.com');
    });

    it('should throw error if one or more students are not found', async () => {
      const teacher = { email: teacherEmail };
      const activeStudent = { email: 'student2@gmail.com', is_suspended: false };

      TeacherRepository.findByEmail.mockResolvedValue(teacher);
      StudentRepository.findByEmails.mockResolvedValue([activeStudent]); // Missing student1

      await expect(RegisterService.registerStudentsToTeacher(teacherEmail, students))
        .rejects
        .toThrow('One or more students not found: student1@gmail.com');
    });

    it('should register students when all conditions are met', async () => {
      const teacher = { email: teacherEmail };
      const activeStudent1 = { email: 'student1@gmail.com', is_suspended: false };
      const activeStudent2 = { email: 'student2@gmail.com', is_suspended: false };

      TeacherRepository.findByEmail.mockResolvedValue(teacher);
      StudentRepository.findByEmails.mockResolvedValue([activeStudent1, activeStudent2]);
      RegisteredRepository.findOrCreate.mockResolvedValue([{}, true]); // Mock successful registration

      await expect(RegisterService.registerStudentsToTeacher(teacherEmail, students))
        .resolves
        .toBeUndefined(); // No error thrown

      // Ensure findOrCreate is called for each student
      expect(RegisteredRepository.findOrCreate).toHaveBeenCalledTimes(2);
      expect(RegisteredRepository.findOrCreate).toHaveBeenCalledWith({
        teacher_email: teacherEmail,
        student_email: 'student1@gmail.com',
        registration_date: expect.any(Date),
      });
    });
  });
});
