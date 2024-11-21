'use client';

import { Card, Drop, Reward } from '@prisma/client';
import { motion } from 'framer-motion';
import { X, Package, Coins, Star, Timer } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { RedeemModal } from '@/components/drops/RedeemModal';

interface DropDetailsProps {
  drop: Drop & {
    rewards: Reward[];
  };
  onClose: () => void;
}

export function DropDetails({ drop, onClose }: DropDetailsProps) {
  const { location } = useGeolocation();
  const [isClaiming, setIsClaiming] = useState(false);
  const [cardDetails, setCardDetails] = useState<Card | null>(null);
  const queryClient = useQueryClient();
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const claimMutation = useMutation({
    mutationFn: async () => {
      //if (!location) throw new Error('Location not available');
      
      const response = await axios.post('/api/drops/claim', {
        dropId: drop.id,
        latitude: location?.latitude,
        longitude: location?.longitude
      });
      return response.data;
    },
    onSuccess: () => {
      setShowRedeemModal(true);
      queryClient.invalidateQueries({ queryKey: ['nearby-drops'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to claim drop');
    },
    onSettled: () => {
      setIsClaiming(false);
    }
  });

  const handleClaim = () => {
    if (!location) {
      toast.error('Location not available');
      return;
    }
    setIsClaiming(true);
    claimMutation.mutate();
  };

  const timeLeft = formatDistanceToNow(new Date(drop.expiresAt), { addSuffix: true });

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="max-w-md w-full bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
        >
          {/* Header with Rarity Badge */}
          <div className="relative h-32 bg-gradient-to-br from-red-500/20 to-purple-500/20">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`px-4 py-2 rounded-full ${
                  drop.rarity === 'LEGENDARY' ? 'bg-yellow-500/20 text-yellow-400' :
                  drop.rarity === 'EPIC' ? 'bg-purple-500/20 text-purple-400' :
                  drop.rarity === 'RARE' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}
              >
                <h3 className="text-xl font-bold">{drop.rarity} Drop</h3>
              </motion.div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
            >
              <X className="h-5 w-5 text-white/70" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Rewards Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Potential Rewards</h4>
              <div className="grid grid-cols-2 gap-3">
                {drop.rewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-4 
                             border border-white/5 flex items-center gap-3"
                  >
                    <div className="p-2 rounded-full bg-white/5">
                      {getRewardIcon(reward.type)}
                    </div>
                    <div>
                      <span className="text-lg font-bold text-white">
                        {reward.amount}x
                      </span>
                      <p className="text-sm text-gray-400">
                        {formatRewardType(reward.type)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Timer Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 py-3 px-4 
                         rounded-lg bg-white/5 border border-white/10"
            >
              <Timer className="h-5 w-5 text-gray-400" />
              <span className="text-gray-400">Expires {timeLeft}</span>
            </motion.div>

            {/* Claim Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handleClaim}
              disabled={isClaiming}
              className="w-full py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 
                         hover:from-red-600 hover:to-red-700 disabled:from-red-500/50 
                         disabled:to-red-600/50 text-white rounded-xl font-medium 
                         transition-all transform hover:scale-[1.02] active:scale-[0.98]
                         flex items-center justify-center gap-2 shadow-lg"
            >
              <Star className="h-5 w-5" />
              <span className="text-lg">
                {isClaiming ? 'Claiming...' : 'Claim Drop'}
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
      <RedeemModal
        isOpen={showRedeemModal}
        onClose={() => {
          setShowRedeemModal(false);
          onClose();
        }}
        drop={drop}
      />
    </>
  );
}

function getRewardIcon(type: string) {
  switch (type) {
    case 'PACK':
      return <Package className="h-5 w-5 text-purple-400" />;
    case 'COINS':
      return <Coins className="h-5 w-5 text-yellow-400" />;
    case 'SPECIAL_ITEM':
      return <Star className="h-5 w-5 text-red-400" />;
    default:
      return <Package className="h-5 w-5 text-blue-400" />;
  }
}

function formatRewardType(type: string) {
  return type.split('_').map(word => 
    word.charAt(0) + word.slice(1).toLowerCase()
  ).join(' ');
} 