const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(express.json());  // Middleware to parse JSON requests

// Create MySQL connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Retry mechanism for connecting to MySQL
const connectWithRetry = () => {
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      console.log('Retrying in 5 seconds...');
      // Retry after 5 seconds if the connection fails
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Connected to the database');

      // Sample query to fetch data from a table (replace 'Teacher' with an actual table in your database)
      const query = 'SELECT * FROM Teacher';  // Replace 'Teacher' with your actual table name

      db.query(query, (err, results) => {
        if (err) {
          console.error('Error executing query: ' + err.stack);
          return;
        }
        console.log('Sample query result:', results);  // Log the results of the query
      });
    }
  });
};

// Start the connection with retry logic
connectWithRetry();

// Basic route to test server
app.get('/', (req, res) => {
  res.send('Hello, Workpal API!');
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
