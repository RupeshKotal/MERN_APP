# FROM node

# WORKDIR /app

# COPY . /app

# EXPOSE 3003:3003

# RUN npm install

# CMD npm run dev

# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3003:3003

# Command to start the application
CMD ["node", "server.js"]

