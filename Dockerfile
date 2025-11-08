# Stage 1: Build the React/Frontend App
FROM node:lts-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build the project (yeh 'build' folder banayega)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Nginx ko port 80 par chalane ke liye config file copy karein
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Builder stage se 'build' folder ko Nginx ke server directory mein copy karein
COPY --from=builder /app/dist /usr/share/nginx/html

# Container port 80 ko expose karein (hum ise bahar se 3200 se connect karenge)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]