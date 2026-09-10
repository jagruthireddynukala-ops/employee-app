FROM node:20-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN cd backend && npm install --omit=dev

# Copy backend code
COPY backend ./backend

# Copy frontend
COPY frontend ./frontend

# Application port
EXPOSE 3000

# Start backend
CMD ["node", "backend/server.js"]