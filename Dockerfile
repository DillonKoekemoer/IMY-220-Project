# Use an official Node.js 18 runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install express react react-dom react-router-dom

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Expose port 3000 (used by your Express server)
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]