'use client';

import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Star, Trophy, Clock, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const COLLECTION_STATS = [
  { icon: Trophy, label: 'Total Cards', value: '117' },
  { icon: Star, label: 'Legendary', value: '35' },
  { icon: Trophy, label: 'Series', value: '4' },
  { icon: Clock, label: 'Recent', value: '5' }
];

const MOCK_CARDS = [
  {
    id: 'F2-24-e-006774',
    type: 'EPIC',
    series: 'F2 DRIVER',
    name: 'Oliver Bearman',
    image: '/cards/f2/drivers/bearman.jpg'
  },
  {
    id: 'f1-24-e-000389',
    type: 'EPIC',
    series: 'F1 DRIVER',
    name: 'Charles Leclerc',
    image: '/cards/f1/drivers/leclerc.jpg'
  },
  {
    id: 'f1-24-e-002737',
    type: 'EPIC',
    series: 'F1 CAR',
    name: 'SF-24 Launch Edition',
    image: '/cards/f1/cars/sf24.jpg'
  },
  {
    id: 'f1-24-c-005388',
    type: 'COMMON',
    series: 'F1 CAR',
    name: 'VCARB 01',
    image: '/cards/f1/cars/vcarb-01.jpg'
  }
];

const FILTERS = [
  { label: 'WEC', count: 13 },
  { label: 'F1', count: 88 },
  { label: 'INDYCAR', count: 3 },
  { label: 'F2', count: 13 },
  { label: 'F1 DRIVER', count: 24 },
  { label: 'WEC DRIVER', count: 18 },
  { label: 'F1 CAR', count: 20 },
  { label: 'WEC CAR', count: 15 }
];

export function CardsCollection() {
  return (
    <div className="h-full bg-[#0A0C10] overflow-y-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold text-white mb-1">Collection Overview</h1>
        <p className="text-sm text-gray-400">Manage and explore your racing cards</p>
        
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {COLLECTION_STATS.map((stat, i) => (
            <div key={i} className="bg-[#12141A] rounded-xl p-2 border border-white/5">
              <stat.icon className="h-4 w-4 text-gray-400 mb-1" />
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Search by name, type, or series..."
            className="w-full bg-[#12141A] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/10"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="px-4 pb-24">
        <div className="grid grid-cols-2 gap-3">
          {MOCK_CARDS.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[3/4] rounded-xl overflow-hidden"
            >
              <Image
                src={card.image}
                alt={card.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-2">
                <div className="flex items-center gap-1 mb-1">
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded bg-white/10 backdrop-blur-sm
                    ${card.type === 'RARE' ? 'text-blue-400' :
                      card.type === 'EPIC' ? 'text-purple-400' :
                      'text-gray-400'}`}
                  >
                    {card.type}
                  </span>
                  <span className="text-xs text-gray-400 px-1.5 py-0.5 rounded bg-white/10 backdrop-blur-sm">
                    {card.series}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-white">{card.name}</h3>
                <p className="text-xs text-gray-400">#{card.id.toUpperCase()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 