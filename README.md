# Workpal 2 OA

## Tech Stack

- **Node.js**: JavaScript runtime
- **Docker**: Containerization
- **Docker Compose**: Multi-container management
- **MySQL2**: MySQL client for Node.js
- **Sequelize**: ORM for MySQL
- **Jest**: Unit testing framework
- **Supertest**: HTTP assertion library for testing APIs

## Project Structure

- **`src/`**: Contains source code.
  - **`models/`**: Sequelize models for database tables (e.g., `Teacher`, `Student`, `Notification`).
  - **`repositories/`**: Database interaction logic (e.g., `teacherRepository`, `studentRepository`).
  - **`services/`**: Business logic layer (e.g., `teacherService`, `registerService`).
  - **`controllers/`**: API controllers that handle HTTP requests (e.g., `teacherController`, `studentController`).
  - **`config/`**: Configuration files (e.g., `database.js`).
  - **`routes/`**: API route definitions.
  - **`middleware/`**: Request middleware (e.g., `authMiddleware`).

- **`tests/`**: Unit and integration tests for the application.

## Database Overview

The `workpal` database schema is designed to handle teachers, students, registrations, and notifications. 

ER Diagram for reference:


Below is a summary of the key tables:

1. **Teacher Table**:
   - **Primary Key**: `email`
   - **Attributes**: `email` (unique)

2. **Student Table**:
   - **Primary Key**: `email`
   - **Attributes**: `email` (unique), `is_suspended` (boolean)

3. **Registered Table** (Many-to-Many Relationship between Teacher and Student):
   - **Composite Primary Key**: `teacher_email`, `student_email`
   - **Foreign Keys**: 
     - `teacher_email` → `Teacher(email)`
     - `student_email` → `Student(email)`
   - **Attributes**: `registration_date`

4. **Notification Table**:
   - **Primary Key**: `id`
   - **Foreign Key**: 
     - `sender_email` → `Teacher(email)`
   - **Attributes**: `sender_email`, `content`, `date_sent` (default: current timestamp)

5. **Notification_Recipients Table** (Many-to-Many Relationship between Notification and Student):
   - **Primary Key**: `id` (due to bug - originally pri key was to be (notification_id`, `student_email))
   - **Unique Constraint**: `notification_id`, `student_email`
   - **Foreign Keys**: 
     - `notification_id` → `Notification(id)`
     - `student_email` → `Student(email)`

### Sample values inserted (for testing)
There is currenrtly no endpoint to add/remove students and teachers, so the database will come initialised with these values to work with:

Teachers:
INSERT INTO Teacher (email) VALUES
('teacherken@gmail.com'),
('teacherjoe@gmail.com'),
('teachermary@gmail.com');

Students:
INSERT INTO Student (email, is_suspended) VALUES
('studentagnes@gmail.com', FALSE),
('studentmiche@gmail.com', FALSE),
('studentbob@gmail.com', TRUE),
('studentlucas@gmail.com', FALSE),
('studentjulia@gmail.com', FALSE);

No relationships initialised

## Running the Application

To run the application, you need Docker and Docker Compose installed on your system. Follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/Mahidharah/workpal2_OA.git
cd workpal2_OA
cd workpal-backend
```

### 2. Add .env file
Create a .env file in the same directory as the Dockerfile in workpal-backend which should look like
```bash
DB_HOST=db
DB_USER=workpal_user
DB_PASSWORD=Password123!
DB_NAME=workpal
```


### 3. Build and Start the Application with Docker Compose
Make sure Docker is installed and running. Then, use the following command to build and start the application (in the main directory):

```bash
cd ..
docker-compose up --build
```

To reinitialise application, type these commands in order

```bash
docker-compose down 
docker-compose up --build
```

### 4. Access the Application
Once the application is running, you can access the API at:
```bash
http://localhost:3000
```

## Running Unit Tests Locally

### 1. Run `npm install` Locally

Start by installing the project dependencies:

```bash
npm install
```

### 2. Set Up MySQL Database Locally
2.1. Install MySQL
Make sure MySQL is installed on your local machine. If it's not installed, follow the MySQL installation guide.
2.2. Create the Database
Log into MySQL and load the test database:

```bash
mysql -u root -p workpal_test < "path-to-the-test-DB"/database-workpal-test.sql
```

### 3. Add test.env File in workpal-backend folder
It will look like

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=workpal_test
```
where USER and PASSWORD should be changed according to your mysql configuration

### 4. Run Tests
Now that everything is set up, run the tests:
```bash
npm test
```
