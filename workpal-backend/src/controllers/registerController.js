// src/controllers/registerController.js
const RegisterService = require('../services/registerService');  // Import the service that handles the registration logic

class RegisterController {
  // Endpoint to register students to a teacher
  static async registerStudents(req, res) {
    try {
      const { teacher, students } = req.body;

      // Validate request body
      if (!teacher || !Array.isArray(students) || students.length === 0) {
        return res.status(400).json({ error: 'Invalid request body. Ensure you provide a valid teacher and a list of students.' });
      }

      // Call the service to register students under the teacher
      await RegisterService.registerStudentsToTeacher(teacher, students);

      // Respond with HTTP 204 (No Content) on successful registration
      return res.status(204).send();
    } catch (error) {
      console.error('Error registering students:', error);
      if (error.message.includes('Teacher not found')) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      if (error.message.includes('One or more students not found')) {
        return res.status(404).json({ error: 'One or more students not found' });
      }
      if (error.message.includes('Students to be registered are suspended')) {
        return res.status(400).json({ error: 'One or more students are suspended' });
      }
      return res.status(500).json({ error: 'An error occurred while registering students.' });
    }
  }
}

module.exports = RegisterController;