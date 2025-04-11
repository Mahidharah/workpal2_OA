// /test/repositories/registeredRepository.test.js
const Registered = require('../../src/models/registered');
const RegisteredRepository = require('../../src/repositories/registeredRepository');

// Mock the Registered model methods
jest.mock('../../src/models/registered');

describe('RegisteredRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOrCreate', () => {
    it('should return the registration if created successfully', async () => {
      const mockRegistration = {
        toJSON: () => ({
          teacher_email: 'teacherken@gmail.com',
          student_email: 'studentagnes@gmail.com',
          registration_date: '2025-04-10',
        }),
      };

      Registered.findOrCreate.mockResolvedValue([mockRegistration, true]);

      const result = await RegisteredRepository.findOrCreate({
        teacher_email: 'teacherken@gmail.com',
        student_email: 'studentagnes@gmail.com',
        registration_date: new Date('2025-04-10'),
      });

      expect(Registered.findOrCreate).toHaveBeenCalledWith({
        where: {
          teacher_email: 'teacherken@gmail.com',
          student_email: 'studentagnes@gmail.com',
        },
        defaults: {
          registration_date: new Date('2025-04-10'),
        },
      });

      expect(result).toEqual(mockRegistration);
    });

    it('should throw an error if Sequelize throws', async () => {
      Registered.findOrCreate.mockRejectedValue(new Error('DB error'));

      await expect(
        RegisteredRepository.findOrCreate({
          teacher_email: 'teacherken@gmail.com',
          student_email: 'studentagnes@gmail.com',
          registration_date: new Date(),
        })
      ).rejects.toThrow('Error in registration: DB error');
    });
  });

  describe('findStudentsByTeacher', () => {
    it('should return an array of student emails', async () => {
      Registered.findAll.mockResolvedValue([
        { student_email: 'student1@example.com' },
        { student_email: 'student2@example.com' },
      ]);

      const result = await RegisteredRepository.findStudentsByTeacher('teacherken@gmail.com');

      expect(Registered.findAll).toHaveBeenCalledWith({
        where: { teacher_email: 'teacherken@gmail.com' },
        attributes: ['student_email'],
      });

      expect(result).toEqual(['student1@example.com', 'student2@example.com']);
    });
  });
});