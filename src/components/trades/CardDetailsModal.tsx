'use client';

import { Card } from "@prisma/client";
import Image from "next/image";
import { Clock, Star, Users, X } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

interface CardDetailsModalProps {
  card: Card & {
    owners?: Array<{
      id: string;
      name: string;
      image: string;
    }>;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CardDetailsModal({ card, isOpen, onClose }: CardDetailsModalProps) {
  if (!card || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#12141A] rounded-xl overflow-hidden max-w-2xl w-full mx-4 relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Card Image */}
            <div className="relative aspect-[2/3]">
              <Image
                src={card.imageUrl}
                alt={card.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Card Details */}
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl font-bold text-white">{card.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRarityColor(card.rarity)}`}>
                    {card.rarity}
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed">{card.description}</p>
              </div>

              <div className="space-y-4">
                {/* Card Type */}
                <div className="flex items-center gap-3 text-gray-400">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="font-medium">Type: <span className="text-white">{card.type}</span></span>
                </div>

                {/* Season */}
                <div className="flex items-center gap-3 text-gray-400">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span className="font-medium">Serial : <span className="text-white">{card.serialNumber}</span></span>
                </div>

                {/* Owners */}
                {card.owners && card.owners.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-3">
                      <Users className="h-5 w-5 text-green-400" />
                      <span className="font-medium">Current Owners</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {card.owners.map((owner) => (
                        <motion.div
                          key={owner.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-2 hover:bg-white/10 transition-colors"
                        >
                          <div className="relative w-6 h-6">
                            <Image
                              src={owner.image || '/default-avatar.png'}
                              alt={owner.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-gray-300">{owner.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function getRarityColor(rarity: string) {
  switch (rarity) {
    case 'COMMON': return 'bg-gray-600/20 text-gray-300';
    case 'RARE': return 'bg-blue-500/20 text-blue-300';
    case 'EPIC': return 'bg-purple-500/20 text-purple-300';
    case 'LEGENDARY': return 'bg-yellow-500/20 text-yellow-300';
    default: return 'bg-gray-600/20 text-gray-300';
  }
} 