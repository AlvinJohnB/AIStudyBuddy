FROM node:18-alpine
WORKDIR /app

# Install build dependencies first
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    bash \
    pkgconfig \
    pixman-dev \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev

# Copy package.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose port
EXPOSE 5000

# Run the app
CMD ["node", "index.js"]
