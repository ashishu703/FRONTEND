# Stage 1: Build the application
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# --- THIS IS THE CRITICAL NEW PART ---
# 1. Accept a build argument for the API URL
ARG VITE_API_BASE_URL
# 2. Create the .env file inside the container using the argument
RUN echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" > .env
# --- END OF NEW PART ---

# Build the application using the new .env file
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
