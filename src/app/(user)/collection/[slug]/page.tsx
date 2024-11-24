import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CardGrid } from '@/components/cards/CardGrid';
import { Trophy, Star, Wallet, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

async function getCollectionData(slug: string) {
  const user = await prisma.user.findUnique({
    where: { name: slug },
    include: {
      cards: {
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          cards: true,
          sentTrades: true,
          receivedTrades: true,
          packsPurchased: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  const seriesStats = user.cards.reduce((acc, card) => {
    acc[card.series] = (acc[card.series] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const legendaryCount = user.cards.filter(card => card.rarity === 'LEGENDARY').length;
  const recentCards = user.cards.slice(0, 5);

  return {
    user,
    stats: {
      total: user._count.cards,
      legendary: legendaryCount,
      series: Object.keys(seriesStats).length,
      recent: recentCards.length
    },
    seriesStats,
    cards: user.cards
  };
}

export default async function UserCollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  const { slug } = await params;
  const collectionData = await getCollectionData(slug);

  if (!collectionData) {
    redirect('/not-found');
  }

  const isOwner = session?.user?.name === slug;
   
  // remove - and _ from name and add spaces
  const cleanName = collectionData.user.name?.replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-6">
        <Link href={`/profile/${collectionData.user.name}`}>
          <div className="relative w-16 h-16">
            <Image
              src={collectionData.user.image || '/default-avatar.png'}
              alt={collectionData.user.name || 'User'}
              fill
              className="rounded-full object-cover"
            />
          </div>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-white">
            {isOwner ? 'My Collection' : `${cleanName}'s Collection`}
          </h1>
          <p className="text-gray-400">
            Member since {new Date(collectionData.user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Trophy} value={collectionData.stats.total} label="Total Cards" color="blue" />
        <StatCard icon={Star} value={collectionData.stats.legendary} label="Legendary" color="yellow" />
        <StatCard icon={Wallet} value={collectionData.stats.series} label="Series" color="green" />
        <StatCard icon={Clock} value={collectionData.stats.recent} label="Recent" color="purple" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
        {/* Filters Sidebar */}
        <aside className="space-y-8 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 h-fit">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Series</h3>
            {Object.entries(collectionData.seriesStats).map(([series, count]) => (
              <div key={series} className="flex items-center justify-between text-gray-300 mb-2">
                <span>{series}</span>
                <span className="text-sm text-gray-500">{count}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Cards Grid */}
        <div>
          <CardGrid cards={collectionData.cards} showActions={isOwner} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }: { 
  icon: any; 
  value: number; 
  label: string;
  color: 'blue' | 'yellow' | 'green' | 'purple';
}) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
    green: 'bg-green-500/10 text-green-500',
    purple: 'bg-purple-500/10 text-purple-500',
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
} 