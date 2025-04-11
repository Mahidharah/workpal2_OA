// src/controllers/notificationController.js
const NotificationService = require('../services/notificationService');

class NotificationController {
  static async retrieveForNotifications(req, res) {
    try {
      const { teacher, notification } = req.body;

      if (!teacher || !notification) {
        return res.status(400).json({ error: 'Teacher and notification content are required.' });
      }

      // Call service to get common students
      const recipients = await NotificationService.createAndGetNotificationRecipients(teacher, notification);

      // Respond with the common students
      return res.status(200).json({ recipients });
    } catch (error) {
      console.error('Error retrieving notification recipients:', error);

      // Check if the error message contains 'Teacher not found' or 'Student not found'
      if (error.message && error.message.includes('Teacher not found')) {
        return res.status(404).json({ error: 'Teacher not found' });
      }

      if (error.message && error.message.includes('Student not found')) {
        return res.status(404).json({ error: 'No valid matching/registered students found' });
      }

      // For any other errors, return a 500 status
      return res.status(500).json({ error: 'An error occurred while retrieving notification recipients.' });
    }
  }
}

module.exports = NotificationController;