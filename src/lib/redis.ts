import { Redis } from 'ioredis';

// Create Redis client
const redis = new Redis(process.env.REDIS_URL + '?family=0' || 'redis://default:cZsmGewRpPPVmkHYgimVsECnhOXsoWRd@autorack.proxy.rlwy.net:45234');

export { redis }; 