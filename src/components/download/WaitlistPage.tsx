'use client';

import { motion } from 'framer-motion';
import { Mail, ChevronRight, Star, Trophy, MapPin, Sparkles, Github } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const FEATURES = [
  {
    icon: MapPin,
    title: 'Location-Based Drops',
    description: 'Collect exclusive cards by visiting real racing events worldwide',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    icon: Trophy,
    title: 'Special Events',
    description: 'Participate in time-limited events to earn rare cards',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Star,
    title: 'Exclusive Content',
    description: 'Get early access to new series and limited edition cards',
    color: 'from-amber-500 to-orange-500'
  }
];

const APP_PREVIEW_IMAGES = [
  '/mobile-app/1.png',
  '/mobile-app/2.png'
];

export function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === APP_PREVIEW_IMAGES.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          source: 'website_waitlist' 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Waitlist submission error:', error);
      // Handle error (show error message to user)
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-white py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-500">Coming Soon to Mobile</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
          >
            Join the Future of Racing Card Collecting
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 mb-8"
          >
            Be among the first to experience our revolutionary mobile app. 
            Get exclusive rewards and early access to special features.
          </motion.p>

          {!submitted ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="flex gap-2 max-w-md mx-auto"
            >
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#12141A] border border-white/10 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500/50"
                />
              </div>
              <button 
                type="submit"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium hover:from-red-600 hover:to-orange-600 transition-all flex items-center gap-2 group"
              >
                Join Waitlist
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 max-w-md mx-auto"
            >
              <p className="text-green-400">Thanks for joining! We'll be in touch soon.</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-8"
          >
            <Link 
              href="/discord" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] transition-colors text-white font-medium group"
            >
              <Github className="h-5 w-5" />
              <span>Join our Discord</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-[#12141A] rounded-xl p-6 border border-white/5 relative group hover:border-white/10 transition-colors"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-xl`} />
              <feature.icon className={`h-6 w-6 mb-4 bg-gradient-to-br ${feature.color} rounded-lg p-1 text-white`} />
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Updated App Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative max-w-[280px] mx-auto h-[600px]"
        >
          <div className="absolute -inset-4 bg-gradient-to-b from-red-500/20 via-orange-500/20 to-transparent blur-xl" />
          <div className="relative h-full">
            {APP_PREVIEW_IMAGES.map((src, index) => (
              <motion.div
                key={src}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: currentImageIndex === index ? 1 : 0,
                  scale: currentImageIndex === index ? 1 : 0.8,
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
                style={{ display: currentImageIndex === index ? 'block' : 'none' }}
              >
                <Image
                  src={src}
                  alt={`App Preview ${index + 1}`}
                  fill
                  className="rounded-2xl border border-white/10 object-contain"
                  priority
                />
              </motion.div>
            ))}
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-4">
            {APP_PREVIEW_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentImageIndex === index 
                    ? 'bg-red-500' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 