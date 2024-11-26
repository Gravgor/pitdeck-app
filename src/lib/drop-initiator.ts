import { DEFAULT_CONFIG } from "@/services/dropGeneration/config";
import { DEVELOPMENT_CONFIG } from "@/services/dropGeneration/config";
import { DropGenerator } from "@/services/dropGeneration/generator";

const MIN_DROPS_PER_USER = 3;
const MAX_DROPS_PER_USER = 8;
const FIRST_TIME_DROPS = 30;
const NORMAL_RADIUS = 1000; // 1km in meters
const FIRST_TIME_RADIUS = 5000; // 5km in meters
const EXPIRATION_DAYS = 7;

export async function initiateDrops() {
  const isDev = process.env.NODE_ENV === "development";
  const generator = new DropGenerator(
    isDev ? DEVELOPMENT_CONFIG : DEFAULT_CONFIG
  );

  // Get all active users' locations
  const activeUsers = await prisma.userLocation.findMany({
    where: {
      updatedAt: {
        gte: new Date(Date.now() - 15 * 60000), // Active in last 15 minutes
      },
    },
  });

  // Generate drops around each active user
  for (const user of activeUsers) {
    // Check when drops were last generated for this user
    const lastDropGeneration = await prisma.userDropGeneration.findUnique({
      where: { userId: user.userId }
    });

    // Skip if drops were generated less than 15 minutes ago
    if (lastDropGeneration && 
        Date.now() - lastDropGeneration.lastGenAt.getTime() < 15 * 60000) {
      console.log(
        `Skipping drop generation for user ${user.userId} because drops were generated less than 15 minutes ago`
      );
      return false;
    }

    // Different settings for first-time drops
    const isFirstTime = !lastDropGeneration;
    const dropsToGenerate = isFirstTime 
      ? FIRST_TIME_DROPS
      : Math.floor(Math.random() * (MAX_DROPS_PER_USER - MIN_DROPS_PER_USER + 1)) + MIN_DROPS_PER_USER;

    const radius = isFirstTime ? FIRST_TIME_RADIUS : NORMAL_RADIUS;

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + EXPIRATION_DAYS);

    const drops = await generator.generateDrops({
      latitude: user.latitude,
      longitude: user.longitude,
      radius,
      count: dropsToGenerate,
      expiresAt: expirationDate,
    });

    // Update or create the last generation time
    await prisma.userDropGeneration.upsert({
      where: { userId: user.userId },
      update: { lastGenAt: new Date() },
      create: { userId: user.userId, lastGenAt: new Date() }
    });

    console.log(
      `Generated ${drops?.length} drops for user ${user.userId} ${isFirstTime ? '(first time)' : ''}`
    );
  }

  // Clean up expired drops
  await prisma.drop.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  return true;
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
