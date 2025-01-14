import { DropService } from "../lib/services/dropService";
import { DropQueue } from '../lib/redis';
import { DropGenerator } from '../services/dropGeneration/generator';
import { DEFAULT_CONFIG, DEVELOPMENT_CONFIG } from "../services/dropGeneration/config";
import { prisma } from '../lib/prisma';

let isRunning = false;
let workerPromise: Promise<void> | null = null;

export async function startQueueWorkerServer() {
  if (isRunning || workerPromise) {
    console.log('Queue worker is already running');
    return;
  }

  console.log('Starting queue worker on server');
  isRunning = true;

  const generator = new DropGenerator(
    process.env.NODE_ENV === "development" ? DEVELOPMENT_CONFIG : DEFAULT_CONFIG
  );

  workerPromise = (async () => {
    while (isRunning) {
      try {
        const batch = await DropQueue.getNextBatch();
        
        if (batch.length === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
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
              userId: task.userId,
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
  })();
}

export function stopQueueWorkerServer() {
  console.log('Stopping queue worker');
  isRunning = false;
}