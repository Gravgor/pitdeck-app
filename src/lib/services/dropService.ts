import { prisma } from "../prisma";
import { Drop, Circuit, Event, Rarity, DropType } from "@prisma/client";
import { DropGenerator } from "@/services/dropGeneration/generator";
import { DEFAULT_CONFIG } from "@/services/dropGeneration/config";
import { DEVELOPMENT_CONFIG } from "@/services/dropGeneration/config";
import { DropQueue, type DropAreaTask } from '@/lib/redis';

const WORLD_CONFIG = {
  INITIAL_DROPS_PER_AREA: 100, // More drops for initial generation
  SUBSEQUENT_DROPS_PER_AREA: 30, // Fewer drops for subsequent generations
  EXPIRATION_HOURS: 24,
  ACTIVE_USER_RADIUS: 5000, // 5km radius around active users
  MIN_DISTANCE_BETWEEN_AREAS: 5000, // 5km minimum between generation areas
  SUBSEQUENT_GENERATION_COOLDOWN: 15, // minutes between generations for same area
};

export class DropService {
  private static generator: DropGenerator;

  private static getGenerator() {
    if (!this.generator) {
      const isDev = process.env.NODE_ENV === "development";
      this.generator = new DropGenerator(
        isDev ? DEVELOPMENT_CONFIG : DEFAULT_CONFIG
      );
    }
    return this.generator;
  }

  static async generateGlobalDrops() {
    await this.cleanupExpiredDrops();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingDrops = await prisma.drop.count({
      where: { createdAt: { gte: today } }
    });

    if (existingDrops > 0) {
      console.log('Initial drops already generated for today');
      return;
    }

    const activeAreas = await prisma.userLocation.findMany({
      distinct: ['latitude', 'longitude', 'userId'],
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      select: {
        latitude: true,
        longitude: true,
        userId: true
      }
    });

    const generationAreas = this.groupNearbyLocations(activeAreas);
    console.log(`Queueing initial generation for ${generationAreas.length} areas`);

    const expirationTime = new Date(
      Date.now() + WORLD_CONFIG.EXPIRATION_HOURS * 60 * 60 * 1000
    );

    const tasks: DropAreaTask[] = generationAreas.map(area => ({
      latitude: area.latitude,
      longitude: area.longitude,
      radius: WORLD_CONFIG.ACTIVE_USER_RADIUS,
      count: WORLD_CONFIG.INITIAL_DROPS_PER_AREA,
      expiresAt: expirationTime.toISOString(),
      isInitialGeneration: true,
      userId: area.userId
    }));

    await DropQueue.addAreas(tasks);
    console.log('Areas queued for drop generation');
  }

  static async generateDropsForArea(latitude: number, longitude: number, userId?: string) {
    const recentGeneration = await prisma.dropGeneration.findFirst({
      where: {
        latitude: { gte: latitude - 0.05, lte: latitude + 0.05 },
        longitude: { gte: longitude - 0.05, lte: longitude + 0.05 },
        createdAt: {
          gte: new Date(Date.now() - WORLD_CONFIG.SUBSEQUENT_GENERATION_COOLDOWN * 60000)
        }
      }
    });

    if (recentGeneration) {
      console.log('Area had recent generation, skipping');
      return;
    }

    const task: DropAreaTask = {
      latitude,
      longitude,
      radius: WORLD_CONFIG.ACTIVE_USER_RADIUS,
      count: WORLD_CONFIG.SUBSEQUENT_DROPS_PER_AREA,
      expiresAt: new Date(Date.now() + WORLD_CONFIG.EXPIRATION_HOURS * 60 * 60 * 1000).toISOString(),
      userId,
      isInitialGeneration: false
    };

    await DropQueue.addArea(task);
    console.log('Area queued for drop generation');
  }

  static async generateInitialDropsForUser(userId: string, latitude: number, longitude: number) {
    const existingDrops = await prisma.drop.count({
      where: {
        userId,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (existingDrops > 0) {
      console.log(`User ${userId} already has active drops`);
      return;
    }

    // Generate initial drops for the user
    const expirationTime = new Date(
      Date.now() + WORLD_CONFIG.EXPIRATION_HOURS * 60 * 60 * 1000
    );

    const task = {
      latitude,
      longitude,
      radius: WORLD_CONFIG.ACTIVE_USER_RADIUS,
      count: WORLD_CONFIG.INITIAL_DROPS_PER_AREA,
      expiresAt: expirationTime.toISOString(),
      userId,
      isInitialGeneration: true
    };

    await DropQueue.addArea(task);
    console.log(`Queued initial drops generation for user ${userId}`);
  }

  private static groupNearbyLocations(locations: { latitude: number; longitude: number; userId?: string }[]) {
    const groups: { latitude: number; longitude: number; userId?: string }[] = [];

    for (const location of locations) {
      const isFarEnough = groups.every(group => 
        this.calculateDistance(
          location.latitude,
          location.longitude,
          group.latitude,
          group.longitude
        ) * 1000 >= WORLD_CONFIG.MIN_DISTANCE_BETWEEN_AREAS
      );

      if (isFarEnough) {
        groups.push(location);
      }
    }

    return groups;
  }

  static async cleanupExpiredDrops() {
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
    ]);
  }


  public static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}