'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CardDetailsModal } from '@/components/trades/CardDetailsModal';
import { Loader2, ArrowLeft, Clock, Coins, Eye } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@prisma/client';

interface Trade {
  id: string;
  status: string;
  offeredCards: Array<Card>;
  tradeOffers: Array<TradeOffer>;
}

interface TradeOffer {
  id: string;
  status: string;
  coins: number;
  createdAt: string;
  timeElapsed: number;
  note: string;
  user: {
    name: string;
    image: string;
    tradeSuccessRate: number;
  };
  offeredCards: Array<Card>;
}

export default function ReceivedOffersPage() {
  const router = useRouter();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTrades();

    const interval = setInterval(fetchTrades, 15000);

    return () => clearInterval(interval);
  }, [statusFilter, currentPage]);

  const fetchTrades = async () => {
    try {
      const response = await fetch(
        `/api/trades/received-offers?status=${statusFilter}&page=${currentPage}`,
        { cache: 'no-store' } // Ensure fresh data
      );
      if (!response.ok) throw new Error('Failed to fetch trades');
      const data = await response.json();
      
      // Compare with existing data to avoid unnecessary re-renders
      const hasChanges = JSON.stringify(data.trades) !== JSON.stringify(trades);
      if (hasChanges) {
        setTrades(data.trades);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load trades');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeElapsed = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Received Offers</h1>
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            {['all', 'pending', 'accepted', 'rejected'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                onClick={() => setStatusFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Trades List */}
        <div className="space-y-8">
          {trades.length === 0 ? (
            <div className="bg-[#12141A] rounded-xl border border-white/5 p-6 text-center">
              <p className="text-gray-400">No trades with offers found</p>
            </div>
          ) : (
            trades.map((trade) => (
              <div key={trade.id} className="bg-[#12141A] rounded-xl border border-white/5 p-6">
                {/* Trade Cards */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Your Trade</h3>
                  <div className="grid grid-cols-6 gap-2">
                    {trade.offeredCards.map((card) => (
                      <div
                        key={card.id}
                        className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                        onClick={() => setSelectedCard(card)}
                      >
                        <Image
                          src={card.imageUrl}
                          alt={card.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                          <div className="absolute bottom-2 left-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${getRarityColor(card.rarity)}`}>
                              {card.rarity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Offers */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-400">Offers ({trade.tradeOffers.length})</h3>
                  {trade.tradeOffers.map((offer) => (
                    <div key={offer.id} className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10">
                            <Image
                              src={offer.user.image || '/default-avatar.png'}
                              alt={offer.user.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{offer.user.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <span>{offer.user.tradeSuccessRate}% success rate</span>
                              <span>•</span>
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeElapsed(offer.timeElapsed)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(offer.status)}`}>
                            {offer.status}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/trading/${trade.id}/offers`)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </div>

                      {/* Preview of offered cards */}
                      <div className="grid grid-cols-6 gap-2">
                        {offer.offeredCards.map((card) => (
                          <div
                            key={card.id}
                            className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                            onClick={() => setSelectedCard(card)}
                          >
                            <Image
                              src={card.imageUrl}
                              alt={card.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                              <div className="absolute bottom-2 left-2">
                                <span className={`text-xs px-1.5 py-0.5 rounded ${getRarityColor(card.rarity)}`}>
                                  {card.rarity}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {offer.coins > 0 && (
                        <div className="mt-3 flex items-center gap-2 text-yellow-400">
                          <Coins className="h-4 w-4" />
                          <span>{offer.coins} coins offered</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
        )}

        {/* Card Details Modal */}
        <CardDetailsModal
          card={selectedCard}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status.toUpperCase()) {
    case 'PENDING': return 'bg-yellow-500/20 text-yellow-300';
    case 'ACCEPTED': return 'bg-green-500/20 text-green-300';
    case 'REJECTED': return 'bg-red-500/20 text-red-300';
    case 'CANCELLED': return 'bg-gray-500/20 text-gray-300';
    default: return 'bg-gray-500/20 text-gray-300';
  }
}

function getRarityColor(rarity: string) {
  switch (rarity) {
    case 'COMMON': return 'bg-gray-600 text-white';
    case 'RARE': return 'bg-blue-500 text-white';
    case 'EPIC': return 'bg-purple-500 text-white';
    case 'LEGENDARY': return 'bg-yellow-500 text-black';
    default: return 'bg-gray-600 text-white';
  }
} 