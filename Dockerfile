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
COPY prisma ./prisma/
COPY postcss.config.js ./
COPY tailwind.config.ts ./
COPY tsconfig.json ./

# Clean install dependencies
RUN npm cache clean --force
RUN npm install --force --production=false

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]