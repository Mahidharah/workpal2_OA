// src/repositories/notificationRepository.js
const Notification = require('../models/notification');
const NotificationRecipients = require('../models/notificationRecipients');

class NotificationRepository {
  // Fetch notification recipients based on the notification ID
  static async findRecipientsByNotification(notificationId) {
    return NotificationRecipients.findAll({
      where: { notification_id: notificationId },
      include: [{ model: Student, attributes: ['email'] }],
    });
  }

  // Create a new notification
  static async createNotification({ sender_email, content, date_sent }, options = {}) {
    try {
      console.log('Creating notification with details:', { sender_email, content, date_sent });
  
      // Create the notification
      const notification = await Notification.create({
        sender_email,
        content,
        date_sent
      }, options);
  
      console.log('Notification created successfully:', notification); // Log the created notification
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error(`Error creating notification: ${error.message}`);
    }
  }

  // Create a single notification recipient
  static async createNotificationRecipient({ notification_id, student_email }, options) {
    try {
      const recipient = await NotificationRecipients.build(
        { notification_id, student_email }, 
        options
      );
      
      await recipient.save();
      return recipient;
    } catch (error) {
      console.error('Error creating notification recipient:', error);
      throw new Error(`Error creating notification recipient: ${error.message}`);
    }
  }
}

module.exports = NotificationRepository;