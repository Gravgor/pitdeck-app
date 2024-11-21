'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Clock, Coins, Settings, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const STATS = [
  { icon: Trophy, label: 'Collection Score', value: '12,450' },
  { icon: Star, label: 'Legendary Cards', value: '35' },
  { icon: Clock, label: 'Member Since', value: 'Feb 2024' },
  { icon: Coins, label: 'Total Coins Spent', value: '245,500' }
];

export function Profile() {
  return (
    <div className="h-full bg-[#0A0C10] overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-[#12141A] border-2 border-red-500 overflow-hidden relative">
              <Image
                src="/avatars/default.jpg"
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">admin123pl</h1>
              <p className="text-sm text-gray-400">Level 24 Collector</p>
            </div>
          </div>
          <button className="p-2 rounded-lg bg-[#12141A] border border-white/5">
            <Settings className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#12141A] rounded-xl p-3 border border-white/5"
            >
              <stat.icon className="h-5 w-5 text-gray-400 mb-2" />
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-6">
        {['Settings', 'Notifications', 'Trading History', 'Support'].map((item, i) => (
          <button
            key={i}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors mb-2"
          >
            <span className="text-gray-300">{item}</span>
            <ChevronRight className="h-4 w-4 text-gray-500" />
          </button>
        ))}
      </div>
    </div>
  );
} 