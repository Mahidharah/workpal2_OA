// tests/services/registerService.test.js
const NotificationService = require('../../src/services/notificationService');
const NotificationRepository = require('../../src/repositories/notificationRepository');
const StudentRepository = require('../../src/repositories/studentRepository');
const RegisteredRepository = require('../../src/repositories/registeredRepository');
const TeacherRepository = require('../../src/repositories/teacherRepository');

// Mock the repositories
jest.mock('../../src/repositories/notificationRepository');
jest.mock('../../src/repositories/studentRepository');
jest.mock('../../src/repositories/registeredRepository');
jest.mock('../../src/repositories/teacherRepository');

describe('NotificationService', () => {
  const teacherEmail = 'teacherken@gmail.com';
  const notificationText = 'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com';

  beforeEach(() => {
    // Clear mocks before each test
    TeacherRepository.findByEmail.mockClear();
    StudentRepository.findByEmails.mockClear();
    RegisteredRepository.findStudentsByTeacher.mockClear();
    NotificationRepository.createNotification.mockClear();
    NotificationRepository.createNotificationRecipient.mockClear();
  });

  describe('createAndGetNotificationRecipients', () => {
    it('should throw error if teacher is not found', async () => {
      TeacherRepository.findByEmail.mockResolvedValue(null); // Simulate teacher not found

      await expect(NotificationService.createAndGetNotificationRecipients(teacherEmail, notificationText))
        .rejects
        .toThrow('Teacher not found');
    });

    it('should throw error if no students are eligible', async () => {
      const teacher = { email: teacherEmail };
      const suspendedStudent = { email: 'studentagnes@gmail.com', is_suspended: true };

      TeacherRepository.findByEmail.mockResolvedValue(teacher);
      RegisteredRepository.findStudentsByTeacher.mockResolvedValue([suspendedStudent.email]);
      StudentRepository.findByEmails.mockResolvedValue([suspendedStudent]);

      await expect(NotificationService.createAndGetNotificationRecipients(teacherEmail, notificationText))
        .rejects
        .toThrow('Student not found');
    });

    it('should create notification and associate recipients when all conditions are met', async () => {
      const teacher = { email: teacherEmail };
      const activeStudent1 = { email: 'studentagnes@gmail.com', is_suspended: false };
      const activeStudent2 = { email: 'studentmiche@gmail.com', is_suspended: false };

      TeacherRepository.findByEmail.mockResolvedValue(teacher);
      RegisteredRepository.findStudentsByTeacher.mockResolvedValue([activeStudent1.email, activeStudent2.email]);
      StudentRepository.findByEmails.mockResolvedValue([activeStudent1, activeStudent2]);

      NotificationRepository.createNotification.mockResolvedValue({ id: 1 });
      NotificationRepository.createNotificationRecipient.mockResolvedValue({});

      const recipients = await NotificationService.createAndGetNotificationRecipients(teacherEmail, notificationText);

      expect(recipients).toEqual([activeStudent1.email, activeStudent2.email]);

      // Ensure createNotification and createNotificationRecipient are called
      expect(NotificationRepository.createNotification).toHaveBeenCalledTimes(1);
      expect(NotificationRepository.createNotificationRecipient).toHaveBeenCalledTimes(2);
    });
  });

  describe('extractMentionedEmails', () => {
    it('should extract mentioned emails correctly from notification text', () => {
      const mentionedEmails = NotificationService.extractMentionedEmails(notificationText);

      expect(mentionedEmails).toEqual(['studentagnes@gmail.com', 'studentmiche@gmail.com']);
    });
  });
});
