// src/config/database.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: './test.env' });
} else {
  dotenv.config(); // defaults to .env
}

// Set up Sequelize connection
const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  dialect: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false, // Disable logging for cleaner output
});

module.exports = sequelize;