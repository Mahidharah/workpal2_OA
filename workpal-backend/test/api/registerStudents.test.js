// tests/api/registerStudents.test.js

const request = require('supertest');
const app = require('../../src/server');
const sequelize = require('../../src/config/database'); // Sequelize instance

describe('POST /api/register', () => {
  it('should register students under a teacher', async () => {
    const teacher = 'teacheralpha@gmail.com';
    const students = ['commonstudent1@gmail.com', 'commonstudent2@gmail.com'];

    const response = await request(app)
      .post('/api/register')
      .send({ teacher, students })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(204);
  });

  it('should return 400 if teacher or students are missing', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({})
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid request body. Ensure you provide a valid teacher and a list of students.');
  });

  it('should return 404 if teacher is not found', async () => {
    const teacher = 'nonexistentteacher@gmail.com';
    const students = ['commonstudent1@gmail.com'];

    const response = await request(app)
      .post('/api/register')
      .send({ teacher, students })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Teacher not found');
  });

  it('should return 404 if one of the students is not found', async () => {
    const teacher = 'teacheralpha@gmail.com';
    const students = ['nonexistentstudent@gmail.com'];

    const response = await request(app)
      .post('/api/register')
      .send({ teacher, students })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('One or more students not found');
  });

  it('should return 409 if one of the students is suspended', async () => {
    const teacher = 'teacheralpha@gmail.com';
    const students = ['suspendedstudent@gmail.com'];

    const response = await request(app)
      .post('/api/register')
      .send({ teacher, students })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('One or more students are suspended');
  });
});