import { createNotification } from "./notifications";

interface Milestone {
    cards: number;
    xpReward: number;
    coinsReward: number;
  }
  
  const MILESTONES: Milestone[] = [
    { cards: 100, xpReward: 1000, coinsReward: 1000 },
    { cards: 250, xpReward: 2500, coinsReward: 2500 },
    { cards: 500, xpReward: 5000, coinsReward: 5000 },
    { cards: 1000, xpReward: 10000, coinsReward: 10000 },
  ];

export async function checkCollectionMilestones(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      cards: true,
      completedMilestones: true,
      xp: true,
      coins: true
    }
  });

  if (!user) return;

  const cardCount = user.cards.length;
  const completedMilestones = user.completedMilestones as number[] || [];

  // Find all milestones that should be completed
  const newMilestones = MILESTONES.filter(milestone => 
    cardCount >= milestone.cards && !completedMilestones.includes(milestone.cards)
  );

  // If we found new milestones to award
  if (newMilestones.length > 0) {
    // Calculate total rewards
    const totalXP = newMilestones.reduce((sum, m) => sum + m.xpReward, 0);
    const totalCoins = newMilestones.reduce((sum, m) => sum + m.coinsReward, 0);

    // Update user with rewards and new completed milestones
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: totalXP },
        coins: { increment: totalCoins },
        completedMilestones: {
          set: [...completedMilestones, ...newMilestones.map(m => m.cards)]
        }
      }
    });

    // Create activity for each milestone
    await Promise.all(newMilestones.map(milestone =>
      prisma.activity.create({
        data: {
          userId,
          type: 'COLLECTION_MILESTONE',
          description: `Reached ${milestone.cards} cards collection milestone!`,
          metadata: {
            cardCount: milestone.cards,
            xpReward: milestone.xpReward,
            coinsReward: milestone.coinsReward
          }
        }
      })
    ));

    // Send notifications for each milestone
    await Promise.all(newMilestones.map(milestone =>
      createNotification(
        userId,
        'COLLECTION_MILESTONE',
        'Collection Milestone!',
        `You've collected ${milestone.cards} cards! Earned ${milestone.xpReward} XP and ${milestone.coinsReward} coins!`,
        {
          cardCount: milestone.cards,
          milestone: milestone.cards,
          xpReward: milestone.xpReward,
          coinsReward: milestone.coinsReward
        }
      )
    ));
  }
} 