FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Create utils.ts file if it doesn't exist
RUN mkdir -p src/lib
RUN echo 'import { clsx, type ClassValue } from "clsx"' > src/lib/utils.ts
RUN echo 'import { twMerge } from "tailwind-merge"' >> src/lib/utils.ts
RUN echo '' >> src/lib/utils.ts
RUN echo 'export function cn(...inputs: ClassValue[]) {' >> src/lib/utils.ts
RUN echo '  return twMerge(clsx(inputs))' >> src/lib/utils.ts
RUN echo '}' >> src/lib/utils.ts

# Debug: Check what files exist
RUN ls -la
RUN find . -name "src" -type d
RUN find . -name "utils.ts" -type f

# Build the application
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Expose port (will be overridden by Railway)
EXPOSE 3000

# Create a startup script to handle PORT properly
RUN echo '#!/bin/sh' > /app/start.sh
RUN echo 'PORT=${PORT:-3000}' >> /app/start.sh
RUN echo 'echo "Starting server on port $PORT"' >> /app/start.sh
RUN echo 'serve -s dist -l $PORT' >> /app/start.sh
RUN chmod +x /app/start.sh

# Start the application using the startup script
CMD ["/app/start.sh"]
