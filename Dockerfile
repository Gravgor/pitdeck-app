FROM node:20-alpine

# Install additional dependencies
RUN apk add --no-cache libc6-compat python3 make g++

# Set Node.js memory limits
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Set up working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with increased memory limit
RUN npm install --force \
    --max-old-space-size=8192 \
    --no-audit \
    --prefer-offline

# Copy application code
COPY . .

# Generate Prisma client with increased memory
RUN npx --node-options="--max-old-space-size=8192" prisma generate

# Build application with increased memory
RUN npm run build --max-old-space-size=8192

# Expose port
EXPOSE 3000

# Configure container memory limits
ENV MALLOC_ARENA_MAX=2
ENV UV_THREADPOOL_SIZE=4

# Start the application with optimized garbage collection
CMD ["node", \
     "--max-old-space-size=8192", \
     "--optimize-for-size", \
     "--gc-interval=100", \
     "--max-semi-space-size=512", \
     "node_modules/.bin/next", \
     "start"]