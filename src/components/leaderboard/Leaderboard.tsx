'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Trophy, Coins, Car, Target, Crown } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumber';

interface LeaderboardUser {
  id: string;
  name: string;
  image: string;
  coins: number;
  cards: number;
  level: number;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
}

export function Leaderboard({ users }: LeaderboardProps) {
  return (
    <Card className="overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm">
      <div className="p-6">
        <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center">
          <Crown className="h-5 w-5 text-yellow-500 mr-2" />
          Top Collectors
        </h2>
        
        <Tabs defaultValue="coins" className="space-y-6">
          <TabsList className="grid grid-cols-3 gap-4 bg-black/40 p-1 rounded-xl">
            <TabsTrigger 
              value="coins" 
              className="data-[state=active]:bg-gradient-to-r from-yellow-500/20 to-amber-500/20 data-[state=active]:backdrop-blur-sm"
            >
              <Coins className="h-4 w-4 mr-2" />
              Most Coins
            </TabsTrigger>
            <TabsTrigger 
              value="cards" 
              className="data-[state=active]:bg-gradient-to-r from-blue-500/20 to-indigo-500/20 data-[state=active]:backdrop-blur-sm"
            >
              <Car className="h-4 w-4 mr-2" />
              Most Cards
            </TabsTrigger>
            <TabsTrigger 
              value="level" 
              className="data-[state=active]:bg-gradient-to-r from-green-500/20 to-emerald-500/20 data-[state=active]:backdrop-blur-sm"
            >
              <Target className="h-4 w-4 mr-2" />
              Highest Level
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coins">
            <LeaderboardList 
              users={[...users].sort((a, b) => b.coins - a.coins)} 
              valueKey="coins"
              icon={<Coins className="h-4 w-4 text-yellow-500" />}
              gradientFrom="from-yellow-500"
              gradientTo="to-amber-500"
            />
          </TabsContent>

          <TabsContent value="cards">
            <LeaderboardList 
              users={[...users].sort((a, b) => b.cards - a.cards)} 
              valueKey="cards"
              icon={<Car className="h-4 w-4 text-blue-500" />}
              gradientFrom="from-blue-500"
              gradientTo="to-indigo-500"
            />
          </TabsContent>

          <TabsContent value="level">
            <LeaderboardList 
              users={[...users].sort((a, b) => b.level - a.level)} 
              valueKey="level"
              icon={<Target className="h-4 w-4 text-green-500" />}
              gradientFrom="from-green-500"
              gradientTo="to-emerald-500"
            />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}

interface LeaderboardListProps {
  users: LeaderboardUser[];
  valueKey: keyof Pick<LeaderboardUser, 'coins' | 'cards' | 'level'>;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
}

function LeaderboardList({ users, valueKey, icon, gradientFrom, gradientTo }: LeaderboardListProps) {
  return (
    <div className="space-y-3">
      {users.slice(0, 10).map((user, index) => (
        <div 
          key={user.id}
          className="group relative"
        >
          {/* Background Gradient */}
          <div className={`absolute -inset-2 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl opacity-0 blur transition-opacity
            ${index === 0 ? 'opacity-20' : 
              index === 1 ? 'opacity-15' : 
              index === 2 ? 'opacity-10' : 
              'group-hover:opacity-10'}`}
          />

          {/* Content */}
          <div className={`relative flex items-center gap-4 p-4 rounded-xl transition-colors
            ${index === 0 ? 'bg-white/10' : 
              index === 1 ? 'bg-white/5' : 
              index === 2 ? 'bg-white/[0.02]' : 
              'bg-black/40'} 
            backdrop-blur-sm border border-white/10 group-hover:bg-white/5`}
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
              {index === 0 ? (
                <Trophy className="h-4 w-4 text-yellow-500" />
              ) : (
                <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
              )}
            </div>

            {/* Avatar */}
            <Avatar className="h-10 w-10 border-2 border-white/10">
              <img src={user.image} alt={user.name} className="object-cover" />
            </Avatar>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
            </div>

            {/* Value */}
            <div className="flex items-center gap-1.5">
              {icon}
              <span className="text-sm font-medium text-white">
                {valueKey === 'coins' ? formatNumber(user.coins) :
                 valueKey === 'cards' ? formatNumber(user.cards) :
                 `Lvl ${user.level}`}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 