# Use a Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install git
RUN apk add --no-cache git

# Clone the repository
RUN git clone https://github.com/nabilbelfki/Resume.git .

# Create .env.local file
RUN echo "MONGO_URI=mongodb://52.15.107.92:27017/Projects" > .env.local

# Install dependencies
RUN npm install

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
