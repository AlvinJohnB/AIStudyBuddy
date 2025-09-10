FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source, excluding node_modules and other unnecessary files
COPY --chown=node:node . .

# Use a non-root user
USER node

# Expose the port your app runs on
EXPOSE 5000

CMD ["node", "index.js"]