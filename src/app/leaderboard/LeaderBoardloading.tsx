import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, Car, Target } from 'lucide-react';

export default function LeaderboardLoading() {
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

        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-black/20">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-32 flex-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </Tabs>
    </Card>
  );
}