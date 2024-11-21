'use client';

import { calculateLevel, LEVEL_CONFIG } from '@/lib/levels';
import { Trophy, Star, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelProgressProps {
  xp: number;
  className?: string;
}

export function LevelProgress({ xp, className }: LevelProgressProps) {
  const { currentLevel, nextLevel, progress } = calculateLevel(xp);

  return (
    <div className={cn("bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10", className)}>
      {/* Current Level */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg bg-gradient-to-br",
            currentLevel.color
          )}>
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Level {currentLevel.level}</h3>
            <p className="text-sm text-gray-400">{currentLevel.title}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total XP</p>
          <p className="text-lg font-bold text-white">{xp.toLocaleString()}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Progress</span>
          {nextLevel && (
            <span className="text-gray-400">
              {Math.floor(progress)}% to Level {nextLevel.level}
            </span>
          )}
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 bg-gradient-to-r",
              nextLevel ? nextLevel.color : currentLevel.color
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Next Level Preview */}
      {nextLevel && (
        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <h4 className="font-medium text-white">Next Level Rewards</h4>
                <p className="text-sm text-gray-400">Level {nextLevel.level} - {nextLevel.title}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </div>
          {nextLevel.rewards && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {nextLevel.rewards.coins && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-gray-400">Coins</p>
                  <p className="text-lg font-bold text-white">
                    {nextLevel.rewards.coins.toLocaleString()}
                  </p>
                </div>
              )}
              {nextLevel.rewards.packs && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-gray-400">Packs</p>
                  <div className="text-white">
                    {nextLevel.rewards.packs.map((pack, i) => (
                      <p key={i} className="text-sm">
                        {pack.quantity}x {pack.type.toLowerCase()}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 