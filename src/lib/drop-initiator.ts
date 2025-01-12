import { redis } from '@/lib/redis';
import { DEFAULT_CONFIG } from "@/services/dropGeneration/config";
import { DEVELOPMENT_CONFIG } from "@/services/dropGeneration/config";
import { prisma } from "@/lib/prisma";
import { DropGenerator } from "@/services/dropGeneration/generator";

const MIN_DROPS_PER_USER = 3;
const MAX_DROPS_PER_USER = 8;
const FIRST_TIME_DROPS = 30;
const NORMAL_RADIUS = 1000;
const FIRST_TIME_RADIUS = 5000;
const EXPIRATION_DAYS = 7;
const BATCH_SIZE = 100; // Number of drops to generate in each batch

export async function initiateDrops() {
  const isDev = process.env.NODE_ENV === "development";
  const generator = new DropGenerator(
    isDev ? DEVELOPMENT_CONFIG : DEFAULT_CONFIG
  );

  const activeUsers = await prisma.userLocation.findMany({
    where: {
      updatedAt: {
        gte: new Date(Date.now() - 15 * 60000),
      },
    },
  });

  for (const user of activeUsers) {
    const lastDropGeneration = await prisma.userDropGeneration.findUnique({
      where: { userId: user.userId }
    });

    if (lastDropGeneration && 
        Date.now() - lastDropGeneration.lastGenAt.getTime() < 15 * 60000) {
      console.log(`Skipping drop generation for user ${user.userId}`);
      continue;
    }

    const isFirstTime = !lastDropGeneration;
    const dropsToGenerate = isFirstTime 
      ? FIRST_TIME_DROPS 
      : Math.floor(Math.random() * (MAX_DROPS_PER_USER - MIN_DROPS_PER_USER + 1)) + MIN_DROPS_PER_USER;

    // Add drop generation task to Redis queue
    const dropTask = {
      userId: user.userId,
      latitude: user.latitude,
      longitude: user.longitude,
      radius: isFirstTime ? FIRST_TIME_RADIUS : NORMAL_RADIUS,
      count: dropsToGenerate,
      expiresAt: new Date(Date.now() + EXPIRATION_DAYS * 24 * 60 * 60 * 1000),
      isFirstTime
    };

    await redis.lpush('drop-queue', JSON.stringify(dropTask));
  }

  // Process queue in batches
  await processDropQueue(generator);

  await prisma.$transaction([
    prisma.reward.deleteMany({
      where: {
        drop: {
          expiresAt: {
            lt: new Date(),
          },
        },
      },
    }),
    prisma.drop.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
        rewards: {
          none: {},
        },
      },
    }),
  ])
  
  return true;
}

async function processDropQueue(generator: DropGenerator) {
  let processedCount = 0;
  
  while (true) {
    // Process drops in batches
    const batch = [];
    for (let i = 0; i < BATCH_SIZE; i++) {
      const task = await redis.rpop('drop-queue');
      if (!task) break;
      batch.push(JSON.parse(task));
    }

    if (batch.length === 0) break;

    // Generate drops for batch
    await Promise.all(batch.map(async (task) => {
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

        processedCount += drops?.length || 0;
        console.log(
          `Generated ${drops?.length} drops for user ${task.userId} ${task.isFirstTime ? '(first time)' : ''}`
        );
      } catch (error) {
        console.error(`Error generating drops for user ${task.userId}:`, error);
        // Optionally requeue failed tasks
        await redis.lpush('drop-queue-failed', JSON.stringify(task));
      }
    }));
  }

  console.log(`Total drops generated: ${processedCount}`);
}

function distance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Returns distance in meters
}
