import { NextResponse } from 'next/server';
import { DropGenerator } from '@/services/dropGeneration/generator';
import { DEFAULT_CONFIG, DEVELOPMENT_CONFIG } from '@/services/dropGeneration/config';
import { prisma } from '@/lib/prisma';

const MIN_DROPS_PER_USER = 3;
const MAX_DROPS_PER_USER = 8;
const EXPIRATION_DAYS = 7;

export async function GET(request: Request) {
  try {
    const isDev = process.env.NODE_ENV === 'development';
    const generator = new DropGenerator(isDev ? DEVELOPMENT_CONFIG : DEFAULT_CONFIG);

    // Get all active users' locations
    const activeUsers = await prisma.userLocation.findMany({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 15 * 60000) // Active in last 15 minutes
        }
      }
    });

    // Generate drops around each active user
    for (const user of activeUsers) {
      const dropsToGenerate = Math.floor(
        Math.random() * (MAX_DROPS_PER_USER - MIN_DROPS_PER_USER + 1)
      ) + MIN_DROPS_PER_USER;

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + EXPIRATION_DAYS);

      // CHECK IF USER MOVED AT LEAST 1000 METERS FROM LAST LOCATION
      const lastLocation = await prisma.userLocation.findFirst({
        where: { userId: user.userId },
        orderBy: { updatedAt: 'desc' }
      });

      // Skip if user hasn't moved far enough from their last location
      if (lastLocation && distance(user.latitude, user.longitude, lastLocation.latitude, lastLocation.longitude) < 1000) {
        continue;
      }

      await generator.generateDrops({
        latitude: user.latitude,
        longitude: user.longitude,
        radius: 1000, // meters
        count: dropsToGenerate,
        expiresAt: expirationDate
      });
    }

    // Clean up expired drops
    await prisma.drop.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DROP_GENERATION_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 

function distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
