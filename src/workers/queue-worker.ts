import { Redis } from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { DropGenerator } from "../services/dropGeneration/generator";
import { DEFAULT_CONFIG, DEVELOPMENT_CONFIG } from "../services/dropGeneration/config";

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL + '?family=0' || 'redis://default:cZsmGewRpPPVmkHYgimVsECnhOXsoWRd@autorack.proxy.rlwy.net:45234');

// Queue interface
interface DropAreaTask {
  latitude: number;
  longitude: number;
  radius: number;
  count: number;
  expiresAt: string;
  userId?: string;
  isInitialGeneration: boolean;
}

class DropQueue {
  private static QUEUE_KEY = 'drop-area-queue';
  private static PROCESSING_KEY = 'drop-area-processing';
  private static BATCH_SIZE = 100;

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
}

// Worker logic
const QUEUE_CHECK_INTERVAL = 1000; // 1 second
let isRunning = false;

async function startQueueWorker() {
  if (isRunning) {
    console.log('Queue worker is already running');
    return;
  }

  console.log('Queue worker started');
  isRunning = true;

  const generator = new DropGenerator(
    process.env.NODE_ENV === "development" ? DEVELOPMENT_CONFIG : DEFAULT_CONFIG
  );

  while (isRunning) {
    try {
      const batch = await DropQueue.getNextBatch();
      
      if (batch.length === 0) {
        await new Promise(resolve => setTimeout(resolve, QUEUE_CHECK_INTERVAL));
        continue;
      }

      console.log(`Processing batch of ${batch.length} areas`);

      await Promise.all(batch.map(async (task) => {
        try {
          await generator.generateDrops({
            latitude: task.latitude,
            longitude: task.longitude,
            radius: task.radius,
            count: task.count,
            expiresAt: new Date(task.expiresAt),
          });

          await prisma.dropGeneration.create({
            data: {
              latitude: task.latitude,
              longitude: task.longitude,
              createdAt: new Date()
            }
          });

          await DropQueue.markProcessed(task);
          console.log(`✓ Generated drops for area at ${task.latitude}, ${task.longitude}`);
        } catch (error) {
          console.error(`✗ Error generating drops for area:`, error);
          await DropQueue.markFailed(task);
        }
      }));

    } catch (error) {
      console.error('Error processing queue:', error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

// Start the worker
startQueueWorker().catch((error) => {
  console.error('Failed to start queue worker:', error);
  process.exit(1);
});