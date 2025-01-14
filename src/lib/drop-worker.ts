import { DropService } from "@/lib/services/dropService";

const REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
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

  console.log('Global drop worker started');
  isRunning = true;
  
  while (isRunning) {
    try {
      console.log('Generating global drops...');
      await DropService.generateGlobalDrops();
      console.log('Global drops generated successfully');
      
      await new Promise(resolve => setTimeout(resolve, REFRESH_INTERVAL));
    } catch (error) {
      console.error('Error in drop worker:', error);
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