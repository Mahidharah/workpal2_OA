// tests/controllers/studentController.test.js
const request = require('supertest');
const app = require('../../src/server');  // Import the Express app
const StudentService = require('../../src/services/studentService');

// Mock the dependencies
jest.mock('../../src/services/studentService');

describe('StudentController', () => {
  
  describe('GET /api/commonstudents', () => {

    it('should return 400 if no teacher emails are provided', async () => {
      const response = await request(app)
        .get('/api/commonstudents')
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('At least one teacher email must be provided.');
    });

    it('should return 404 if a teacher is not found', async () => {
      const teacherEmails = ['nonexistentteacher@example.com'];

      // Mock the service method
      StudentService.getCommonStudents.mockRejectedValue(new Error('Teacher not found'));

      const response = await request(app)
        .get(`/api/commonstudents?teacher=${encodeURIComponent(teacherEmails[0])}`)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('One or more teachers not found');
    });

    it('should return 200 and a list of students for valid teachers', async () => {
      const teacherEmails = ['teacheralpha@gmail.com'];

      // Mock the service method
      StudentService.getCommonStudents.mockResolvedValue([
        'commonstudent1@gmail.com',
        'commonstudent2@gmail.com'
      ]);

      const response = await request(app)
        .get(`/api/commonstudents?teacher=${encodeURIComponent(teacherEmails[0])}`)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.body.students).toEqual([
        'commonstudent1@gmail.com',
        'commonstudent2@gmail.com'
      ]);
    });
  });
});
