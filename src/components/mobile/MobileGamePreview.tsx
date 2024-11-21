// @ts-nocheck
'use client';

import { motion } from 'framer-motion';
import { Star, Trophy, Gift, MapPin, Signal, Clock, ChevronRight, Compass, Car, Package, User } from 'lucide-react';
import Map, { Marker, Popup } from 'react-map-gl';
import { useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CardsCollection } from './CardsCollection';
import { PacksStore } from './PacksStore';
import { Profile } from './Profile';

// Las Vegas Circuit Coordinates
const VEGAS_CIRCUIT = {
  latitude: 36.1699,
  longitude: -115.1398,
  zoom: 14.5
};

const DROPS = [
  {
    id: 1,
    latitude: 36.1716,
    longitude: -115.1465,
    type: 'legendary',
    title: 'Sphere Drop Zone',
    description: '2.5x Legendary Drop Rate',
    bonus: '2.5x',
    timeLeft: '2h 30m'
  },
  {
    id: 2,
    latitude: 36.1677,
    longitude: -115.1487,
    type: 'epic',
    title: 'Bellagio Drop Zone',
    description: 'Race Weekend Special',
    bonus: '2x',
    timeLeft: '1h 45m'
  },
  {
    id: 3,
    latitude: 36.1721,
    longitude: -115.1371,
    type: 'rare',
    title: 'Strip Drop Zone',
    description: 'Active Event Bonus',
    bonus: '1.5x',
    timeLeft: '45m'
  },
  {
    id: 4,
    latitude: 36.1685,
    longitude: -115.1441,
    type: 'legendary',
    title: 'Circuit Center',
    description: 'F1 Race Special Drop',
    bonus: '3x',
    timeLeft: '4h'
  }
];

const BONUSES = [
  {
    icon: Trophy,
    label: 'Event Bonus',
    value: '3.0x',
    sublabel: 'F1 Weekend',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-500/10 to-pink-500/10'
  },
  {
    icon: Gift,
    label: 'Special Drop',
    value: 'Active',
    sublabel: 'Limited Time',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'from-emerald-500/10 to-teal-500/10'
  }
];

const TABS = [
  { icon: Compass, label: 'Map' },
  { icon: Car, label: 'Cards' },
  { icon: Package, label: 'Packs' },
  { icon: User, label: 'Profile' }
];

// Add these new constants
const CARD_DROPS = [
  {
    id: 'drop1',
    latitude: 36.1705,
    longitude: -115.1402,
    type: 'common',
    distance: '120m',
    timeLeft: '15m',
    mystery: {
      rarity: 'common',
      minCards: 1,
      maxCards: 3
    }
  },
  {
    id: 'drop2',
    latitude: 36.1695,
    longitude: -115.1392,
    type: 'rare',
    distance: '85m',
    timeLeft: '30m',
    mystery: {
      rarity: 'rare',
      minCards: 2,
      maxCards: 4
    }
  },
  {
    id: 'drop3',
    latitude: 36.1692,
    longitude: -115.1405,
    type: 'epic',
    distance: '150m',
    timeLeft: '45m',
    mystery: {
      rarity: 'epic',
      minCards: 1,
      maxCards: 2
    }
  }
];

export function MobileGamePreview() {
  const [selectedDrop, setSelectedDrop] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Add this new constant for the F1 event
  const F1_EVENT = {
    title: "FORMULA 1 HEINEKEN SILVER LAS VEGAS GRAND PRIX 2024",
    status: "Qualified",
    date: "21-23 NOV 2024",
    bonuses: [
      {
        icon: Trophy,
        label: 'Event Cards',
        value: 'UNLOCKED',
        sublabel: 'Limited Edition',
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'from-yellow-500/10 to-orange-500/10'
      },
      {
        icon: Star,
        label: 'Drop Rate',
        value: '5.0x',
        sublabel: 'Race Weekend',
        color: 'from-red-500 to-pink-500',
        bgColor: 'from-red-500/10 to-pink-500/10'
      }
    ]
  };

  // Add this inside the component
  const getDropStyle = (type: any) => {
    switch (type) {
      case 'common':
        return { 
          color: 'text-blue-400',
          bg: 'bg-gradient-to-br from-blue-900/80 to-blue-800/80',
          glow: 'bg-blue-900/20',
          border: 'border-blue-800/30'
        };
      case 'rare':
        return { 
          color: 'text-purple-400',
          bg: 'bg-gradient-to-br from-purple-900/80 to-purple-800/80',
          glow: 'bg-purple-900/20',
          border: 'border-purple-800/30'
        };
      case 'epic':
        return { 
          color: 'text-pink-400',
          bg: 'bg-gradient-to-br from-pink-900/80 to-pink-800/80',
          glow: 'bg-pink-900/20',
          border: 'border-pink-800/30'
        };
      default:
        return { 
          color: 'text-gray-400',
          bg: 'bg-gradient-to-br from-gray-900/80 to-gray-800/80',
          glow: 'bg-gray-900/20',
          border: 'border-gray-800/30'
        };
    }
  };

  return (
    <div className="h-full w-full bg-[#0A0C10] relative">
      {/* Status Bar */}
      <div className="relative h-6 bg-[#0A0C10] z-10">
        <div className="flex justify-between items-center px-6 py-1">
          <span className="text-white text-xs">9:41</span>
          <div className="flex items-center gap-2">
            <Signal className="h-3 w-3 text-white" />
            <span className="text-white text-xs">5G</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100%-24px)] relative">
        {activeTab === 0 ? (
          // Map View
          <div className="h-full overflow-y-auto">
            {/* Map Section */}
            <div className="relative h-[45%]">
              <Map
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                initialViewState={{
                  ...VEGAS_CIRCUIT,
                  zoom: 15.2
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
              >
                {/* User Location */}
                <Marker longitude={VEGAS_CIRCUIT.longitude} latitude={VEGAS_CIRCUIT.latitude}>
                  <div className="relative">
                    <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping" />
                    <div className="h-3 w-3 bg-blue-500 rounded-full" />
                  </div>
                </Marker>

                {/* Card Drop Markers */}
                {CARD_DROPS.map((drop) => {
                  const style = getDropStyle(drop.type);
                  return (
                    <Marker
                      key={drop.id}
                      longitude={drop.longitude}
                      latitude={drop.latitude}
                      onClick={e => {
                        e.originalEvent.stopPropagation();

                        setSelectedDrop(drop);
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group cursor-pointer"
                      >
                        <div className={`absolute -inset-4 ${style.glow} rounded-full animate-pulse duration-[2s]`} />
                        <div className={`relative flex items-center justify-center w-6 h-6 ${style.bg} rounded-full border ${style.border} shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform`}>
                          <Package className="h-3 w-3 text-white/90" />
                        </div>
                      </motion.div>
                    </Marker>
                  );
                })}

                {/* Updated Popup for card drops */}
                {selectedDrop && (
                  <Popup
                    longitude={selectedDrop.longitude}
                    latitude={selectedDrop.latitude}
                    anchor="bottom"
                    onClose={() => setSelectedDrop(null)}
                    className="bg-[#0A0C10] text-white rounded-lg shadow-2xl border border-white/5"
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getDropStyle(selectedDrop.type).bg}`} />
                          <span className="text-xs font-medium uppercase tracking-wide text-gray-300">
                            Mystery {selectedDrop.type} Drop
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{selectedDrop.distance}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="bg-[#12141A] rounded-lg p-2 border border-white/5">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Possible Cards</span>
                            <span>{selectedDrop.mystery.minCards}-{selectedDrop.mystery.maxCards}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} 
                                className="w-8 h-12 rounded bg-[#0A0C10] border border-white/5 flex items-center justify-center"
                              >
                                <Package className="h-4 w-4 text-gray-600" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Time Remaining</span>
                          <span className="text-gray-400">{selectedDrop.timeLeft}</span>
                        </div>

                        <button 
                          className={`w-full py-2 rounded-lg transition-all ${
                            selectedDrop.distance <= '100m' 
                              ? 'bg-[#1A1C20] text-gray-300 cursor-pointer hover:bg-[#1E2024] border border-white/10'
                              : 'bg-[#12141A] text-gray-600 cursor-not-allowed border border-white/5'
                          } text-sm font-medium`}
                          disabled={selectedDrop.distance > '100m'}
                        >
                          {selectedDrop.distance <= '100m' ? 'Open Drop' : 'Too Far Away'}
                        </button>
                      </div>
                    </div>
                  </Popup>
                )}
              </Map>

              {/* Overlay Header */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#0A0C10] to-transparent p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-blue-500 flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-sm font-semibold text-white">PitDeck</h1>
                    <p className="text-xs text-gray-400">admin123pl</p>
                  </div>
                </div>
              </div>
            </div>

            {/* F1 Event Qualification Banner */}
            <div className="px-4 py-3 bg-gradient-to-r from-red-500/20 via-red-500/10 to-transparent border-y border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                    <Car className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white">Event Qualified</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-medium">
                        ACTIVE
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white truncate max-w-[200px]">
                      {F1_EVENT.title}
                    </h3>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 transition-colors">
                  View Details
                </button>
              </div>
            </div>

            {/* Event Bonuses */}
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-medium text-gray-300">Event Bonuses</h2>
                  <p className="text-xs text-gray-500">Available until {F1_EVENT.date}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {F1_EVENT.bonuses.map((bonus, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-[#12141A] rounded-xl opacity-100 group-hover:opacity-50 transition-opacity" />
                    <div className="relative p-3 rounded-xl border border-white/5 bg-[#0A0C10]">
                      <div className={`inline-flex p-2 rounded-lg bg-[#12141A] mb-2`}>
                        <bonus.icon className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-lg font-bold text-gray-300">{bonus.value}</div>
                      <div className="text-xs text-gray-500">{bonus.sublabel}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Regular Active Bonuses */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-white">Active Bonuses</h2>
                <button className="text-xs text-gray-400 flex items-center gap-1">
                  View All <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {BONUSES.map((bonus, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${bonus.bgColor} rounded-xl opacity-100 group-hover:opacity-50 transition-opacity`} />
                    <div className="relative p-3 rounded-xl border border-white/5">
                      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${bonus.color} bg-opacity-10 mb-2`}>
                        <bonus.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-lg font-bold text-white">{bonus.value}</div>
                      <div className="text-xs text-gray-400">{bonus.sublabel}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Spacer for bottom tabs */}
            <div className="h-20" />
          </div>
        ) : activeTab === 1 ? (
          // Cards Collection
          <CardsCollection />
        ) : activeTab === 2 ? (
          // Packs Store
          <PacksStore />
        ) : activeTab === 3 ? (
          // Profile
          <Profile />
        ) : (
          // Other tabs placeholder
          <div className="h-full flex items-center justify-center text-gray-500">
            Coming Soon
          </div>
        )}
      </div>

      {/* Navigation Tabs - Now positioned absolutely within the mobile frame */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#0A0C10]/90 backdrop-blur-lg border-t border-white/5">
        <div className="flex justify-around py-4 px-6">
          {TABS.map((tab, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveTab(i)}
              className="flex flex-col items-center gap-1 relative"
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                {activeTab === i && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -inset-2 bg-red-500/10 rounded-lg"
                  />
                )}
                <tab.icon className={`h-5 w-5 relative z-10 transition-colors ${
                  activeTab === i ? 'text-red-500' : 'text-gray-500'
                }`} />
              </div>
              <span className={`text-xs transition-colors ${
                activeTab === i ? 'text-white' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}