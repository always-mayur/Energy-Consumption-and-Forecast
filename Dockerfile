# Stage 1: Build stage
FROM node:18 as builder

# Set the working directory in the container
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install root-level dependencies
RUN npm install --production
RUN npm install luxon --save

# Copy the entire project to the container
COPY . .

# Install client dependencies
WORKDIR /app/client
RUN npm install --production

# Build the client
RUN npm run build

# Go back to root working directory
WORKDIR /app

# Stage 2: Production stage
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=builder /app ./

# Expose necessary ports
EXPOSE 3000 5000

# Command to run the app using npm run dev
CMD ["npm", "run", "dev"]
