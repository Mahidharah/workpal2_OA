// tests/repositories/teacherRepository.test.js
const TeacherRepository = require('../../src/repositories/teacherRepository');
const Teacher = require('../../src/models/teacher');

// Mock the Teacher model
jest.mock('../../src/models/teacher');

describe('TeacherRepository', () => {
  describe('findByEmail', () => {
    it('should find a teacher by email successfully', async () => {
      const email = 'teacher1@gmail.com';
      const mockedTeacher = { email, name: 'Teacher 1' };

      // Mock the behavior of findOne
      Teacher.findOne.mockResolvedValue(mockedTeacher);

      const result = await TeacherRepository.findByEmail(email);

      expect(Teacher.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(mockedTeacher);
    });

    it('should return null if no teacher is found by email', async () => {
      const email = 'nonexistentteacher@gmail.com';

      // Mock the behavior of findOne to return null
      Teacher.findOne.mockResolvedValue(null);

      const result = await TeacherRepository.findByEmail(email);

      expect(Teacher.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toBeNull();
    });
  });

  describe('findByEmails', () => {
    it('should find teachers by a list of emails successfully', async () => {
      const emails = ['teacher1@gmail.com', 'teacher2@gmail.com'];
      const mockedTeachers = [
        { email: 'teacher1@gmail.com', name: 'Teacher 1' },
        { email: 'teacher2@gmail.com', name: 'Teacher 2' },
      ];

      // Mock the behavior of findAll
      Teacher.findAll.mockResolvedValue(mockedTeachers);

      const result = await TeacherRepository.findByEmails(emails);

      expect(Teacher.findAll).toHaveBeenCalledWith({ where: { email: emails } });
      expect(result).toEqual(mockedTeachers);
    });

    it('should return an empty array when no teachers are found', async () => {
      const emails = ['nonexistentteacher1@gmail.com', 'nonexistentteacher2@gmail.com'];

      // Mock the behavior of findAll to return an empty array
      Teacher.findAll.mockResolvedValue([]);

      const result = await TeacherRepository.findByEmails(emails);

      expect(Teacher.findAll).toHaveBeenCalledWith({ where: { email: emails } });
      expect(result).toEqual([]);
    });
  });

  describe('findAll', () => {
    it('should retrieve all teachers successfully', async () => {
      const mockedTeachers = [
        { email: 'teacher1@gmail.com', name: 'Teacher 1' },
        { email: 'teacher2@gmail.com', name: 'Teacher 2' },
      ];

      // Mock the behavior of findAll
      Teacher.findAll.mockResolvedValue(mockedTeachers);

      const result = await TeacherRepository.findAll();

      expect(Teacher.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockedTeachers);
    });

    it('should return an empty array if no teachers exist', async () => {
      // Mock the behavior of findAll to return an empty array
      Teacher.findAll.mockResolvedValue([]);

      const result = await TeacherRepository.findAll();

      expect(Teacher.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
