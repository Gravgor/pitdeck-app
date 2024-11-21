'use client';

import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import Image from 'next/image';

const PACKS = [
  {
    id: 'standard',
    name: 'Standard Pack',
    type: 'STANDARD',
    description: '5 cards with at least one Rare card',
    price: 1000,
    image: '/packs/standard.jpg'
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    type: 'PREMIUM',
    description: '5 cards with at least one Epic card',
    price: 2500,
    image: '/packs/premium.jpg'
  },
  {
    id: 'legendary-circuits',
    name: 'Legendary Circuits Pack',
    type: 'SPECIAL_EDITION',
    description: '3 cards featuring iconic racing circuits',
    price: 2500,
    image: '/packs/legendary.jpg'
  },
  {
    id: 'lemans',
    name: 'Le Mans Pack',
    type: 'SPECIAL_EDITION',
    description: '4 cards celebrating Le Mans history',
    price: 3000,
    image: '/packs/lemans.jpg'
  }
];

const getPackTypeStyle = (type: string) => {
  switch (type) {
    case 'STANDARD':
      return 'bg-blue-500';
    case 'PREMIUM':
      return 'bg-purple-500';
    case 'SPECIAL_EDITION':
      return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    default:
      return 'bg-gray-500';
  }
};

export function PacksStore() {
  return (
    <div className="h-full bg-[#0A0C10] overflow-y-hidden">
      {/* Header with Balance */}
      <div className="px-4 pt-4 pb-3 border-b border-white/5">
        <h1 className="text-xl font-bold text-white mb-4">Pack Store</h1>
        <div className="bg-[#12141A] rounded-xl p-3 border border-white/5">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            <div>
              <div className="text-sm text-gray-400">Your Balance</div>
              <div className="text-lg font-bold text-white">121 555 Coins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Packs Grid */}
      <div className="p-4 grid gap-4 pb-24">
        {PACKS.map((pack) => (
          <motion.div
            key={pack.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-xl overflow-hidden border border-white/5 bg-[#12141A]"
          >
            <div className="aspect-[2/1] relative">
              <Image
                src={pack.image}
                alt={pack.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12141A] to-transparent" />
              <div className="absolute top-3 left-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full text-white ${getPackTypeStyle(pack.type)}`}>
                  {pack.type.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-1">{pack.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{pack.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="text-white font-medium">{pack.price}</span>
                  <span className="text-gray-500 text-sm">Coins</span>
                </div>
                <button className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">
                  Open Pack
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 