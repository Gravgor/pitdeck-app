import { DropService } from "./services/dropService.js";

const REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
let isRunning = false;

async function startDropWorker() {
  if (isRunning) {
    console.log('Drop worker is already running');
    return;
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

// Start worker if running as standalone script

  startDropWorker().catch((error) => {
    console.error('Failed to start drop worker:', error);
    process.exit(1);
  });


export { startDropWorker, stopDropWorker }; 