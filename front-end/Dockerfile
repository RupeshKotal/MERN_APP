# FROM node:latest

# WORKDIR /app

# COPY . app/

# RUN npm install

# EXPOSE 3000

# CMD npm run dev


# Use official Node.js image for building React app
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the code and build the React app
COPY . .
RUN npm run build

# Use Nginx for serving the frontend
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
