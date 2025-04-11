// src/services/notificationService.js
const NotificationRepository = require('../repositories/notificationRepository');
const StudentRepository = require('../repositories/studentRepository');
const RegisteredRepository = require('../repositories/registeredRepository');
const TeacherRepository = require('../repositories/teacherRepository');

const sequelize = require('../config/database'); // Assuming you have a sequelize instance configured

class NotificationService {
  static async createAndGetNotificationRecipients(teacherEmail, notificationText) {
    const teacher = await TeacherRepository.findByEmail(teacherEmail);
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    // Extract mentioned emails from the notification text
    const mentionedEmails = this.extractMentionedEmails(notificationText);
  
    // Get all students registered under the teacher
    const registeredStudentsEmails = await RegisteredRepository.findStudentsByTeacher(teacher.email);

    // Log the registered students for debugging
    console.log('Registered students:', registeredStudentsEmails);
  
    // Combine both registered and mentioned students into a Set to ensure uniqueness
    const combinedStudentsEmails = new Set([
      ...registeredStudentsEmails,
      ...mentionedEmails,
    ]);

    // Log the combined students for debugging
    console.log('Combined students:', [...combinedStudentsEmails]);
  
    // Fetch student objects for the combined emails
    const uniqueStudents = await StudentRepository.findByEmails([...combinedStudentsEmails]);

    // Log the unique students for debugging
    console.log('Unique students:', uniqueStudents.map(student => student.email));
  
    // Filter out suspended students
    const eligibleStudents = uniqueStudents.filter(student => !student.is_suspended);

    // Log the eligible students for debugging
    console.log('Eligible students:', eligibleStudents.map(student => student.email));
  
    // Create notification and associate it with the recipients
    const transaction = await sequelize.transaction();
  
    try {
      // Step 1: Create Notification
      // Log all notification details for debugging
      console.log('Creating notification with details:', {
        sender_email: teacher.email,
        content: notificationText
      });

      const notification = await NotificationRepository.createNotification({
        sender_email: teacher.email,
        content: notificationText
      }, { transaction });

      console.log('Notification created with ID:', notification.id);  // Debugging step to check if notification ID is correct
  
      // Step 2: Create Notification_Recipients for each eligible student
      const recipientPromises = eligibleStudents.map(student => {
        return NotificationRepository.createNotificationRecipient({
          notification_id: notification.id,
          student_email: student.email,
        }, { transaction });
      });
  
      // Wait for all recipient entries to be created
      //await Promise.all(recipientPromises);

      console.log('All recipients created successfully');  // Log to confirm recipients are created
  
      // Commit transaction
      await transaction.commit();

      console.log('Transaction committed successfully');  // Log to confirm transaction commit
  
      // Return the list of recipients
      return eligibleStudents.map(student => (student.email));
    } catch (error) {
      // Rollback the transaction if an error occurs
      await transaction.rollback();
      throw new Error('Error creating notification or associating recipients: ' + error.message);
    }
  }  

  // Helper method to extract mentioned emails from the notification text
  static extractMentionedEmails(notificationText) {
    const regex = /@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const mentionedEmails = [];
    let match;

    while ((match = regex.exec(notificationText)) !== null) {
      mentionedEmails.push(match[1]);
    }

    // Log the mentioned emails for debugging
    console.log('Mentioned emails:', mentionedEmails);

    return mentionedEmails;
  }
}

module.exports = NotificationService;