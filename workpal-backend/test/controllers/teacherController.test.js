// tests/controllers/teacherController.test.js
const request = require('supertest');
const app = require('../../src/server');  // Import your Express app
const TeacherService = require('../../src/services/teacherService');  // Import TeacherService

jest.mock('../../src/services/teacherService');  // Mock the TeacherService module

describe('TeacherController', () => {
  describe('GET /api/teachers', () => {
    it('should return a list of teachers with a status of 200', async () => {
      // Arrange: Mock the successful response from TeacherService
      const mockTeachers = [
        { email: 'teacher1@example.com' },
        { email: 'teacher2@example.com' },
      ];
      TeacherService.getAllTeachers.mockResolvedValue(mockTeachers);

      // Act: Make the API call
      const response = await request(app).get('/api/teachers');

      // Assert: Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTeachers);  // Verify the response body contains the teachers
    });

    it('should return 500 if an error occurs in the service', async () => {
      // Arrange: Mock the service to throw an error
      const errorMessage = 'Error fetching teachers';
      TeacherService.getAllTeachers.mockRejectedValue(new Error(errorMessage));

      // Act: Make the API call
      const response = await request(app).get('/api/teachers');

      // Assert: Verify the error response
      expect(response.status).toBe(500);
      expect(response.body.message).toBe(errorMessage);  // Verify the response body contains the error message
    });
  });
});