'use client';

import { Card } from '@prisma/client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardSelector } from '@/components/trades/CardSelector';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Coins, Car, MessageSquare, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateTradePage() {
  const router = useRouter();
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [coins, setCoins] = useState(0);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCards.length === 0 && coins === 0) {
      setError('Please select at least one card or offer coins');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/trades', {
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
        throw new Error(data.error || 'Failed to create trade');
      }

      router.push('/trading');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create trade');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-white">Create New Trade</h1>
          </div>
          
          <Button
            onClick={() => router.push('/trading/help')}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            Trading Guide
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Selection */}
            <div className="bg-[#12141A] rounded-xl border border-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Car className="h-5 w-5 text-blue-400" />
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
                <h3 className="text-lg font-semibold text-white mb-4">Selected Cards</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                  {selectedCards.map((card) => (
                    <div key={card.id} className="relative aspect-[2/3] rounded-lg overflow-hidden">
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-full h-full object-cover"
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
                    placeholder="Describe what you're looking for..."
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
                      Creating Trade...
                    </div>
                  ) : (
                    'Create Trade'
                  )}
                </Button>
              </form>
            </div>

            {/* Trading Tips */}
            <div className="bg-blue-500/10 rounded-xl border border-blue-500/20 p-6">
              <h3 className="text-blue-400 font-semibold mb-2">Trading Tips</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• You can offer up to 8 cards per trade</li>
                <li>• Be specific in your note about what you want</li>
                <li>• Trades expire after 48 hours</li>
                <li>• You can have up to 5 active trades</li>
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