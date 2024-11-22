import { LRUCache } from 'lru-cache';

export const apiCache = new LRUCache({
  max: 500, // Maximum number of items
  ttl: 1000 * 60 * 5, // 5 minutes
}); 