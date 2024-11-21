import { prisma } from '@/lib/prisma';
import { checkCollectionMilestones } from '@/lib/collections';
import { checkAchievements } from '@/lib/achievements';
import { AchievementType } from '@prisma/client';

export async function runUserChecks(userId: string) {
  // Run collection milestone checks
  await checkCollectionMilestones(userId);

  // Check various achievement types
  await Promise.all([
    checkAchievements(userId, 'CARDS_COLLECTED'),
    checkAchievements(userId, 'LEGENDARY_CARDS'),
    checkAchievements(userId, 'SERIES_COMPLETED'),
    checkAchievements(userId, 'COLLECTION_VALUE'),
  ]);

} 