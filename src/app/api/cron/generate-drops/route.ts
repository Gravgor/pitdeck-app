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

      await generator.generateDrops({
        latitude: user.latitude,
        longitude: user.longitude,
        radius: 300, // meters
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