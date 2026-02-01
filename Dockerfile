# Use a Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install dependencies needed for building
RUN apk add --no-cache bash

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your application
COPY . .

# Add environment variable (optional; can also be passed at runtime)
ENV MONGO_URI=mongodb://52.15.107.92:27017/Projects

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
