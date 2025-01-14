'use client';

import { useState, useEffect } from 'react';
import { Card } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CardSelector } from '@/components/trades/CardSelector';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Coins, Car, MessageSquare, AlertTriangle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface TradeDetails {
  id: string;
  sender: {
    id: string;
    name: string;
    image: string;
    tradeSuccessRate: number;
    totalTrades: number;
  };
  offeredCards: Array<Card & {
    owners: Array<{
      id: string;
      name: string;
      image: string;
    }>;
  }>;
  coinsOffered: number;
  note: string;
  status: string;
  expiresAt: string;
  timeRemaining: number | null;
  isOwner: boolean;
  hasUserOffer: boolean;
}

interface UserContext {
  isOwner: boolean;
  hasOffer: boolean;
  canMakeOffer: boolean;
}

export default function CreateOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [trade, setTrade] = useState<TradeDetails | null>(null);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [coins, setCoins] = useState(0);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        const {id} = await params;
        const response = await fetch(`/api/trades/${id}/offers`);
        if (!response.ok) throw new Error('Trade not found');
        const data = await response.json();
        console.log(data);
        setTrade(data.trade);
        setUserContext(data.userContext);
      } catch (error) {
        setError('Failed to load trade details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrade();
  }, []);

  // If user can't make an offer, redirect them
  useEffect(() => {
    async function redirectIfNoOffer() {
      if (!isLoading && userContext && !userContext.canMakeOffer) {
        router.push(`/trading/`);
      }
    }
    redirectIfNoOffer();
  }, [isLoading, userContext, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCards.length === 0 && coins === 0) {
      setError('Please select at least one card or offer coins');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
        const {id} = await params;
      const response = await fetch(`/api/trades/${id}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardIds: selectedCards.map(card => card.id),
          coins,
          note
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create offer');
      }

      router.push(`/trading/${id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/20" />
      </div>
    );
  }

  if (!trade || !userContext?.canMakeOffer) {
    console.log(trade, userContext);
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            {!trade ? "Trade Not Found" : "Cannot Make Offer"}
          </h2>
          <p className="text-gray-400 mb-4">
            {!trade 
              ? "This trade may have expired or been cancelled" 
              : "You cannot make an offer on this trade"}
          </p>
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
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Create Trade Offer</h1>
          </div>
          {trade.timeRemaining && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Expires in {Math.floor(trade.timeRemaining / 3600)}h {Math.floor((trade.timeRemaining % 3600) / 60)}m</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Original Trade Preview */}
            <div className="bg-[#12141A] rounded-xl border border-white/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10">
                  <Image
                    src={trade.sender.image || '/default-avatar.png'}
                    alt={trade.sender.name}
                    fill
                    className="rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#12141A]" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{trade.sender.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{trade.sender.totalTrades} trades</span>
                    <span>•</span>
                    <span>{trade.sender.tradeSuccessRate}% success rate</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                {trade.offeredCards.map((card) => (
                  <div key={card.id} className="relative aspect-[2/3] rounded-lg overflow-hidden">
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

              {trade.note && (
                <div className="mt-4 text-sm text-gray-400">
                  <p>{trade.note}</p>
                </div>
              )}
            </div>

            {/* Card Selection */}
            <div className="bg-[#12141A] rounded-xl border border-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Car   className="h-5 w-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Select Cards to Offer</h2>
              </div>
              <CardSelector
                selectedCards={selectedCards}
                onSelectCard={setSelectedCards}
                maxCards={8}
              />
            </div>

            {/* Preview */}
            {selectedCards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#12141A] rounded-xl border border-white/5 p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Your Offer</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                  {selectedCards.map((card) => (
                    <div key={card.id} className="relative aspect-[2/3] rounded-lg overflow-hidden">
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
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#12141A] rounded-xl border border-white/5 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Coins Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                    <Coins className="h-4 w-4 text-yellow-400" />
                    Coins to Offer
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={coins}
                    onChange={(e) => setCoins(Number(e.target.value))}
                    className="bg-[#1A1D25] border-white/10"
                  />
                </div>

                {/* Note Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                    <MessageSquare className="h-4 w-4 text-gray-400" />
                    Note (optional)
                  </label>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a message to your offer..."
                    className="bg-[#1A1D25] border-white/10 min-h-[100px]"
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || (selectedCards.length === 0 && coins === 0)}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Offer...
                    </div>
                  ) : (
                    'Send Offer'
                  )}
                </Button>
              </form>
            </div>

            {/* Trading Tips */}
            <div className="bg-blue-500/10 rounded-xl border border-blue-500/20 p-6">
              <h3 className="text-blue-400 font-semibold mb-2">Trading Tips</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Make sure your offer is fair</li>
                <li>• Consider the rarity of cards</li>
                <li>• Be clear in your communication</li>
                <li>• Offers can&apos;t be edited once sent</li>
              </ul>
            </div>
          </div>
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