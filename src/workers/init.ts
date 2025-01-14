import { startQueueWorkerServer } from './queue-worker-server';

let isInitialized = false;

export async function initializeServer() {
  if (isInitialized) return;
  
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_QUEUE_WORKER === 'true') {
    await startQueueWorkerServer();
  }
  
  isInitialized = true;
}