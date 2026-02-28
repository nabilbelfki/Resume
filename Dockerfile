# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Install only runtime deps
RUN apk update && apk upgrade && \
    apk add --no-cache bash openssl busybox && \
    npm install -g npm@latest

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

ENV MONGO_URI=mongodb://52.15.107.92:27017/Projects
EXPOSE 3000
CMD ["npm", "start"]