# Use Node.js 18 Alpine for a small footprint
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Expose the API port
EXPOSE 5001

# Start the application
CMD ["node", "index.js"]
