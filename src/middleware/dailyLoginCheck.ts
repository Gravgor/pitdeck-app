import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';
import { addXP } from '@/lib/levels';
import { checkAchievements } from '@/lib/achievements';

export async function checkDailyLogin(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastLogin: true }
  });

  if (!user) return;

  const now = new Date();
  const lastLogin = user.lastLogin;
  const isNewDay = !lastLogin || 
    lastLogin.getDate() !== now.getDate() ||
    lastLogin.getMonth() !== now.getMonth() ||
    lastLogin.getFullYear() !== now.getFullYear();

  if (isNewDay) {
    // Update last login
    await prisma.user.update({
      where: { id: userId },
      data: { lastLogin: now }
    });

    // Add XP for daily login
    await addXP(userId, 100);

    // Create notification
    await createNotification(
      userId,
      'SYSTEM_ANNOUNCEMENT',
      'Daily Login Reward',
      'You earned 100 XP for logging in today!',
      { xpEarned: 100 }
    );

    // Check daily login achievement
    await checkAchievements(userId, 'DAILY_LOGIN');
  }
} 