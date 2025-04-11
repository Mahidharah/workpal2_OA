// /test/repositories/studentRepository.test.js
const StudentRepository = require('../../src/repositories/studentRepository');
const Student = require('../../src/models/student');

// Mock the Student model
jest.mock('../../src/models/student');

describe('StudentRepository', () => {
  describe('findByEmails', () => {
    it('should find students by emails successfully', async () => {
      const emails = ['student1@gmail.com', 'student2@gmail.com'];
      const mockedStudents = [
        { email: 'student1@gmail.com', is_suspended: false },
        { email: 'student2@gmail.com', is_suspended: false },
      ];

      // Mock the behavior of findAll
      Student.findAll.mockResolvedValue(mockedStudents);

      const result = await StudentRepository.findByEmails(emails);

      expect(Student.findAll).toHaveBeenCalledWith({ where: { email: emails } });
      expect(result).toEqual(mockedStudents);
    });

    it('should return an empty array when no students are found', async () => {
      const emails = ['nonexistentstudent@gmail.com'];

      // Mock the behavior of findAll to return empty array
      Student.findAll.mockResolvedValue([]);

      const result = await StudentRepository.findByEmails(emails);

      expect(Student.findAll).toHaveBeenCalledWith({ where: { email: emails } });
      expect(result).toEqual([]);
    });
  });

  describe('findByEmail', () => {
    it('should find a student by email successfully', async () => {
      const email = 'student1@gmail.com';
      const mockedStudent = { email, is_suspended: false };

      // Mock the behavior of findOne
      Student.findOne.mockResolvedValue(mockedStudent);

      const result = await StudentRepository.findByEmail(email);

      expect(Student.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(mockedStudent);
    });

    it('should return null if no student is found by email', async () => {
      const email = 'nonexistentstudent@gmail.com';

      // Mock the behavior of findOne to return null
      Student.findOne.mockResolvedValue(null);

      const result = await StudentRepository.findByEmail(email);

      expect(Student.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toBeNull();
    });
  });

  describe('findAllNotSuspended', () => {
    it('should find all students who are not suspended', async () => {
      const mockedStudents = [
        { email: 'student1@gmail.com', is_suspended: false },
        { email: 'student2@gmail.com', is_suspended: false },
      ];

      // Mock the behavior of findAll
      Student.findAll.mockResolvedValue(mockedStudents);

      const result = await StudentRepository.findAllNotSuspended();

      expect(Student.findAll).toHaveBeenCalledWith({ where: { suspended: false } });
      expect(result).toEqual(mockedStudents);
    });

    it('should return an empty array if no students are found who are not suspended', async () => {
      // Mock the behavior of findAll to return empty array
      Student.findAll.mockResolvedValue([]);

      const result = await StudentRepository.findAllNotSuspended();

      expect(Student.findAll).toHaveBeenCalledWith({ where: { suspended: false } });
      expect(result).toEqual([]);
    });
  });
});