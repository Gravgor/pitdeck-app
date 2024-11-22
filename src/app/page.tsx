import { ArrowRight, Trophy, Users, Wallet, Star, Sparkles, Zap, Flag, Car, ArrowLeftRight, Calendar, Compass, MapPin, Signal, Smartphone, Gift, Clock } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/cards/Card';
import { getRandomRecords, prisma } from '@/lib/prisma';
import { MobileGamePreview } from '@/components/mobile/MobileGamePreview';
import { getUpcomingEvents, getSeriesColor } from '@/lib/events';
import { format } from 'date-fns';
import Link from 'next/link';
import { FeaturedCardsLoading } from '@/components/cards/FeaturedCardsLoading';
import { Suspense } from 'react';

async function getRandomCards() {
  try {
    // Get all LEGENDARY and EPIC cards
    const allCards = await prisma.card.findMany({
      where: {
        OR: [
          { rarity: 'LEGENDARY' },
          { rarity: 'EPIC' },
        ]
      },
      include: {
        owners: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });

    // Shuffle array and take first 3 unique cards (by name)
    const shuffled = allCards.sort(() => Math.random() - 0.5);
    const unique = Array.from(new Map(shuffled.map(card => [card.name, card])).values());
    return unique.slice(0, 3);

  } catch (error) {
    console.error('Error fetching random cards:', error);
    return [];
  }
}

async function FeaturedCards() {
  const featuredCards = await getRandomCards();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {featuredCards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          name={card.name}
          type={card.type}
          rarity={card.rarity}
          imageUrl={card.imageUrl}
          description={card.description}
          stats={card.stats}
          edition={card.edition}
          serialNumber={card.serialNumber}
          owner={card.owners[0]}
        />
      ))}
      
      {featuredCards.length === 0 && (
        <div className="col-span-3 text-center py-12">
          <p className="text-gray-400">
            No featured cards available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}


// Stats data
const STATS_DATA = [
  { icon: Flag, value: "5+", label: "Racing Series", color: "from-red-500 to-orange-500", bgColor: "bg-red-500/10", iconColor: "text-red-500" },
  { icon: Car, value: "1000+", label: "Unique Cards", color: "from-blue-500 to-purple-500", bgColor: "bg-blue-500/10", iconColor: "text-blue-500" },
  { icon: ArrowLeftRight, value: "50K+", label: "Cards Traded", color: "from-green-500 to-emerald-500", bgColor: "bg-green-500/10", iconColor: "text-green-500" },
  { icon: Users, value: "10K+", label: "Collectors", color: "from-yellow-500 to-amber-500", bgColor: "bg-yellow-500/10", iconColor: "text-yellow-500" }
];

// Series data
const SERIES_DATA = [
  { name: "Formula 1", image: "/logos/f1.png", color: "from-red-500" },
  { name: "WEC", image: "/logos/wec.png", color: "from-blue-500" },
  { name: "IndyCar", image: "/logos/indycar.png", color: "from-green-500" },
  { name: "NASCAR", image: "/logos/nascar.png", color: "from-yellow-500" },
  { name: "Formula E", image: "/logos/formula-e.png", color: "from-purple-500" }
];

export default async function Page() {
  const upcomingEvents = await getUpcomingEvents(3);

  return (
    <main className="min-h-screen bg-black">
      {/* Alpha Banner */}
      <div className="sticky top-0 z-50 bg-yellow-500/10 border-b border-yellow-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-yellow-500 animate-pulse" />
              <span className="text-xs font-medium text-yellow-500">Alpha Version</span>
            </div>
            <span className="hidden sm:block text-xs text-gray-400">
              Early access release - Features may be unstable
            </span>
            <Link href="/roadmap" className="text-xs text-yellow-500 hover:text-yellow-400 font-medium flex items-center">
              View Roadmap <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/50 via-blue-600/30 to-slate-900/50" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        </div>
        
        <div className="relative w-full max-w-7xl mx-auto px-4 py-20">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
              <span className="text-sm text-white/80">New 2024 Season Cards</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                The Ultimate
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500">
                Motorsport Collection
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Collect and trade cards from Formula 1, WEC, IndyCar, NASCAR, and more.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signin"
                className="w-full sm:w-auto group inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 transition-all duration-200 shadow-lg shadow-red-500/25"
              >
                Start Collecting
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/browse"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full text-white border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                Browse Cards
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cards */}
      <section className="relative py-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-display font-bold text-white inline-flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-400" />
            Featured Cards
          </h2>
          <p className="text-gray-400 mt-2">
            Discover legendary moments across motorsports
          </p>
        </div>
        
        <Suspense fallback={<FeaturedCardsLoading />}>
          <div className="overflow-x-auto -mx-4 px-4 pb-4 scrollbar-hide">
            <div className="flex sm:grid sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <FeaturedCards />
            </div>
          </div>
        </Suspense>
      </section>

      {/* Stats Section */}
      <section className="relative border-y border-white/10 bg-white/5">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-blue-500/10" />
        </div>
        
        <div className="relative px-4 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {STATS_DATA.map((stat, index) => (
              <div key={index} className="group relative">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000`} />
                <div className="relative p-6 bg-black/50 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex flex-col items-center">
                    <div className={`p-3 ${stat.bgColor} rounded-xl mb-4`}>
                      <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.iconColor}`} />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-2 font-display">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Series Section */}
      <section className="relative py-20">
        <div className="px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
            Featured Series
          </h2>
          <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex sm:grid sm:grid-cols-5 gap-4 max-w-7xl mx-auto">
              {SERIES_DATA.map((series) => (
                <Link
                  key={series.name}
                  href={`/series/${series.name.toLowerCase()}`}
                  className="group relative rounded-xl overflow-hidden flex-shrink-0 w-60 sm:w-auto"
                >
                  <div className={`absolute inset-0 bg-gradient-to-t ${series.color} to-transparent opacity-60 group-hover:opacity-80 transition-opacity`} />
                  <Image
                    src={series.image}
                    alt={series.name}
                    width={300}
                    height={200}
                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-end p-4">
                    <h3 className="text-white font-bold group-hover:translate-x-1 transition-transform">
                      {series.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Game Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Mobile App Preview */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-blue-500 rounded-3xl blur-2xl opacity-20" />
              <div className="relative aspect-[9/16] rounded-3xl overflow-hidden border-8 border-white/10 shadow-2xl">
                {/* Game Frame Lighting Effects */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                  <div className="absolute -left-1/2 -top-1/2 w-[200%] h-[200%] bg-gradient-conic from-blue-500/30 via-transparent to-transparent animate-spin-slow" />
                </div>

                {/* Device Frame */}
                <div className="relative h-full w-full bg-black rounded-2xl overflow-hidden p-3">
                  {/* Screen Glare Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  
                  {/* Power Button */}
                  <div className="absolute -right-2 top-16 w-1 h-8 bg-gray-800 rounded-l" />
                  
                  {/* Volume Buttons */}
                  <div className="absolute -right-2 top-32 w-1 h-12 bg-gray-800 rounded-l" />
                  <div className="absolute -right-2 top-48 w-1 h-12 bg-gray-800 rounded-l" />

                  {/* Game Content */}
                  <div className="relative h-full w-full bg-[#0A0C10] rounded-xl overflow-hidden">
                    <MobileGamePreview />
                  </div>

                  {/* Device Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[25%] h-[4%] bg-black rounded-b-2xl">
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-800 rounded-full" />
                    <div className="absolute bottom-1.5 left-1/4 w-1 h-1 bg-gray-800 rounded-full" />
                    <div className="absolute bottom-1.5 right-1/4 w-1 h-1 bg-gray-800 rounded-full" />
                  </div>
                </div>

                {/* Reflections */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                
                {/* Bottom Reflection */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Mobile Game Features */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Hunt Cards in the Real World
                </h2>
                <p className="text-xl text-gray-400">
                  Turn your race weekend into a treasure hunt. Find exclusive cards at actual racing events and locations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Feature Cards */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <MapPin className="h-8 w-8 text-red-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Location-Based Drops</h3>
                  <p className="text-gray-400">Find rare cards at race tracks and motorsport venues worldwide</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <Calendar className="h-8 w-8 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Event Bonuses</h3>
                  <p className="text-gray-400">Higher drop rates and exclusive cards during race weekends</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <Compass className="h-8 w-8 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Exploration Rewards</h3>
                  <p className="text-gray-400">Earn bonus rewards by exploring new racing locations</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <Signal className="h-8 w-8 text-yellow-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Live Racing Bonuses</h3>
                  <p className="text-gray-400">Special drops during live races and qualifying sessions</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/download"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 transition-all duration-200"
                >
                  <Smartphone className="mr-2 h-5 w-5" />
                  Download App
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full text-white border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  View Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Bonus Section - Mobile Optimized */}
      <div className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-900 to-black">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Upcoming Race Events</h2>
            <p className="text-base sm:text-xl text-gray-400">Find exclusive cards at these upcoming races</p>
          </div>

          <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="flex-none w-[85vw] sm:w-auto group relative rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-t ${getSeriesColor(event.series)} to-transparent`} />
                  <Image
                    src={`/events/${event.series.toLowerCase()}/${event.circuitId}.jpg`}
                    alt={event.name}
                    width={400}
                    height={300}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-red-300" />
                        <span className="text-sm text-red-300">{event.dropMultiplier}x Drop Rate</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Flag className="h-4 w-4 text-gray-300" />
                          <span className="text-sm text-gray-300">{event.series}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">{event.name}</h3>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-300" />
                          <p className="text-sm text-gray-300">{event.location}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-300" />
                            <p className="text-sm text-gray-300">
                              {format(event.date, 'MMMM d, yyyy')}
                            </p>
                          </div>
                          {event.qualifyingDate && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-300" />
                              <p className="text-sm text-gray-300">
                                Qualifying: {format(event.qualifyingDate, 'MMM d, HH:mm')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {upcomingEvents.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-400">
                    No upcoming events at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/events"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-full text-white border border-white/10 hover:bg-white/10 transition-colors"
            >
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-slate-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative p-8 bg-black rounded-lg">
                <div className="flex justify-center mb-6">
                  <div className="p-3 bg-red-600/10 rounded-xl">
                    <Wallet className="h-8 w-8 text-red-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-4">Collect</h3>
                <p className="text-gray-400 text-center">
                  Build your collection with cards from all racing series. From common cards to legendary moments.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative p-8 bg-black rounded-lg">
                <div className="flex justify-center mb-6">
                  <div className="p-3 bg-blue-600/10 rounded-xl">
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-4">Trade</h3>
                <p className="text-gray-400 text-center">
                  Exchange cards with collectors worldwide. Build your perfect motorsport collection.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative p-8 bg-black rounded-lg">
                <div className="flex justify-center mb-6">
                  <div className="p-3 bg-yellow-600/10 rounded-xl">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-4">Compete</h3>
                <p className="text-gray-400 text-center">
                  Join tournaments and climb the leaderboard. Prove yourself as the ultimate collector.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-blue-600 to-slate-900" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            <div className="relative px-8 py-16">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Start Your Motorsport Collection
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Join thousands of motorsport fans collecting cards from their favorite racing series.
                </p>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full bg-white text-red-600 hover:bg-gray-100 transition-colors"
                >
                  Get Started
                  <Zap className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Add this to ensure the page is dynamically rendered
export const revalidate = 0;