FROM node:18-alpine

WORKDIR /app

# Install build dependencies for canvas, pdf2pic, gm (GraphicsMagick), and Ghostscript
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    bash \
    pixman-dev \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    libpng-dev \
    freetype-dev \
    poppler-utils \
    graphicsmagick \
    ghostscript   

# Copy package.json and package-lock.json for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose port
EXPOSE 5000

# Run the app
CMD ["node", "index.js"]
