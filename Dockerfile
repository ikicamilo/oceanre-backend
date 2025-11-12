# Use official Node LTS image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Expose port for AWS EB
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
