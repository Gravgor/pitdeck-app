'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';

export function MarketplaceFilters() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search cards..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 
                     rounded-lg text-white placeholder:text-gray-500
                     focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 
                   rounded-lg text-white flex items-center gap-2
                   transition-colors"
        >
          <Filter className="h-5 w-5" />
          Filters
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/5 
                      border border-white/10 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Rarity
            </label>
            <select className="w-full px-3 py-2 bg-white/5 border border-white/10 
                           rounded-lg text-white">
              <option value="">All rarities</option>
              <option value="LEGENDARY">Legendary</option>
              <option value="EPIC">Epic</option>
              <option value="RARE">Rare</option>
              <option value="COMMON">Common</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Type
            </label>
            <select className="w-full px-3 py-2 bg-white/5 border border-white/10 
                           rounded-lg text-white">
              <option value="">All types</option>
              <option value="DRIVER">Driver</option>
              <option value="TEAM">Team</option>
              <option value="MOMENT">Moment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Price Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 
                         rounded-lg text-white placeholder:text-gray-500"
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 
                         rounded-lg text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Listing Type
            </label>
            <select className="w-full px-3 py-2 bg-white/5 border border-white/10 
                           rounded-lg text-white">
              <option value="">All listings</option>
              <option value="SALE">For Sale</option>
              <option value="TRADE">For Trade</option>
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 