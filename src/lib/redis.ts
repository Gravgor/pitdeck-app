import { Redis } from 'ioredis';

// Create Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export { redis }; 