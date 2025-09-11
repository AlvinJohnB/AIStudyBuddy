FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm install
COPY . .
RUN npm run build

# Serve static files using nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80