const { DropService } = require('../lib/services/dropService');
const { startDropWorker } = require('../lib/drop-worker');

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

runWorker().catch(console.error); 