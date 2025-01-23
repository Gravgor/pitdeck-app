'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const previewData = {
  collection: {
    title: "Card Collection",
    subtitle: "Organize and showcase your cards",
    images: [
      "/screenshots/collection.png",
      "/screenshots/collection-2.png",
    ],
    features: ["Grid & List Views", "Sort by Rarity", "Quick Filters"]
  },
  hunting: {
    title: "Location Hunting",
    subtitle: "Find cards at race events",
    images: [
      "/screenshots/hunting.png",
      "/screenshots/hunting-2.png",
    ],
    features: ["Track Exclusives", "Event Drops", "Nearby Cards"]
  },
  trading: {
    title: "Live Trading",
    subtitle: "Trade with collectors worldwide",
    images: [
      "/screenshots/trading.png",
    ],
    features: ["Secure Trades", "Chat System", "Trade History"]
  },
  packs: {
    title: "Pack Opening",
    subtitle: "Open packs and earn cards",
    images: [
      "/screenshots/pack.png",
    ],
    features: ["Animated Reveals", "Special Editions"]
  }
};

export function AppPreviewCarousel() {
  const [activeIndices, setActiveIndices] = useState({
    collection: 0,
    hunting: 0,
    trading: 0,
    packs: 0
  });

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndices(prev => ({
        collection: (prev.collection + 1) % 3,
        hunting: (prev.hunting + 1) % 3,
        trading: (prev.trading + 1) % 3,
        packs: (prev.packs + 1) % 3
      }));
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNext = (section: keyof typeof previewData) => {
    setActiveIndices(prev => ({
      ...prev,
      [section]: (prev[section] + 1) % 3
    }));
  };

  const handlePrev = (section: keyof typeof previewData) => {
    setActiveIndices(prev => ({
      ...prev,
      [section]: (prev[section] - 1 + 3) % 3
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {Object.entries(previewData).map(([key, data]) => (
        <div key={key} className="relative group">
          {/* Background Effects */}
          <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-red-500/20 rounded-3xl blur-xl opacity-20" />
          
          {/* Content */}
          <div className="relative aspect-[9/19.5] rounded-[2rem] overflow-hidden border border-white/10 bg-black/90 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90">
              

              {/* Images */}
              <div className="relative h-full w-full">
                {data.images.map((src, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === activeIndices[key as keyof typeof previewData] 
                        ? 'opacity-100' 
                        : 'opacity-0'
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${data.title} preview ${index + 1}`}
                      fill
                      className="object-cover opacity-60"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => handlePrev(key as keyof typeof previewData)}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/75 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleNext(key as keyof typeof previewData)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/75 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
                <h3 className="text-lg font-semibold text-white mb-1">{data.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{data.subtitle}</p>
                <div className="flex flex-wrap gap-2">
                  {data.features.map((feature) => (
                    <span 
                      key={feature}
                      className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/70"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 