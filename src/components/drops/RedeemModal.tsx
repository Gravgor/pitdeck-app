import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Drop, Reward } from '@prisma/client';
import Image from 'next/image';
import { Coins, Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  drop: Drop & {
    rewards: (Reward & {
      card?: Card;
    })[];
  };
}

interface DropWithCards extends Drop {
  rewards: (Reward & {
    card: Card | null;
  })[];
}

export function RedeemModal({ isOpen, onClose, drop }: RedeemModalProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [dropDetails, setDropDetails] = useState<DropWithCards | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchDropDetails();
    }
  }, [isOpen, drop.id]);

  const fetchDropDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/drops/cards?dropId=${drop.id}`);
      setDropDetails(response.data);
    } catch (error) {
      toast.error('Failed to load drop details');
      console.error('Error fetching drop details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-black/90 p-6 rounded-2xl border border-white/10 max-w-md w-full mx-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-white/50" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Card Preview */}
                <div className="relative aspect-[2/3] w-full bg-white/5 rounded-xl overflow-hidden">
                  {isRevealed ? (
                    dropDetails?.rewards.map((reward) => (
                      reward.card && (
                        <div key={reward.id} className="relative h-full">
                          <Image
                            src={reward.card.imageUrl}
                            alt={reward.card.name}
                            fill
                            className="object-cover"
                          />
                          {/* Overlay with card details */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                              {/* Rarity Badge */}
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                  reward.card.rarity === 'LEGENDARY' ? 'bg-yellow-500/20 text-yellow-400' :
                                  reward.card.rarity === 'EPIC' ? 'bg-purple-500/20 text-purple-400' :
                                  reward.card.rarity === 'RARE' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {reward.card.rarity}
                                </span>
                              </div>
                              
                              {/* Card Name */}
                              <h3 className="text-lg font-bold text-white">
                                {reward.card.name}
                              </h3>
                              
                              {/* Serial Number */}
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">
                                  #{reward.card.serialNumber}
                                </span>
                                {reward.card.serialNumber && parseInt(reward.card.serialNumber) <= 100 && (
                                  <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">
                                    Early Mint
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    ))
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-8xl">?</span>
                    </div>
                  )}
                </div>

                {/* Rewards */}
                {isRevealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Coins className="w-5 h-5 text-yellow-400" />
                        <span className="text-lg font-medium">+{drop.rewards.find(r => r.type === 'COINS')?.amount || 0}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-purple-400" />
                        <span className="text-lg font-medium">+50 XP</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action Button */}
                <button
                  onClick={isRevealed ? onClose : handleReveal}
                  className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 
                           rounded-lg font-medium transition-colors"
                >
                  {isRevealed ? 'Close' : 'Reveal Rewards'}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}