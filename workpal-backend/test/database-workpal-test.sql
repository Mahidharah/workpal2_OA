-- 1. Create the database
CREATE DATABASE IF NOT EXISTS workpal_test;

-- 2. Select the database to use
USE workpal_test;

-- Drop tables if needed for clean start
DROP TABLE IF EXISTS Notification_Recipients;
DROP TABLE IF EXISTS Notification;
DROP TABLE IF EXISTS Registered;
DROP TABLE IF EXISTS Student;
DROP TABLE IF EXISTS Teacher;

-- Teacher table
CREATE TABLE IF NOT EXISTS Teacher (
    email VARCHAR(255) PRIMARY KEY
);

-- Student table
CREATE TABLE IF NOT EXISTS Student (
    email VARCHAR(255) PRIMARY KEY,
    is_suspended BOOLEAN DEFAULT FALSE
);

-- Registered table (Many-to-Many Relationship between Teacher and Student)
CREATE TABLE IF NOT EXISTS Registered (
    teacher_email VARCHAR(255),
    student_email VARCHAR(255),
    registration_date DATE,
    PRIMARY KEY (teacher_email, student_email),
    FOREIGN KEY (teacher_email) REFERENCES Teacher(email) ON DELETE CASCADE,
    FOREIGN KEY (student_email) REFERENCES Student(email) ON DELETE CASCADE
);

-- Notification table
CREATE TABLE IF NOT EXISTS Notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_email VARCHAR(255),
    content TEXT,
    date_sent DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_email) REFERENCES Teacher(email) ON DELETE CASCADE
);

-- Notification_Recipients table (Many-to-Many Relationship between Notification and Student)
CREATE TABLE IF NOT EXISTS NotificationRecipients (
    notification_id INT,
    student_email VARCHAR(255),
    PRIMARY KEY (notification_id, student_email),
    FOREIGN KEY (notification_id) REFERENCES Notification(id) ON DELETE CASCADE,
    FOREIGN KEY (student_email) REFERENCES Student(email) ON DELETE CASCADE
);

-- ✅ Insert Teachers
INSERT INTO Teacher (email) VALUES
('teacheralpha@gmail.com'),
('teacherbeta@gmail.com'),
('teachergamma@gmail.com');

-- Insert Students
INSERT INTO Student (email, is_suspended) VALUES
('commonstudent1@gmail.com', FALSE),
('commonstudent2@gmail.com', FALSE),
('studentonlyalpha@gmail.com', FALSE),
('studentonlybeta@gmail.com', FALSE),
('suspendedstudent@gmail.com', TRUE),
('studenttobesuspended@gmail.com', FALSE),
('mentionedstudent@gmail.com', FALSE);
('studentmiche@gmail.com', FALSE);

-- Register Students
-- commonstudent1 and commonstudent2 are registered under alpha and beta
INSERT INTO Registered (teacher_email, student_email, registration_date) VALUES
('teacheralpha@gmail.com', 'commonstudent1@gmail.com', '2025-04-01'),
('teacheralpha@gmail.com', 'commonstudent2@gmail.com', '2025-04-01'),
('teacheralpha@gmail.com', 'studentonlyalpha@gmail.com', '2025-04-01'),

('teacherbeta@gmail.com', 'commonstudent1@gmail.com', '2025-04-01'),
('teacherbeta@gmail.com', 'commonstudent2@gmail.com', '2025-04-01'),
('teacherbeta@gmail.com', 'studentonlybeta@gmail.com', '2025-04-01');

-- Insert Notifications
INSERT INTO Notification (sender_email, content) VALUES
('teacheralpha@gmail.com', 'Reminder to @mentionedstudent@gmail.com about the quiz next week!'),
('teacherbeta@gmail.com', 'Welcome back everyone.');

-- Insert Notification Recipients
INSERT INTO Notification_Recipients (notification_id, student_email) VALUES
(1, 'mentionedstudent@gmail.com'),
(2, 'commonstudent1@gmail.com');
