# FROM node:latest

# WORKDIR /app

# COPY . app/

# RUN npm install

# EXPOSE 3000

# CMD npm run dev


# Stage 1: Build React App
FROM node:18-alpine as build

WORKDIR /app
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . . 

# ✅ Ensure the build directory is created
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# ✅ Create directory in case it doesn't exist
RUN mkdir -p /usr/share/nginx/html

# ✅ Copy built React app to Nginx public directory
#COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html

# ✅ Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

