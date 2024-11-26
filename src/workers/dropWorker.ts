import { DropService } from '@/lib/services/dropService';
import { startDropWorker } from '@/lib/drop-worker';
import { prisma } from '@/lib/prisma';

async function runWorker() {
  console.log('Starting Drop Worker...');
  
  try {
    // Run initial drop generation
    await DropService.generateAllDrops();
    console.log('Initial drops generated');

    // Start the continuous worker process
    await startDropWorker();
  } catch (error) {
    console.error('Drop worker error:', error);
    // Wait 5 seconds before restarting on error
    setTimeout(runWorker, 5000);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Drop worker shutting down...');
  process.exit(0);
});

// Start the worker
runWorker().catch((error) => {
  console.error('Fatal worker error:', error);
  process.exit(1);
});