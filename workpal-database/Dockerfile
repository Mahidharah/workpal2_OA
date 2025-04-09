# Use the official MySQL image
FROM mysql:latest

# Set environment variables for MySQL root password and database
ENV MYSQL_ROOT_PASSWORD=Password123!

# Copy the initialization SQL script into the container
COPY ./database-workpal.sql /docker-entrypoint-initdb.d/