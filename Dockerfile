# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files for both root and website
COPY package*.json ./
COPY website/package*.json ./website/

# Install dependencies
RUN npm install
RUN cd website && npm install

# Copy the entire repository
COPY . .

# Build the website
RUN cd website && npm run build

# Install serve globally
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "cd website && serve -s dist -l $PORT"]
