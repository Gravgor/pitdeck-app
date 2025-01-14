import { DropService } from "@/lib/services/dropService";
import { DropQueue, type DropAreaTask } from './redis';
import { DropGenerator } from '@/services/dropGeneration/generator';
import { DEFAULT_CONFIG } from "@/services/dropGeneration/config";
import { DEVELOPMENT_CONFIG } from "@/services/dropGeneration/config";
import { prisma } from './prisma';

const REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const QUEUE_CHECK_INTERVAL = 1000; // 1 second
let isRunning = false;

async function startDropWorker() {
  if (isRunning) {
    console.log('Drop worker is already running');
    return;
  }

  // Verify environment
  if (!process.env.CRON_SECRET_KEY) {
    console.error('CRON_SECRET_KEY is not set');
    process.exit(1);
  }

  console.log('Drop worker started');
  isRunning = true;

  const generator = new DropGenerator(
    process.env.NODE_ENV === "development" ? DEVELOPMENT_CONFIG : DEFAULT_CONFIG
  );
  
  // Start both processes
  await Promise.all([
    runDailyGeneration(),
    processQueue(generator)
  ]);
}

async function runDailyGeneration() {
  while (isRunning) {
    try {
      console.log('Running daily global drops generation...');
      await DropService.generateGlobalDrops();
      console.log('Global drops queued successfully');
      
      await new Promise(resolve => setTimeout(resolve, REFRESH_INTERVAL));
    } catch (error) {
      console.error('Error in daily generation:', error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

async function processQueue(generator: DropGenerator) {
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
          console.log(`Generated drops for area at ${task.latitude}, ${task.longitude}`);
        } catch (error) {
          console.error(`Error generating drops for area:`, error);
          await DropQueue.markFailed(task);
        }
      }));

    } catch (error) {
      console.error('Error processing queue:', error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

function stopDropWorker() {
  console.log('Stopping drop worker...');
  isRunning = false;
}

// Handle process signals
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down drop worker...');
  stopDropWorker();
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down drop worker...');
  stopDropWorker();
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  stopDropWorker();
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  stopDropWorker();
  process.exit(1);
});

// Only start if this file is being run directly
if (process.env.ENABLE_DROP_WORKER === 'true' || process.argv[1] === import.meta.url) {
  startDropWorker().catch((error) => {
    console.error('Failed to start drop worker:', error);
    process.exit(1);
  });
}

export { startDropWorker, stopDropWorker }; 