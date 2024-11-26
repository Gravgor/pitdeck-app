import { redis } from '@/lib/redis';
import { DropGenerator } from "@/services/dropGeneration/generator";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CONFIG, DEVELOPMENT_CONFIG } from '@/services/dropGeneration/config';

const BATCH_SIZE = 100;

export async function startDropWorker() {
  console.log('Drop worker started');
  
  while (true) {
    try {
      // Process failed drops first
      await processFailedDrops();
      
      // Process regular drop queue
      await processDropQueue();
      
      // Wait before next batch
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error in drop worker:', error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

async function processFailedDrops() {
  const failedTasks = await redis.lrange('drop-queue-failed', 0, BATCH_SIZE - 1);
  if (failedTasks.length === 0) return;

  await redis.ltrim('drop-queue-failed', BATCH_SIZE, -1);
  
  for (const taskJson of failedTasks) {
    await redis.lpush('drop-queue', taskJson);
  }
}

async function processDropQueue() {
  const generator = new DropGenerator(
    process.env.NODE_ENV === "development" 
      ? DEVELOPMENT_CONFIG 
      : DEFAULT_CONFIG
  );

  const tasks = await redis.lrange('drop-queue', 0, BATCH_SIZE - 1);
  if (tasks.length === 0) return;

  await redis.ltrim('drop-queue', BATCH_SIZE, -1);

  await Promise.all(tasks.map(async (taskJson) => {
    const task = JSON.parse(taskJson);
    try {
      const drops = await generator.generateDrops({
        latitude: task.latitude,
        longitude: task.longitude,
        radius: task.radius,
        count: task.count,
        expiresAt: new Date(task.expiresAt),
      });

      await prisma.userDropGeneration.upsert({
        where: { userId: task.userId },
        update: { lastGenAt: new Date() },
        create: { userId: task.userId, lastGenAt: new Date() }
      });

      console.log(
        `Worker generated ${drops?.length} drops for user ${task.userId}`
      );
    } catch (error) {
      console.error(`Worker error generating drops for user ${task.userId}:`, error);
      await redis.lpush('drop-queue-failed', taskJson);
    }
  }));
} 