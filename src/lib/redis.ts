import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL + '?family=0' || 'redis://default:cZsmGewRpPPVmkHYgimVsECnhOXsoWRd@autorack.proxy.rlwy.net:45234');

export interface DropAreaTask {
  latitude: number;
  longitude: number;
  radius: number;
  count: number;
  expiresAt: string;
  userId?: string;
  isInitialGeneration: boolean;
}

export class DropQueue {
  private static QUEUE_KEY = 'drop-area-queue';
  private static PROCESSING_KEY = 'drop-area-processing';
  private static BATCH_SIZE = 100;

  static async addArea(task: DropAreaTask) {
    await redis.lpush(this.QUEUE_KEY, JSON.stringify(task));
  }

  static async addAreas(tasks: DropAreaTask[]) {
    if (tasks.length === 0) return;
    
    const pipeline = redis.pipeline();
    tasks.forEach(task => {
      pipeline.lpush(this.QUEUE_KEY, JSON.stringify(task));
    });
    
    await pipeline.exec();
  }

  static async getNextBatch(): Promise<DropAreaTask[]> {
    const batch: DropAreaTask[] = [];
    
    for (let i = 0; i < this.BATCH_SIZE; i++) {
      const task = await redis.rpoplpush(this.QUEUE_KEY, this.PROCESSING_KEY);
      if (!task) break;
      batch.push(JSON.parse(task));
    }
    
    return batch;
  }

  static async markProcessed(task: DropAreaTask) {
    await redis.lrem(this.PROCESSING_KEY, 1, JSON.stringify(task));
  }

  static async markFailed(task: DropAreaTask) {
    const failedTask = {
      ...task,
      failedAt: new Date().toISOString(),
      retryCount: (task as any).retryCount ? (task as any).retryCount + 1 : 1
    };
    
    if (failedTask.retryCount <= 3) {
      await redis.lpush(this.QUEUE_KEY, JSON.stringify(failedTask));
    } else {
      await redis.lpush('drop-area-failed', JSON.stringify(failedTask));
    }
    
    await redis.lrem(this.PROCESSING_KEY, 1, JSON.stringify(task));
  }

  static async getPendingCount(): Promise<number> {
    return redis.llen(this.QUEUE_KEY);
  }

  static async getProcessingCount(): Promise<number> {
    return redis.llen(this.PROCESSING_KEY);
  }

  static async clearAll() {
    await redis.del(this.QUEUE_KEY, this.PROCESSING_KEY);
  }
}

export { redis }; 