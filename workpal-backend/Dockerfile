# Use the official lightweight Node.js image (Alpine)
FROM node:23-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) for dependency management
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of your application code into the container
COPY . .

# Expose the port your application will run on
EXPOSE 3000

# Command to run your Node.js app inside the container
CMD ["node", "src/server.js"]
