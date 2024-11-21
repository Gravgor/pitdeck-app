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
      <div className="absolute top-3 left-3 z-20 flex gap-2">
        <button
          onClick={() => setShowSellModal(true)}
          className="p-2 bg-black/80 hover:bg-black rounded-full text-white/80 
                   hover:text-white transition-colors"
        >
          <DollarSign className="h-4 w-4" />
        </button>
        <button
          onClick={onTrade}
          className="p-2 bg-black/80 hover:bg-black rounded-full text-white/80 
                   hover:text-white transition-colors"
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
              className="bg-black/90 border border-white/10 rounded-xl p-6 
                       max-w-md w-full relative"
            >
              <button
                onClick={() => setShowSellModal(false)}
                className="absolute top-4 right-4 text-gray-400 
                         hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-xl font-bold text-white mb-4">
                List Card for Sale
              </h3>

              <form onSubmit={handleSell} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Price (RC)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 
                             rounded-lg text-white placeholder:text-gray-500
                             focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    placeholder="Enter price in RaceCoins"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center px-4 py-2
                           bg-red-500 hover:bg-red-600 rounded-lg 
                           text-sm font-medium text-white
                           disabled:opacity-50 disabled:cursor-not-allowed 
                           transition-colors"
                >
                  {isLoading ? 'Listing...' : 'List for Sale'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 