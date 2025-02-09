# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Install git
RUN apk add --no-cache git

# Clone the repository
RUN git clone https://github.com/nabilbelfki/Resume.git .

# Install dependencies and build the project
RUN npm install
# RUN npm run dev

# Stage 2: Serve the application using Nginx
FROM nginx:alpine
COPY --from=builder /app/.next /usr/share/nginx/html/.next
COPY --from=builder /app/public /usr/share/nginx/html/public
COPY --from=builder /app/next.config.js /usr/share/nginx/html/next.config.js
COPY --from=builder /app/package.json /usr/share/nginx/html/package.json
COPY --from=builder /app/node_modules /usr/share/nginx/html/node_modules

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
