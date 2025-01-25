import { Metadata } from 'next';
import { MapPin, Bell, Scan, ArrowLeftRight, Flag, Calendar, Signal, Gift, ArrowLeft, Sparkles, Download, ArrowRight, Apple, Play, Car } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

const features = [
  {
    title: "Location-Based Hunting",
    description: "Visit race tracks to unlock exclusive cards and special editions only available at specific locations.",
    icon: MapPin,
    color: "red",
    image: "hunting",
    benefits: ["Track-exclusive cards", "Event bonuses", "Location rewards"]
  },
  {
    title: "Real-Time Notifications",
    description: "Stay updated with instant alerts for nearby card drops, trade offers, and special events. Never miss an opportunity to expand your collection.",
    icon: Bell,
    color: "blue",
    image: "notifications",
    benefits: ["Instant alerts", "Never miss a drop", "Stay updated"]
  },
  {
    title: "AR Card Scanner",
    description: "Use augmented reality to see your digital collection in real-world locations. Use your phone to scan the world around you and see your cards.",
    icon: Scan,
    color: "green",
    image: "scanner",
    benefits: ["Real-world visibility", "Augmented reality", "Interactive experience"]
  },
  {
    title: "Mobile Trading",
    description: "Trade cards with nearby collectors or globally, right from your phone. Chat with other collectors and negotiate deals in real-time.",
    icon: ArrowLeftRight,
    color: "yellow",
    image: "trading",
    benefits: ["Global trading", "Real-time chat", "Convenient deals"]
  },
  {
    title: "Live Race Integration",
    description: "Earn bonus cards and rewards during live races and qualifying sessions. Special cards unlock based on race results and memorable moments.",
    icon: Flag,
    color: "purple",
    image: "events",
    benefits: ["Earn rewards", "Special cards", "Memorable moments"]
  },
  {
    title: "Event Calendar",
    description: "Stay updated with upcoming races and card drop events in your area. Plan your collecting strategy around the racing calendar.",
    icon: Calendar,
    color: "orange",
    image: "calendar",
    benefits: ["Plan your strategy", "Upcoming events", "Stay informed"]
  }
];

export const metadata: Metadata = {
  title: 'PitDeck Features | F1 Cards & Motorsport Digital Collection Game',
  description: 'Explore unique features of PitDeck - the ultimate F1 cards and motorsport digital collection game. Location-based hunting, live race integration, and cross-series trading.',
  keywords: ['F1 cards features', 'motorsport cards app', 'racing collection game', 'digital card collecting']
};

// Make page async to fetch data
export default async function FeaturesPage() {
  // Fetch random preview cards from database
  const previewCards = await prisma.card.findMany({
    where: {
      OR: [
        { rarity: 'LEGENDARY' },
        { rarity: 'EPIC' }
      ]
    },
    take: 4,
    select: {
      id: true,
      name: true,
      type: true,
      rarity: true,
      imageUrl: true,
      serialNumber: true,
      series: true,
      year: true,
      stats: true
    }
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-blue-600/20 to-slate-900/40" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-yellow-400 mr-2 animate-pulse" />
              <span className="text-sm text-white/80">Exclusive Features</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                Revolutionary Features for
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-purple-500">
                Digital Motorsport Cards
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From F1 to Formula E, discover unique features designed for the ultimate motorsport card collection experience
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {["F1 Cards", "F2 Cards", "F3 Cards", "WEC Cards", "IndyCar Cards", "Formula E Cards"].map((series) => (
                <div key={series} className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                  <span className="text-sm text-white/80">{series}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative py-24 bg-gradient-to-b from-black via-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div key={i} className="group relative">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000`} />
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg bg-${feature.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}-500`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 mb-6">{feature.description}</p>
                  
                  {/* Benefits */}
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                        <div className={`h-1.5 w-1.5 rounded-full bg-${feature.color}-500/50`} />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Preview Section */}
      <div className="relative py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 mb-16">
            <h2 className="text-4xl font-bold">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                Featured Cards From
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-purple-500">
                Multiple Racing Series
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore our collection of exclusive cards from F1, F2, F3, WEC, IndyCar, and Formula E
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {previewCards.map((card) => (
              <div key={card.id} className="group relative aspect-[2/3] rounded-xl overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000" />
                <div className="relative h-full w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                  <Image
                    src={card.imageUrl}
                    alt={card.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Card Details */}
                  <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                    <div className="text-sm font-semibold">{card.name}</div>
                    <div className="text-xs text-white/60">
                      {card.type.replace(/_/g, ' ')} • {card.series} {card.year}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className={`text-xs ${
                        card.rarity === 'LEGENDARY' ? 'text-yellow-400' : 'text-blue-400'
                      }`}>
                        {card.rarity.charAt(0) + card.rarity.slice(1).toLowerCase()}
                      </div>
                      {card.serialNumber && (
                        <div className="text-xs text-white/40">
                          #{card.serialNumber}
                        </div>
                      )}
                    </div>
                    
                    {/* Stats Preview */}
                    {card.stats && (
                      <div className="mt-2 grid grid-cols-2 gap-1">
                        {Object.entries(card.stats as Record<string, number>).slice(0, 2).map(([key, value]) => (
                          <div key={key} className="text-xs text-white/60">
                            {key}: {value}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-blue-600 to-slate-900" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 animate-pulse-slow" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="relative px-8 py-24">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-yellow-400 mr-2 animate-pulse" />
                  <span className="text-sm text-white/80">Early Access Coming Soon</span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-bold text-white">
                  Ready to Start{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 animate-gradient">
                    Collecting?
                  </span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/waitlist"
                    className="group relative overflow-hidden rounded-full bg-white px-8 py-4 inline-flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-blue-600 transition-transform duration-300 group-hover:scale-[1.5] animate-slow-spin" />
                    <span className="relative text-black font-medium text-lg flex items-center">
                      <Download className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1" />
                      Join Waitlist
                    </span>
                  </Link>
                </div>

                <div className="pt-8 space-y-4">
                  <p className="text-sm text-gray-400">Coming soon to</p>
                  <div className="flex gap-4 justify-center">
                    <div className="group relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                      <div className="relative flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all transform group-hover:scale-105">
                        <Apple className="h-6 w-6 text-white" />
                        <div>
                          <div className="text-xs text-white/60">Download on the</div>
                          <div className="text-sm font-semibold text-white">App Store</div>
                        </div>
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                      <div className="relative flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all transform group-hover:scale-105">
                        <Play className="h-6 w-6 text-white" />
                        <div>
                          <div className="text-xs text-white/60">Get it on</div>
                          <div className="text-sm font-semibold text-white">Google Play</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 