// /test/repositories/notificationRepository.test.js
// /test/repositories/notificationRepository.test.js
const NotificationRepository = require('../../src/repositories/notificationRepository');
const Notification = require('../../src/models/notification');
const NotificationRecipients = require('../../src/models/notificationRecipients');
const Student = require('../../src/models/student');

// Mocking the models
jest.mock('../../src/models/notification');
jest.mock('../../src/models/notificationRecipients');
jest.mock('../../src/models/student');

describe('NotificationRepository', () => {
  describe('createNotification', () => {
    it('should create a notification successfully', async () => {
      const notificationData = {
        sender_email: 'teacherken@gmail.com',
        content: 'This is a test notification',
        date_sent: new Date(),
      };

      // Mock the behavior of Notification.create
      Notification.create.mockResolvedValue({ id: 1, ...notificationData });

      const notification = await NotificationRepository.createNotification(notificationData);

      expect(Notification.create).toHaveBeenCalledWith(notificationData, {});  // Expecting the create method to be called with correct params
      expect(notification).toEqual({ id: 1, ...notificationData });
    });

    it('should throw an error when creating notification fails', async () => {
      const notificationData = {
        sender_email: 'teacherken@gmail.com',
        content: 'This is a test notification',
        date_sent: new Date(),
      };

      // Mock an error
      Notification.create.mockRejectedValue(new Error('Database error'));

      await expect(NotificationRepository.createNotification(notificationData)).rejects.toThrow('Error creating notification: Database error');
    });
  });
});