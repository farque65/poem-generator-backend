# Use a minimal and secure base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application source
COPY . .

# Expose container port (can be overridden via Docker Compose)
EXPOSE 3000

# Default command
CMD ["npm", "start"]
