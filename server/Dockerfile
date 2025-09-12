FROM node:latest
WORKDIR /app

# Install build dependencies first
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    bash \
    pkg-config \
    libpixman-1-dev \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev

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
