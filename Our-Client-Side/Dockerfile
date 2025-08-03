# Build stage
FROM node:18-slim AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code and build
COPY . .
RUN npm run build

# Serve with NGINX
FROM nginx:1.25-alpine

# Remove default NGINX static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build output to NGINX folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom NGINX config (optional)
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]







