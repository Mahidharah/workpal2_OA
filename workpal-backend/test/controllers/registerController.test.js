// tests/controllers/registerController.test.js
const request = require('supertest');
const app = require('../../src/server');  // Import the Express app
const RegisterService = require('../../src/services/registerService');

// Mock the dependencies
jest.mock('../../src/services/registerService');

describe('RegisterController', () => {

  describe('POST /api/register', () => {

    it('should return 400 if no teacher or students are provided', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({})
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request body. Ensure you provide a valid teacher and a list of students.');
    });

    it('should return 404 if teacher is not found', async () => {
      const teacher = 'nonexistentteacher@example.com';
      const students = ['student1@example.com'];

      // Mock the service method
      RegisterService.registerStudentsToTeacher.mockRejectedValue(new Error('Teacher not found'));

      const response = await request(app)
        .post('/api/register')
        .send({ teacher, students })
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Teacher not found');
    });

    it('should return 404 if one or more students are not found', async () => {
      const teacher = 'teacheralpha@gmail.com';
      const students = ['student1@example.com', 'student2@example.com'];

      // Mock the service method
      RegisterService.registerStudentsToTeacher.mockRejectedValue(new Error('One or more students not found'));

      const response = await request(app)
        .post('/api/register')
        .send({ teacher, students })
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('One or more students not found');
    });

    it('should return 204 on successful registration', async () => {
      const teacher = 'teacheralpha@gmail.com';
      const students = ['student1@example.com'];

      // Mock the service method
      RegisterService.registerStudentsToTeacher.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/register')
        .send({ teacher, students })
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(204);  // No Content response
    });
  });
});

