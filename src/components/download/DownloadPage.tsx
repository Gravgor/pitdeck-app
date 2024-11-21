'use client';

import { motion } from 'framer-motion';
import { Apple, Mail, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface DownloadPageProps {
  isPreRelease?: boolean;
}

export function DownloadPage({ isPreRelease = true }: DownloadPageProps) {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-[#0A0C10] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#0A0C10]/80 backdrop-blur-lg border-b border-white/5 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="PitDeck"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-bold text-lg">PitDeck</span>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            Open Web App
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="pt-32 pb-16 container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            {isPreRelease ? 
              'Join the Waitlist' : 
              'Download PitDeck Mobile'
            }
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg mb-8"
          >
            {isPreRelease ?
              'Be the first to experience the future of racing card collecting.' :
              'Collect, trade, and explore racing cards on the go.'
            }
          </motion.p>

          {isPreRelease ? (
            // Waitlist Form
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-2 max-w-md mx-auto"
            >
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#12141A] border border-white/10 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                />
              </div>
              <button className="px-6 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors flex items-center gap-2">
                Join Waitlist
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            // Download Buttons
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4 justify-center"
            >
              <button className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2">
                <Apple className="h-5 w-5" />
                App Store
              </button>
              <button className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2">
                <Apple className="h-5 w-5" />
                App Store
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* App Preview */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0C10] via-transparent to-[#0A0C10] z-10" />
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-md mx-auto">
            <Image
              src="/preview.png"
              alt="App Preview"
              width={400}
              height={800}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              title: 'Collect Cards',
              description: 'Build your collection with cards from various racing series.'
            },
            {
              title: 'Location-Based Drops',
              description: 'Find and collect special cards at racing events.'
            },
            {
              title: 'Trade & Share',
              description: 'Connect with other collectors and trade cards.'
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-[#12141A] rounded-xl p-6 border border-white/5"
            >
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 