// src/server.js
const express = require('express');
const routes = require('./routes');
require('dotenv').config();
const sequelize = require('./config/database');

const Teacher = require('./models/teacher');
const Student = require('./models/student');
const Registered = require('./models/registered');
const Notification = require('./models/notification');
const NotificationRecipients = require('./models/notificationRecipients');

// Define Associations After Models Are Loaded

// Teacher and Student have many-to-many relationship through Registered
Teacher.hasMany(Registered, { foreignKey: 'teacher_email' });
Student.hasMany(Registered, { foreignKey: 'student_email' });
Registered.belongsTo(Teacher, { foreignKey: 'teacher_email' });
Registered.belongsTo(Student, { foreignKey: 'student_email' });

// Notification and Teacher have one-to-many relationship through NotificationRecipients
Teacher.hasMany(Notification, { foreignKey: 'sender_email' });
Notification.belongsTo(Teacher, { foreignKey: 'sender_email' });

// Define the association between Notification and Notification_Recipients
Notification.hasMany(NotificationRecipients, {
  foreignKey: 'notification_id', // Foreign key in Notification_Recipients
  onDelete: 'CASCADE',
});

// Associate Notification_Recipients with Notification and Student
NotificationRecipients.belongsTo(Notification, { foreignKey: 'notification_id' });
NotificationRecipients.belongsTo(Student, { foreignKey: 'student_email' });

const app = express();
app.use(express.json());

app.use(routes);

// Sync Sequelize models with the database
sequelize.sync().then(() => {
  console.log('Database synchronized');
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}).catch((err) => {
  console.error('Error synchronizing the database:', err);
});

module.exports = app;  // Export app for testing