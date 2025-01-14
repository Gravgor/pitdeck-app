'use client';

import { useState, useEffect } from 'react';
import { Card } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Coins, Clock, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { CardDetailsModal } from "@/components/trades/CardDetailsModal";

interface TradeOffer {
  id: string;
  user: {
    id: string;
    name: string;
    image: string;
    totalTrades: number;
    successfulTrades: number;
    tradeSuccessRate: number;
  };
  offeredCards: Array<Card>;
  coins: number;
  note: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED';
  createdAt: string;
}

interface TradeDetails {
  id: string;
  sender: {
    id: string;
    name: string;
    image: string;
  };
  offeredCards: Card[];
  coinsOffered: number;
  note: string;
  status: string;
  expiresAt: string;
  timeRemaining: number | null;
  isOwner: boolean;
  offers: TradeOffer[];
}

export default function TradeOffersPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [trade, setTrade] = useState<TradeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingOfferId, setProcessingOfferId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        const {id} = await params;
        const response = await fetch(`/api/trades/${id}/offers`);
        if (!response.ok) throw new Error('Trade not found');
        const data = await response.json();
        
        if (!data.trade.isOwner) {
            const {id} = await params;
            router.push(`/trading/${id}`);
          return;
        }
        
        setTrade(data.trade);
      } catch (error) {
        setError('Failed to load trade details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrade();
  }, [router]);

  const handleOfferAction = async (offerId: string, action: 'accept' | 'reject') => {
    setProcessingOfferId(offerId);
    try {
        const {id} = await params;
      const response = await fetch(`/api/trades/${id}/offers/${offerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Failed to process offer');
      }

      // Refresh trade data
      const updatedResponse = await fetch(`/api/trades/${id}`);
      const data = await updatedResponse.json();
      setTrade(data.trade);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process offer');
    } finally {
      setProcessingOfferId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/20" />
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Trade Not Found</h2>
          <Button onClick={() => router.push('/trading')}>
            Back to Trading
          </Button>
        </div>
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
              onClick={() => router.push(`/trading`)}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Trade Offers</h1>
          </div>
          {trade.timeRemaining && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Expires in {Math.floor(trade.timeRemaining / 3600)}h {Math.floor((trade.timeRemaining % 3600) / 60)}m</span>
            </div>
          )}
        </div>

        {/* Offers List */}
        <div className="space-y-6">
          {trade.offers.length === 0 ? (
            <div className="bg-[#12141A] rounded-xl border border-white/5 p-6 text-center">
              <p className="text-gray-400">No offers yet</p>
            </div>
          ) : (
            trade.offers.map((offer) => (
              <div key={offer.id} className="bg-[#12141A] rounded-xl border border-white/5 p-6">
                {/* Offer Header */}
                <div className="flex items-center justify-between mb-6">
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
                      <h3 className="font-medium text-white">{offer.user.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{offer.user.totalTrades} trades</span>
                        <span>•</span>
                        <span>{offer.user.tradeSuccessRate}% success rate</span>
                      </div>
                    </div>
                  </div>
                  {offer.status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        disabled={!!processingOfferId}
                        onClick={() => handleOfferAction(offer.id, 'reject')}
                      >
                        {processingOfferId === offer.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                        disabled={!!processingOfferId}
                        onClick={() => handleOfferAction(offer.id, 'accept')}
                      >
                        {processingOfferId === offer.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Offered Cards */}
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 mb-4">
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

                {/* Card Details Modal */}
                <CardDetailsModal
                  card={selectedCard}
                  isOpen={!!selectedCard}
                  onClose={() => setSelectedCard(null)}
                />

                {/* Offer Details */}
                {offer.coins > 0 && (
                  <div className="flex items-center gap-2 text-yellow-400 mb-4">
                    <Coins className="h-4 w-4" />
                    <span>{offer.coins} coins offered</span>
                  </div>
                )}

                {offer.note && (
                  <div className="text-sm text-gray-400">
                    <p>{offer.note}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
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