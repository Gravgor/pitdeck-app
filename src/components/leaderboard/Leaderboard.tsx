'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Trophy, Coins, Car, Target } from 'lucide-react';
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
    <Card className="p-6 bg-black/40">
      <Tabs defaultValue="coins" className="space-y-6">
        <TabsList className="grid grid-cols-3 gap-4 bg-black/40 p-1">
          <TabsTrigger value="coins" className="data-[state=active]:bg-yellow-500/20">
            <Coins className="h-4 w-4 mr-2" />
            Most Coins
          </TabsTrigger>
          <TabsTrigger value="cards" className="data-[state=active]:bg-blue-500/20">
            <Car className="h-4 w-4 mr-2" />
            Most Cards
          </TabsTrigger>
          <TabsTrigger value="level" className="data-[state=active]:bg-green-500/20">
            <Target className="h-4 w-4 mr-2" />
            Highest Level
          </TabsTrigger>
        </TabsList>

        <TabsContent value="coins">
          <LeaderboardList 
            users={[...users].sort((a, b) => b.coins - a.coins)} 
            valueKey="coins"
            icon={<Coins className="h-4 w-4 text-yellow-500" />}
          />
        </TabsContent>

        <TabsContent value="cards">
          <LeaderboardList 
            users={[...users].sort((a, b) => b.cards - a.cards)} 
            valueKey="cards"
            icon={<Car className="h-4 w-4 text-blue-500" />}
          />
        </TabsContent>

        <TabsContent value="level">
          <LeaderboardList 
            users={[...users].sort((a, b) => b.level - a.level)} 
            valueKey="level"
            icon={<Target className="h-4 w-4 text-green-500" />}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

interface LeaderboardListProps {
  users: LeaderboardUser[];
  valueKey: keyof Pick<LeaderboardUser, 'coins' | 'cards' | 'level'>;
  icon: React.ReactNode;
}

function LeaderboardList({ users, valueKey, icon }: LeaderboardListProps) {
  return (
    <div className="space-y-2">
      {users.slice(0, 10).map((user, index) => (
        <div 
          key={user.id}
          className={`flex items-center gap-4 p-3 rounded-lg transition-colors
            ${index === 0 ? 'bg-yellow-500/10' : 
              index === 1 ? 'bg-gray-400/10' : 
              index === 2 ? 'bg-amber-700/10' : 
              'bg-black/20'}`}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/40">
            {index === 0 ? (
              <Trophy className="h-4 w-4 text-yellow-500" />
            ) : (
              <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
            )}
          </div>

          <Avatar className="h-10 w-10">
            <img src={user.image} alt={user.name} className="object-cover" />
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
          </div>

          <div className="flex items-center gap-1.5">
            {icon}
            <span className="text-sm font-medium">
              {valueKey === 'coins' ? formatNumber(user.coins) :
               valueKey === 'cards' ? formatNumber(user.cards) :
               `Lvl ${user.level}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 