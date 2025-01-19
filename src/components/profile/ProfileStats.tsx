'use client';

import { calculateLevel } from '@/lib/levels';
import { Trophy, Car, ArrowRightLeft, Package, Wallet } from 'lucide-react';

interface ProfileStatsProps {
  stats: {
    xp: number;
    totalCards: number;
    trades: number;
    packsOpened: number;
    coins: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const { currentLevel } = calculateLevel(stats.xp);

  return (
    <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
      {[
        { 
          label: 'Level', 
          value: currentLevel.level,
          subtitle: currentLevel.title,
          icon: Trophy,
          color: 'text-yellow-400',
          gradient: currentLevel.color
        },
        { 
          label: 'Total Cards', 
          value: stats.totalCards,
          icon: Car,
          color: 'text-blue-400'
        },
        { 
          label: 'Trades', 
          value: stats.trades,
          icon: ArrowRightLeft,
          color: 'text-green-400'
        },
        { 
          label: 'Packs Opened', 
          value: stats.packsOpened,
          icon: Package,
          color: 'text-purple-400'
        },
        { 
          label: 'Coins', 
          value: stats.coins.toLocaleString(),
          icon: Wallet,
          color: 'text-yellow-400'
        }
      ].map((stat, index) => (
        <div 
          key={index} 
          className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-3 sm:p-4 border border-red-500/10 hover:border-red-500/20 transition-colors ${stat.gradient || ''}`}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className={`${stat.color} bg-white/5 rounded-full p-1.5 sm:p-2`}>
              <stat.icon className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
            <p className="text-xs sm:text-sm text-gray-400">{stat.label}</p>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-white">{stat.value}</p>
          {stat.subtitle && (
            <p className="text-xs text-gray-400 mt-1 truncate">{stat.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
} 