'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, RefreshCw, X } from 'lucide-react';
import { Card } from '@prisma/client';

interface CardActionsProps {
  card: Card;
  onSell: (price: number) => Promise<void>;
  onTrade: () => Promise<void>;
}

export function CardActions({ card, onSell, onTrade }: CardActionsProps) {
  const [showSellModal, setShowSellModal] = useState(false);
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSell(Number(price));
      setShowSellModal(false);
    } catch (error) {
      console.error('Error listing card:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setShowSellModal(true)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                   bg-gradient-to-r from-red-500 to-blue-500 rounded-lg 
                   text-white font-medium hover:opacity-90 transition-opacity"
        >
          <DollarSign className="h-4 w-4" />
          <span>Sell Card</span>
        </button>
        <button
          onClick={onTrade}
          className="flex items-center justify-center px-4 py-2 
                   bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 
                   text-white transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <AnimatePresence>
        {showSellModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 
                     flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-md w-full"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl opacity-20 blur-xl" />
              <div className="relative bg-black/90 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <button
                  onClick={() => setShowSellModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 
                           text-white/60 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <h3 className="text-xl font-bold text-white mb-4">
                  List Card for Sale
                </h3>

                <form onSubmit={handleSell} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                      Price (RC)
                    </label>
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-xl" />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="relative w-full px-4 py-2 bg-white/5 border border-white/10 
                                 rounded-lg text-white placeholder:text-white/30
                                 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50
                                 transition-colors"
                        placeholder="Enter price in RaceCoins"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 px-4 py-2
                             bg-gradient-to-r from-red-500 to-blue-500 rounded-lg 
                             text-sm font-medium text-white
                             disabled:opacity-50 disabled:cursor-not-allowed 
                             hover:opacity-90 transition-opacity"
                  >
                    {isLoading ? 'Listing...' : 'List for Sale'}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 