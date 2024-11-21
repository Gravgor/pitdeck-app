import { withAuth } from '@/middleware/withAuth';
import { prisma } from "@/lib/prisma";
import { CardGrid } from '@/components/cards/CardGrid';
import { Filter, Search, Sparkles, Trophy, Clock, Wallet } from 'lucide-react';
import { CardType, Rarity } from "@prisma/client";

export default async function CollectionPage() {
  return withAuth(async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { cards: { orderBy: { createdAt: 'desc' } } }
    });
    const userCards = user?.cards || [];

    const seriesStats = userCards.reduce((acc, userCard) => {
      const series = userCard.series;
      acc[series] = (acc[series] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalValue = userCards.length;
    const legendaryCount = userCards.filter(userCard => 
      userCard.rarity === 'LEGENDARY'
    ).length;
    const recentCards = userCards.slice(0, 5);

    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white">
                Collection Overview
              </h1>
              <p className="text-gray-400 text-lg">
                Manage and explore your racing cards
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Trophy className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Cards</p>
                    <p className="text-xl font-bold text-white">{totalValue}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Legendary</p>
                    <p className="text-xl font-bold text-white">{legendaryCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Wallet className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Series</p>
                    <p className="text-xl font-bold text-white">
                      {Object.keys(seriesStats || {}).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Recent</p>
                    <p className="text-xl font-bold text-white">{recentCards.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, type, or series..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2
                         focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 
                           hover:bg-blue-700 text-white transition-colors">
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Enhanced Filters Sidebar */}
          <aside className="space-y-8 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Series</h3>
              {Object.entries(seriesStats || {}).map(([series, count]) => (
                <label key={series} className="flex items-center justify-between text-gray-300 hover:text-white cursor-pointer mb-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-white/5" />
                    {series}
                  </div>
                  <span className="text-sm text-gray-500">{count}</span>
                </label>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Card Type</h3>
              {Object.values(CardType).map((type) => (
                <label key={type} className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer mb-2">
                  <input type="checkbox" className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-white/5" />
                  {type.replace(/_/g, ' ')}
                </label>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Rarity</h3>
              {Object.values(Rarity).map((rarity) => (
                <label key={rarity} className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer mb-2">
                  <input type="checkbox" className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-white/5" />
                  <span className={`flex items-center gap-2 ${getRarityColor(rarity)}`}>
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {rarity.charAt(0) + rarity.slice(1).toLowerCase()}
                  </span>
                </label>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Year</h3>
              <div className="space-y-2">
                {Array.from(new Set(userCards.map(userCard => userCard.year)))
                  .sort()
                  .reverse()
                  .map((year) => (
                    <label key={year} className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-white/5" 
                      />
                      {year}
                    </label>
                  ))}
              </div>
            </div>
          </aside>

          {/* Cards Section */}
          <div className="space-y-6">
            {userCards.length === 0 ? (
              <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="p-4 bg-blue-500/10 rounded-full inline-block">
                    <Trophy className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Start Your Collection
                  </h3>
                  <p className="text-gray-400">
                    Begin your racing journey by opening packs or playing the mobile game
                    to collect exclusive cards.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <a 
                      href="/packs" 
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 
                               text-white rounded-xl transition-colors"
                    >
                      Open Packs
                    </a>
                    <a 
                      href="/download" 
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 
                               text-white rounded-xl transition-colors"
                    >
                      Get Mobile Game
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <CardGrid cards={userCards.map(userCard => ({
                ...userCard,
                userCardId: userCard.id,
                quantity: 1
              }))} />
            )}
          </div>
        </div>
      </div>
    );
  });
}

function getRarityColor(rarity: Rarity): string {
  switch (rarity) {
    case 'COMMON':
      return 'text-gray-400';
    case 'RARE':
      return 'text-blue-400';
    case 'EPIC':
      return 'text-purple-400';
    case 'LEGENDARY':
      return 'text-yellow-400';
    default:
      return 'text-gray-400';
  }
}