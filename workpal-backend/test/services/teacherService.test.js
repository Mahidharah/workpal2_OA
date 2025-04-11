// tests/services/teacherService.test.js
const TeacherService = require('../../src/services/teacherService');
const TeacherRepository = require('../../src/repositories/teacherRepository');

// Mock the TeacherRepository methods
jest.mock('../../src/repositories/teacherRepository');

describe('TeacherService', () => {
  describe('getAllTeachers', () => {
    it('should return a list of all teachers', async () => {
      const mockTeachers = [
        { email: 'teacheralpha@gmail.com' },
        { email: 'teacherbeta@gmail.com' },
      ];

      // Mock the repository method
      TeacherRepository.findAll.mockResolvedValue(mockTeachers);

      const teachers = await TeacherService.getAllTeachers();

      // Check that the service method returns the mock data
      expect(teachers).toEqual(mockTeachers);
      expect(TeacherRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if there is an issue fetching teachers', async () => {
      // Simulate an error in the repository method
      TeacherRepository.findAll.mockRejectedValue(new Error('Database error'));

      try {
        await TeacherService.getAllTeachers();
      } catch (error) {
        // Expect the error to be thrown and caught here
        expect(error.message).toBe('Database error');
      }
    });
  });
});
