FROM node:18-alpine
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ git bash

# Copy package.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app source code
COPY . .

# Expose port
EXPOSE 5000

# Run the app
CMD ["node", "index.js"]
