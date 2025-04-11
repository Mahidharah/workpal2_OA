const StudentService = require('../services/studentService');

class StudentController {
  static async getCommonStudents(req, res) {
    try {
      const { teacher } = req.query;  // Retrieve teacher emails from query params

      // Validate that at least one teacher is provided
      if (!teacher || teacher.length === 0) {
        return res.status(400).json({ error: 'At least one teacher email must be provided.' });
      }

      // Call service to get common students
      const commonStudents = await StudentService.getCommonStudents(teacher);

      // Respond with the common students
      return res.status(200).json({ students: commonStudents });
    } catch (error) {
      console.error('Error fetching common students:', error);
      return res.status(500).json({ error: 'An error occurred while retrieving common students.' });
    }
  }

  static async suspendStudent(req, res) {
    try {
      const { student } = req.body;
      if (!student) {
        return res.status(400).json({ error: 'Student email is required' });
      }
  
      await StudentService.suspendStudent(student);
      return res.status(204).send();
  
    } catch (error) {
      console.error('Error suspending student:', error.message);
  
      if (error.message === 'Student not found') {
        return res.status(404).json({ error: error.message });
      }
  
      if (error.message === 'Student already suspended') {
        return res.status(409).json({ error: error.message }); // 409 Conflict
      }
  
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = StudentController;