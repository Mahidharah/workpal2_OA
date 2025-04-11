// src/controllers/notificationController.js
const NotificationService = require('../services/notificationService');

class NotificationController {
  static async retrieveForNotifications(req, res) {
    try {
      const { teacher, notification } = req.body;

      if (!teacher || !notification) {
        return res.status(400).json({ error: 'Teacher and notification content are required.' });
      }

      const recipients = await NotificationService.createAndGetNotificationRecipients(teacher, notification);

      return res.status(200).json({ recipients });
    } catch (error) {
      console.error('Error retrieving notification recipients:', error);
      return res.status(500).json({ error: 'An error occurred while retrieving notification recipients.' });
    }
  }
}

module.exports = NotificationController;