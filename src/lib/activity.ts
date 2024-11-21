import { prisma } from '@/lib/prisma';
import { ActivityType } from '@prisma/client';

export async function createActivity(
  userId: string,
  type: ActivityType,
  description: string,
  metadata?: any
) {
  return prisma.activity.create({
    data: {
      userId,
      type,
      description,
      metadata,
    },
  });
}

export async function getRecentActivities(userId: string, limit = 5) {
  return prisma.activity.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
} 