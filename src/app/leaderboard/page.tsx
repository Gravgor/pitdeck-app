import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import { Trophy } from 'lucide-react';
import { Metadata } from 'next';
import LeaderboardLoading from '@/app/leaderboard/LeaderBoardloading';

export const metadata: Metadata = {
  title: 'Leaderboard | PitDeck',
  description: 'See the top players ranked by coins, card collection size, and level.',
  openGraph: {
    title: 'PitDeck Leaderboard',
    description: 'Check out the top PitDeck players and their achievements.',
    images: ['/og-leaderboard.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PitDeck Leaderboard',
    description: 'Check out the top PitDeck players and their achievements.',
  }
};

async function getLeaderboardData() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      coins: true,
      level: true,
      _count: {
        select: {
          cards: true
        }
      }
    },
    orderBy: [
      { coins: 'desc' },
    ],
    take: 100,
  });

  return users.map(user => ({
    id: user.id,
    name: user.name || 'Unknown User',
    image: user.image || '/default-avatar.png',
    coins: user.coins || 0,
    cards: user._count.cards,
    level: user.level || 1,
  }));
}

export const revalidate = 300; // Revalidate every 5 minutes

export default async function LeaderboardPage() {
  const users = await getLeaderboardData();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
        </div>
        <p className="text-gray-400">
          Top players ranked by coins, card collection, and level. Rankings update every 5 minutes.
        </p>
      </div>

      <Suspense fallback={<LeaderboardLoading />}>
        <Leaderboard users={users} />
      </Suspense>
    </div>
  );
}