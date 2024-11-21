import { createNotification } from './notifications';
import { prisma } from './prisma';
import { AchievementType } from '@prisma/client';

export async function checkAchievements(userId: string, type: AchievementType) {
  // Get all achievements of this type
  const achievements = await prisma.achievement.findMany({
    where: { type },
  });

  // Get user's current progress
  const userAchievements = await prisma.userAchievement.findMany({
    where: {
      userId,
      achievementId: {
        in: achievements.map(a => a.id),
      },
    },
    include: {
      achievement: true,
    },
  });

  // Get current counts based on type
  const counts = await getCountsByType(userId, type);

  // Check each achievement
  for (const achievement of achievements) {
    let userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
    
    if (!userAchievement) {
      // Create new progress tracker
      // @ts-ignore
      userAchievement = await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
          progress: counts,
        },
      });
    } else if (!userAchievement.unlockedAt && counts >= achievement.requirement) {
      // Update and unlock achievement
      await prisma.userAchievement.update({
        where: { id: userAchievement.id },
        data: {
          progress: counts,
          unlockedAt: new Date(),
        },
      });

      // Create activity
      await prisma.activity.create({
        data: {
          userId,
          type: 'ACHIEVEMENT',
          description: `Unlocked "${achievement.title}"`,
          metadata: {
            achievementId: achievement.id,
            xpReward: achievement.xpReward,
          },
        },
      });

      // Add XP reward
      await prisma.user.update({
        where: { id: userId },
        data: {
          // @ts-ignore
          xp: {
            increment: achievement.xpReward,
          },
        },
      });

      // Add notification
      await createNotification(
        userId,
        'ACHIEVEMENT_UNLOCKED',
        'Achievement Unlocked!',
        `You've unlocked "${achievement.title}"`,
        {
          achievementId: achievement.id,
          xpReward: achievement.xpReward,
          rarity: achievement.rarity
        }
      );
    } else {
      // Update progress
      await prisma.userAchievement.update({
        where: { id: userAchievement.id },
        data: { progress: counts },
      });
    }
  }
}

async function getCountsByType(userId: string, type: AchievementType) {
  switch (type) {
    case 'TRADES_COMPLETED':
      const trades = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          _count: {
            select: {
              sentTrades: true,
              receivedTrades: true,
            },
          },
        },
      });
      return (trades?._count.sentTrades || 0) + (trades?._count.receivedTrades || 0);

    case 'CARDS_COLLECTED':
      const cards = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          _count: {
            select: { cards: true },
          },
        },
      });
      return cards?._count.cards || 0;

    // Add other cases for different achievement types
    
    default:
      return 0;
  }
} 