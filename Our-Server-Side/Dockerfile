#Production Dockerfile for Our-Server-Side
# Use slim version to reduce vulnerabilities
FROM node:18-alpine

RUN apk add --no-cache netcat-openbsd openssl
# Set working directory
WORKDIR /app

# Install system dependencies (required for Prisma)


# Install netcat for the 'nc' command used in start.sh
RUN apk add --no-cache netcat-openbsd

RUN npm install pm2 -g
# Copy only package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your code
COPY . .

RUN chmod +x start.sh
# Generate Prisma client (after copying prisma folder)
RUN npx prisma generate

# Expose backend API port
EXPOSE 8080


# To start the app in production mode

CMD ["sh", "./start.sh"]

