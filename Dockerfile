# ============================
# Stage 1: Frontend Build
# ============================
FROM node:18-alpine as frontend-builder

WORKDIR /app/client

# Copy only package files for better caching
COPY client/package*.json ./

# Install frontend dependencies
RUN npm ci --omit=dev

# Copy the frontend source code
COPY client ./

# Build the React frontend
RUN npm run build


# ============================
# Stage 2: Backend Build
# ============================
FROM node:18 as backend-builder

WORKDIR /app

# Copy only package files for better caching
COPY package*.json ./

# Install backend dependencies
RUN npm ci --omit=dev

# Copy the entire backend code (excluding unnecessary files)
COPY . .

# ============================
# Stage 3: Production Image
# ============================
FROM node:18-slim

WORKDIR /app

# Set environment variable for production
ENV NODE_ENV=production

# Copy backend from build stage
COPY --from=backend-builder /app .

# Copy frontend build files from frontend-builder stage
COPY --from=frontend-builder /app/client/build ./client/build

# Expose necessary ports
EXPOSE 3000 5000

# Command to run the application
CMD ["npm","run","dev"]
