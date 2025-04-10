-- 1. Create the database
CREATE DATABASE IF NOT EXISTS workpal;

-- 2. Select the database to use
USE workpal;

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
    sender_email VARCHAR(255),  -- Teacher who sent the notification
    content TEXT,               -- Content of the notification
    date_sent DATETIME DEFAULT CURRENT_TIMESTAMP,  -- When the notification was sent
    FOREIGN KEY (sender_email) REFERENCES Teacher(email) ON DELETE CASCADE
);

-- Notification_Recipients table (Many-to-Many Relationship between Notification and Student)
CREATE TABLE IF NOT EXISTS Notification_Recipients (
    notification_id INT,
    student_email VARCHAR(255),
    PRIMARY KEY (notification_id, student_email),
    FOREIGN KEY (notification_id) REFERENCES Notification(id) ON DELETE CASCADE,
    FOREIGN KEY (student_email) REFERENCES Student(email) ON DELETE CASCADE
);

-- Insert Teachers
INSERT INTO Teacher (email) VALUES
('teacherken@gmail.com'),
('teacherjoe@gmail.com'),
('teachermary@gmail.com');

-- Insert Students
INSERT INTO Student (email, is_suspended) VALUES
('studentagnes@gmail.com', FALSE),
('studentmiche@gmail.com', FALSE),
('studentbob@gmail.com', TRUE),
('studentlucas@gmail.com', FALSE),
('studentjulia@gmail.com', FALSE);

-- Register Students under Teachers
/*
INSERT INTO Registered (teacher_email, student_email, registration_date) VALUES
('teacherken@gmail.com', 'studentagnes@gmail.com', '2025-04-01'),
('teacherken@gmail.com', 'studentlucas@gmail.com', '2025-04-02'),
('teacherjoe@gmail.com', 'studentmiche@gmail.com', '2025-04-03'),
('teacherjoe@gmail.com', 'studentbob@gmail.com', '2025-04-04'),
('teachermary@gmail.com', 'studentjulia@gmail.com', '2025-04-05');
*/

-- Insert Notifications
/*
INSERT INTO Notification (sender_email, content) VALUES
('teacherken@gmail.com', 'Reminder: The next exam is on April 10th. Please study carefully!'),
('teacherjoe@gmail.com', 'Please check the updated assignment guidelines on the course portal.'),
('teachermary@gmail.com', 'Class tomorrow is cancelled due to weather conditions.');
*/

-- Insert Notification Recipients (students who receive notifications)
/*
INSERT INTO Notification_Recipients (notification_id, student_email) VALUES
(1, 'studentagnes@gmail.com'),  -- Notification from teacherken
(1, 'studentlucas@gmail.com'),  -- Notification from teacherken
(2, 'studentmiche@gmail.com'),  -- Notification from teacherjoe
(2, 'studentbob@gmail.com'),    -- Notification from teacherjoe
(3, 'studentjulia@gmail.com');  -- Notification from teachermary
*/