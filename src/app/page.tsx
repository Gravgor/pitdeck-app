import { ArrowRight, Trophy, Users, Wallet, Star, Sparkles, Zap, Flag, Car, ArrowLeftRight, Calendar, Compass, MapPin, Signal, Smartphone, Gift, Clock, Download, Bell, Scan, Navigation, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Web App Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Globe className="h-4 w-4" />
            <span>Also available on web at</span>
            <Link href="https://pitdeck.app/map" className="font-semibold underline">
              pitdeck.app/map
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/50 via-blue-600/30 to-slate-900/50" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8 animate-fade-in">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-sm text-white/80">Mobile App Beta Coming Soon</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                  Racing Cards
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500">
                  In Your Pocket
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-2xl lg:max-w-none">
                Experience the thrill of motorsport card collecting on your mobile device. Hunt for exclusive cards at real racing events worldwide.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/waitlist"
                  className="group relative overflow-hidden rounded-full bg-white px-8 py-3 inline-flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-blue-600 transition-transform duration-300 group-hover:scale-[1.5] animate-slow-spin" />
                  <span className="relative text-black font-medium">
                    Get Early Access
                    <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                
                <Link
                  href="/features"
                  className="rounded-full px-8 py-3 text-white border border-white/10 hover:bg-white/10 transition-colors inline-flex items-center justify-center backdrop-blur-sm"
                >
                  View Features
                </Link>
              </div>

              {/* App Store Badges (Coming Soon) */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="h-4 w-4" />
                  Coming soon to
                </div>
                <div className="flex gap-4">
                  <Image
                    src="/app-store.svg"
                    alt="App Store"
                    width={120}
                    height={40}
                    className="opacity-50 hover:opacity-75 transition-opacity"
                  />
                  <Image
                    src="/play-store.svg"
                    alt="Play Store"
                    width={120}
                    height={40}
                    className="opacity-50 hover:opacity-75 transition-opacity"
                  />
                </div>
              </div>
            </div>

            {/* Right Content - Floating Phone */}
            <div className="hidden lg:block relative mt-12 lg:mt-0">
              <div className="relative">
                {/* Animated Background Elements */}
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-blue-500 rounded-3xl blur-2xl opacity-20 animate-pulse" />
                <div className="absolute -inset-8 bg-gradient-conic from-blue-500/30 via-transparent to-transparent animate-spin-slow" />
                
                {/* Phone Frame */}
                <div className="relative aspect-[9/16] max-w-[300px] mx-auto">
                  <div className="absolute inset-0 bg-black rounded-[2.5rem] p-4 shadow-2xl">
                    {/* Screen Content */}
                    <div className="relative h-full w-full bg-[#0A0C10] rounded-[2rem] overflow-hidden">
                      {/* App Interface */}
                      <div className="absolute inset-0">
                        <div className="relative h-full">
                          {/* App Header */}
                          <div className="px-4 py-6 bg-gradient-to-b from-black to-transparent">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                  <MapPin className="h-4 w-4 text-red-500" />
                                </div>
                                <div className="text-sm text-white">Circuit de Monaco</div>
                              </div>
                              <Bell className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>

                          {/* Floating Cards */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-48 h-64">
                              {[1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "absolute w-full h-full rounded-2xl shadow-2xl transform transition-all duration-500",
                                    "animate-float",
                                    i === 1 && "bg-red-500/20 -rotate-6 scale-90",
                                    i === 2 && "bg-blue-500/20 rotate-3 scale-95",
                                    i === 3 && "bg-white/5 rotate-0 scale-100"
                                  )}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Bottom Navigation */}
                          <div className="absolute bottom-0 inset-x-0 p-4">
                            <div className="flex items-center justify-around p-4 rounded-full bg-white/5 backdrop-blur-xl">
                              <Scan className="h-6 w-6 text-red-500" />
                              <Navigation className="h-6 w-6 text-gray-400" />
                              <Car className="h-6 w-6 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone Details */}
                  <div className="absolute -right-2 top-16 w-1 h-8 bg-gray-800 rounded-l" />
                  <div className="absolute -right-2 top-32 w-1 h-12 bg-gray-800 rounded-l" />
                  <div className="absolute -right-2 top-48 w-1 h-12 bg-gray-800 rounded-l" />
                </div>
              </div>

              {/* Floating Features */}
              {[
                { icon: MapPin, text: "Location Based", color: "red" },
                { icon: Signal, text: "Live Updates", color: "blue" },
                { icon: Gift, text: "Exclusive Drops", color: "green" }
              ].map((feature, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute p-3 rounded-xl bg-black/80 backdrop-blur-sm border border-white/10",
                    "animate-float",
                    i === 0 && "top-12 -right-8",
                    i === 1 && "top-1/2 -right-12",
                    i === 2 && "bottom-24 -right-8"
                  )}
                >
                  <feature.icon className={`h-5 w-5 text-${feature.color}-500`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Your Racing Collection, Anywhere
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              PitDeck mobile brings the excitement of motorsport card collecting to your fingertips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Location-Based Hunting",
                description: "Visit race tracks to unlock exclusive cards and special editions only available at specific locations",
                icon: MapPin,
                color: "red",
                delay: "0"
              },
              {
                title: "Real-Time Notifications",
                description: "Get instant alerts for nearby card drops, trade offers, and special events during race weekends",
                icon: Bell,
                color: "blue",
                delay: "100"
              },
              {
                title: "AR Card Scanner",
                description: "Use augmented reality to see your digital collection in real-world locations.",
                icon: Scan,
                color: "green",
                delay: "200"
              },
              {
                title: "Mobile Trading",
                description: "Trade cards with nearby collectors or globally, right from your phone",
                icon: ArrowLeftRight,
                color: "yellow",
                delay: "300"
              },
              {
                title: "Live Race Integration",
                description: "Earn bonus cards and rewards during live races and qualifying sessions",
                icon: Flag,
                color: "purple",
                delay: "400"
              },
              {
                title: "Event Calendar",
                description: "Stay updated with upcoming races and card drop events in your area",
                icon: Calendar,
                color: "orange",
                delay: "500"
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="relative group"
                style={{
                  animationDelay: `${feature.delay}ms`
                }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000" />
                <div className="relative p-6 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className={`w-12 h-12 rounded-lg bg-${feature.color}-500/10 flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}-500`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* App Preview Carousel */}
      <div className="relative py-32 overflow-hidden bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Experience PitDeck Mobile
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Take a sneak peek at what's coming to your device
            </p>
          </div>

          <div className="relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />
            
            <div className="relative flex gap-6 overflow-x-auto snap-x snap-mandatory px-8 pb-12 items-center 
                          scrollbar-none hover:cursor-grab active:cursor-grabbing">
              {[
                { 
                  title: "Card Collection",
                  subtitle: "Organize and showcase your cards",
                  image: "collection",
                  color: "from-red-500"
                },
                { 
                  title: "Location Hunting",
                  subtitle: "Find cards at race events",
                  image: "hunting",
                  color: "from-blue-500"
                },
                { 
                  title: "Live Trading",
                  subtitle: "Trade with collectors worldwide",
                  image: "trading",
                  color: "from-green-500"
                },
                { 
                  title: "Pack Opening",
                  subtitle: "Open packs and earn cards",
                  image: "pack",
                  color: "from-purple-500"
                },
              ].map((screen, i) => (
                <div 
                  key={i} 
                  className="relative flex-none w-[300px] snap-center transform transition-all duration-300 hover:scale-105"
                >
                  <div className={`absolute -inset-2 bg-gradient-to-br ${screen.color} to-transparent rounded-3xl blur-xl opacity-20`} />
                  <div className="relative aspect-[9/19.5] rounded-[2.5rem] overflow-hidden border-[8px] border-black/80 shadow-2xl">
                    {/* Phone Frame */}
                    <div className="absolute inset-0 bg-black rounded-[2rem] overflow-hidden">
                      {/* Status Bar */}
                      <div className="absolute top-0 inset-x-0 h-6 bg-black z-20">
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full" />
                      </div>
                      
                      {/* Screen Content */}
                      <div className="relative h-full w-full">
                        <Image
                          src={`/screenshots/${screen.image}.png`}
                          alt={screen.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />
                        
                        {/* Screen Info */}
                        <div className="absolute bottom-0 inset-x-0 p-6 space-y-2">
                          <h3 className="text-white font-semibold text-lg">{screen.title}</h3>
                          <p className="text-gray-300 text-sm">{screen.subtitle}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Phone Details */}
                    <div className="absolute -right-2 top-16 w-1 h-8 bg-gray-800 rounded-l" />
                    <div className="absolute -right-2 top-32 w-1 h-12 bg-gray-800 rounded-l" />
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Indicators */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20">
              <button className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <ArrowRight className="h-5 w-5 text-white rotate-180" />
              </button>
            </div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20">
              <button className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <ArrowRight className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Download CTA */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-blue-600 to-slate-900" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 animate-pulse-slow" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="relative px-8 py-24">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <h2 className="text-4xl sm:text-5xl font-bold text-white">
                  Be the First to Experience{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
                    PitDeck Mobile
                  </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Join our waitlist for exclusive early access and special rewards when we launch.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/waitlist"
                    className="group relative overflow-hidden rounded-full bg-white px-8 py-4 inline-flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-blue-600 transition-transform duration-300 group-hover:scale-[1.5] animate-slow-spin" />
                    <span className="relative text-black font-medium text-lg">
                      <Download className="mr-2 h-5 w-5 inline-block" />
                      Join Waitlist
                    </span>
                  </Link>
                  <Link
                    href="https://app.pitdeck.com"
                    className="rounded-full px-8 py-4 text-white border border-white/10 hover:bg-white/10 transition-colors inline-flex items-center justify-center backdrop-blur-sm text-lg"
                  >
                    Try Web Version
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>

                <div className="pt-12 space-y-4">
                  <p className="text-sm text-gray-400">Coming soon to</p>
                  <div className="flex gap-6 justify-center">
                    <div className="group relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                      <Image
                        src="/app-store.svg"
                        alt="App Store"
                        width={160}
                        height={48}
                        className="relative opacity-60 hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="group relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                      <Image
                        src="/play-store.svg"
                        alt="Play Store"
                        width={160}
                        height={48}
                        className="relative opacity-60 hover:opacity-100 transition-opacity"
                      />
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