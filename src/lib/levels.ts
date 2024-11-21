interface LevelConfig {
  level: number;
  xpRequired: number;
  title: string;
  color: string;
  rewards?: {
    coins?: number;
    packs?: {
      type: string;
      quantity: number;
    }[];
  };
}

export const LEVEL_CONFIG: LevelConfig[] = [
  {
    level: 1,
    xpRequired: 0,
    title: "Rookie Collector",
    color: "from-gray-500 to-gray-600",
  },
  {
    level: 2,
    xpRequired: 100,
    title: "Amateur Trader",
    color: "from-green-500 to-green-600",
    rewards: {
      coins: 1000,
      packs: [{ type: 'STANDARD', quantity: 1 }]
    }
  },
  {
    level: 5,
    xpRequired: 500,
    title: "Seasoned Collector",
    color: "from-blue-500 to-blue-600",
    rewards: {
      coins: 2500,
      packs: [{ type: 'PREMIUM', quantity: 1 }]
    }
  },
  {
    level: 10,
    xpRequired: 2000,
    title: "Expert Trader",
    color: "from-purple-500 to-purple-600",
    rewards: {
      coins: 5000,
      packs: [{ type: 'LEGENDARY', quantity: 1 }]
    }
  },
  {
    level: 20,
    xpRequired: 5000,
    title: "Master Collector",
    color: "from-yellow-500 to-orange-600",
    rewards: {
      coins: 10000,
      packs: [
        { type: 'LEGENDARY', quantity: 1 },
        { type: 'PREMIUM', quantity: 2 }
      ]
    }
  },
  // Add more levels as needed
];

export function calculateLevel(xp: number): {
  currentLevel: LevelConfig;
  nextLevel: LevelConfig | null;
  progress: number;
  xpForNextLevel: number;
} {
  const currentLevel = [...LEVEL_CONFIG]
    .reverse()
    .find(level => xp >= level.xpRequired) || LEVEL_CONFIG[0];
  
  const currentLevelIndex = LEVEL_CONFIG.findIndex(l => l.level === currentLevel.level);
  const nextLevel = LEVEL_CONFIG[currentLevelIndex + 1] || null;
  
  const xpForCurrentLevel = currentLevel.xpRequired;
  const xpForNextLevel = nextLevel ? nextLevel.xpRequired - xpForCurrentLevel : 0;
  const xpProgress = xp - xpForCurrentLevel;
  
  const progress = nextLevel 
    ? (xpProgress / xpForNextLevel) * 100 
    : 100;

  return {
    currentLevel,
    nextLevel,
    progress,
    xpForNextLevel,
  };
}

export async function addXP(userId: string, amount: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, level: true, totalXp: true }
  });

  if (!user) return;

  const newTotalXp = user.totalXp + amount;
  const levelInfo = calculateLevel(newTotalXp);

  // Check if user leveled up
  if (levelInfo.currentLevel.level > user.level) {
    // Handle level up rewards
    const rewards = levelInfo.currentLevel.rewards;
    if (rewards) {
      if (rewards.coins) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            coins: { increment: rewards.coins }
          }
        });
      }

      if (rewards.packs) {
        for (const pack of rewards.packs) {
          await prisma.packPurchase.create({
            data: {
              userId,
              packType: pack.type as any,
              quantity: pack.quantity,
              price: 0, // Free reward pack
              isReward: true
            }
          });
        }
      }
    }

    // Create level up activity
    await prisma.activity.create({
      data: {
        userId,
        type: 'ACHIEVEMENT',
        description: `Reached Level ${levelInfo.currentLevel.level} - ${levelInfo.currentLevel.title}!`,
        metadata: {
          level: levelInfo.currentLevel.level,
          rewards
        }
      }
    });
  }

  // Update user XP and level
  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newTotalXp,
      level: levelInfo.currentLevel.level,
      totalXp: newTotalXp
    }
  });

  return levelInfo;
} 