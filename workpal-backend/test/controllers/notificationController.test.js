// tests/controllers/notificationController.test.js
const request = require('supertest');
const app = require('../../src/server');  // Import your Express app
const NotificationService = require('../../src/services/notificationService');  // Import the service
jest.mock('../../src/services/notificationService');  // Mock the service

describe('NotificationController', () => {
  describe('POST /api/retrievefornotifications', () => {
    it('should return 400 if teacher or notification content is missing', async () => {
      const response = await request(app)
        .post('/api/retrievefornotifications')
        .send({})  // Sending an empty body
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Teacher and notification content are required.');
    });

    it('should return 404 if teacher is not found', async () => {
      const teacherEmail = 'nonexistentteacher@example.com';
      const notificationContent = 'Test notification';

      // Mocking the service to simulate an error
      NotificationService.createAndGetNotificationRecipients.mockRejectedValueOnce(new Error('Teacher not found'));

      const response = await request(app)
        .post('/api/retrievefornotifications')
        .send({ teacher: teacherEmail, notification: notificationContent })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Teacher not found');
    });

    it('should return 404 if no valid matching/registered students are found', async () => {
      const teacherEmail = 'teacherken@example.com';
      const notificationContent = 'Test notification';

      // Mocking the service to simulate an error
      NotificationService.createAndGetNotificationRecipients.mockRejectedValueOnce(new Error('Student not found'));

      const response = await request(app)
        .post('/api/retrievefornotifications')
        .send({ teacher: teacherEmail, notification: notificationContent })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('No valid matching/registered students found');
    });

    it('should return 200 and recipients if successful', async () => {
      const teacherEmail = 'teacherken@example.com';
      const notificationContent = 'Test notification @studentagnes@example.com';

      // Mocking the service to return a list of recipients
      NotificationService.createAndGetNotificationRecipients.mockResolvedValueOnce([
        'studentagnes@example.com',
        'studentbob@example.com'
      ]);

      const response = await request(app)
        .post('/api/retrievefornotifications')
        .send({ teacher: teacherEmail, notification: notificationContent })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.recipients).toEqual(['studentagnes@example.com', 'studentbob@example.com']);
    });

    it('should return 500 for any other errors', async () => {
      const teacherEmail = 'teacherken@example.com';
      const notificationContent = 'Test notification';

      // Mocking the service to throw a generic error
      NotificationService.createAndGetNotificationRecipients.mockRejectedValueOnce(new Error('Some internal error'));

      const response = await request(app)
        .post('/api/retrievefornotifications')
        .send({ teacher: teacherEmail, notification: notificationContent })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('An error occurred while retrieving notification recipients.');
    });
  });
});