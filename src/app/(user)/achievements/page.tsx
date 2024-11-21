import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Trophy, Star, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const rarityColors = {
  COMMON: "from-gray-500 to-gray-600",
  RARE: "from-blue-500 to-blue-600",
  EPIC: "from-purple-500 to-purple-600",
  LEGENDARY: "from-yellow-500 to-orange-600",
};

const typeIcons = {
  TRADES_COMPLETED: Trophy,
  PACKS_OPENED: Star,
  CARDS_COLLECTED: Trophy,
  LEGENDARY_CARDS: Star,
  FOLLOWERS_GAINED: Trophy,
  SERIES_COMPLETED: Trophy,
  DAILY_LOGIN: Trophy,
  COLLECTION_VALUE: Trophy,
};

export default async function AchievementsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userAchievements = await prisma.userAchievement.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      achievement: true,
    },
  });

  const allAchievements = await prisma.achievement.findMany({
    orderBy: [
      { rarity: 'desc' },
      { type: 'asc' },
    ],
  });

  // Group achievements by rarity
  const achievementsByRarity = allAchievements.reduce((acc, achievement) => {
    const rarity = achievement.rarity;
    if (!acc[rarity]) {
      acc[rarity] = [];
    }
    const userProgress = userAchievements.find(ua => ua.achievementId === achievement.id);
    acc[rarity].push({
      ...achievement,
      progress: userProgress?.progress || 0,
      isUnlocked: !!userProgress?.unlockedAt,
    });
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Achievements</h1>
          <p className="text-gray-400 mt-2">
            Complete challenges to earn rewards and showcase your collection
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-white">
            {userAchievements.filter(ua => ua.unlockedAt).length} / {allAchievements.length}
          </div>
          <div className="text-sm text-gray-400">Achievements Unlocked</div>
        </div>
      </div>

      {/* Achievement Categories */}
      {Object.entries(achievementsByRarity).map(([rarity, achievements]) => (
        <div key={rarity} className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className={`h-6 w-6 text-${rarity.toLowerCase()}-500`} />
            {rarity.charAt(0) + rarity.slice(1).toLowerCase()} Achievements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              // @ts-ignore
              const Icon = typeIcons[achievement.type];
              const progress = Math.min(100, (achievement.progress / achievement.requirement) * 100);

              return (
                <div
                  key={achievement.id}
                  className={cn(
                    "relative group rounded-xl overflow-hidden border",
                    achievement.isUnlocked 
                      ? "border-white/20 hover:border-white/30" 
                      : "border-white/10 hover:border-white/20"
                  )}
                >
                  {/* Background Gradient */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-10",
                    // @ts-ignore
                    rarityColors[achievement.rarity]
                  )} />

                  <div className="relative p-6 backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          achievement.isUnlocked ? "bg-green-500/10" : "bg-white/5"
                        )}>
                          {achievement.isUnlocked ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <Icon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      {!achievement.isUnlocked && (
                        <Lock className="h-4 w-4 text-gray-500" />
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">
                          {achievement.progress} / {achievement.requirement}
                        </span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            achievement.isUnlocked
                              ? "bg-green-500"
                              // @ts-ignore
                              : `bg-gradient-to-r ${rarityColors[achievement.rarity]}`
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Reward */}
                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-500">{achievement.xpReward} XP</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
} 