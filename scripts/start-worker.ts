import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workerPath = path.join(__dirname, '../src/workers/dropWorker.ts');

function startWorker() {
  const worker = exec(`node --loader ts-node/esm ${workerPath}`, (error) => {
    if (error) {
      console.error('Worker error:', error);
      // Restart worker on error after delay
      setTimeout(startWorker, 5000);
    }
  });

  worker.stdout?.on('data', (data) => {
    console.log(`[Drop Worker]: ${data}`);
  });

  worker.stderr?.on('data', (data) => {
    console.error(`[Drop Worker Error]: ${data}`);
  });
}

startWorker();