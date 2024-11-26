const { exec } = require('child_process');
const path = require('path');

const workerPath = path.join(__dirname, '../src/workers/dropWorker.ts');

function startWorker() {
  const worker = exec(`npx ts-node --transpile-only ${workerPath}`, (error: any) => {
    if (error) {
      console.error('Worker error:', error);
      // Restart worker on error after delay
      setTimeout(startWorker, 5000);
    }
  });

  worker.stdout?.on('data', (data: any) => {
    console.log(`[Drop Worker]: ${data}`);
  });

  worker.stderr?.on('data', (data: any) => {
    console.error(`[Drop Worker Error]: ${data}`);
  });
}

startWorker(); 