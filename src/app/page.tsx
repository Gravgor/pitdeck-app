import { ArrowRight, Trophy, Users, Wallet, Star, Sparkles, Zap, Flag, Car, ArrowLeftRight, Calendar, Compass, MapPin, Signal, Smartphone, Gift, Clock, Download, Bell, Scan, Navigation, Globe, Apple, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AppPreviewCarousel } from '@/components/landing/AppPreviewCarousel';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PitDeck | F1 Cards & Motorsport Digital Card Collection Game',
  description: 'Collect, trade and hunt exclusive F1 cards and motorsport cards in the ultimate digital card collection game. Join the future of motorsport card collecting.',
  keywords: ['F1 cards', 'motorsport cards', 'collection game', 'digital cards', 'racing cards', 'Formula 1 cards'],
  openGraph: {
    title: 'PitDeck | F1 Cards & Motorsport Digital Card Collection Game',
    description: 'Collect, trade and hunt exclusive F1 cards and motorsport cards in the ultimate digital card collection game.',
    images: ['/og-image.jpg'],
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "name": "PitDeck - F1 Cards Collection Game",
  "description": "Digital motorsport card collection game featuring F1 cards and exclusive racing collectibles",
  "applicationCategory": "Game",
  "operatingSystem": "iOS, Android",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Web App Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Globe className="h-4 w-4" />
            <span>Also available on web at</span>
            <Link href="https://pitdeck.app/auth/register" className="font-semibold underline">
              app.pitdeck.app
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-blue-600/20 to-slate-900/40" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        </div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-yellow-400 mr-2 animate-pulse" />
                <span className="text-sm text-white/80">Mobile App Beta Coming Soon</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                    The Ultimate Motorsport
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 animate-gradient">
                    Cards Collection Game
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                    From F1 to Formula E
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-400 max-w-2xl">
                  Collect and trade digital cards from every major racing series. From F1 to F2, F3, WEC, IndyCar, and Formula E - build your ultimate motorsport collection in one place.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/waitlist"
                  className="group relative overflow-hidden rounded-full px-8 py-4 inline-flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-blue-600 to-purple-600 transition-transform duration-300 group-hover:scale-[1.1] animate-gradient" />
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-blue-600 to-purple-600 opacity-50 blur-xl transition-transform duration-300 group-hover:scale-[1.2] animate-gradient" />
                  <span className="relative text-white font-medium text-lg flex items-center">
                    <Download className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1" />
                    Join Waitlist
                  </span>
                </Link>
                
                <Link
                  href="https://pitdeck.app/auth/register"
                  className="rounded-full px-8 py-4 text-white border border-white/10 hover:bg-white/10 transition-all inline-flex items-center justify-center backdrop-blur-sm hover:scale-105"
                >
                  Try Web Version
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* App Store Badges */}
              <div className="pt-2 space-y-4">
                <p className="text-sm text-gray-400">Coming soon to</p>
                <div className="flex gap-4 justify-center lg:justify-start">
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

              {/* Series Showcase */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-6">
                {["F1 Cards", "F2 Cards", "F3 Cards", "WEC Cards", "IndyCar Cards", "Formula E Cards"].map((series) => (
                  <div key={series} className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                    <span className="text-sm text-white/80">{series}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - 3D Phone */}
            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-blue-500 rounded-3xl blur-2xl opacity-20 animate-pulse" />
              <div className="absolute -inset-8 bg-gradient-conic from-blue-500/30 via-transparent to-transparent animate-spin-slow" />
              
              <div className="relative">
                <div className="relative aspect-[9/19.5] max-w-[300px] mx-auto transform hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-black rounded-[2.5rem] p-4 shadow-2xl">
                    <div className="relative h-full w-full bg-[#0A0C10] rounded-[2rem] overflow-hidden">
                      {/* Phone Content */}
                      <div className="absolute inset-0">
                        <Image
                          src="/screenshots/hunting.png"
                          alt="PitDeck Mobile"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Phone Details */}
                  <div className="absolute -right-2 top-16 w-1 h-8 bg-gray-800 rounded-l" />
                  <div className="absolute -right-2 top-32 w-1 h-12 bg-gray-800 rounded-l" />
                </div>

                {/* Floating Features */}
                {[
                  { icon: MapPin, text: "Location Based", color: "red", position: "top-12 -right-8" },
                  { icon: Signal, text: "Live Updates", color: "blue", position: "top-1/2 -right-12" },
                  { icon: Gift, text: "Exclusive Drops", color: "purple", position: "bottom-24 -right-8" }
                ].map((feature, i) => (
                  <div
                    key={i}
                    className={`absolute ${feature.position} p-3 rounded-xl bg-black/80 backdrop-blur-sm border border-white/10
                              animate-float hover:scale-110 transition-transform cursor-pointer`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    <feature.icon className={`h-5 w-5 text-${feature.color}-500`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="relative py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
              <Smartphone className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm text-white/80">Mobile Experience</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                The Most Advanced
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-purple-500">
                Motorsport Cards Mobile Game
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the future of racing card collecting with features designed for every motorsport series
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Multi-Series Collection",
                description: "Collect cards from F1, F2, F3, WEC, IndyCar, and Formula E all in one place",
                icon: Trophy,
                color: "red",
                features: ["All racing series", "Exclusive cards", "Special editions"]
              },
              {
                title: "Location-Based Hunting",
                description: "Visit race tracks to unlock exclusive cards and special editions only available at specific locations",
                icon: MapPin,
                color: "blue",
                features: ["Track-specific drops", "Event bonuses", "Geo-locked cards"]
              },
              {
                title: "Live Race Integration",
                description: "Earn special cards and rewards during live races across all major racing series",
                icon: Flag,
                color: "purple",
                features: ["Race rewards", "Live drops", "Event specials"]
              },
              {
                title: "Cross-Series Trading",
                description: "Trade cards between different racing series with collectors worldwide",
                icon: ArrowLeftRight,
                color: "yellow",
                features: ["Global marketplace", "Series swaps", "Secure trading"]
              },
              {
                title: "Real-Time Updates",
                description: "Get instant notifications for card drops during race weekends across all series",
                icon: Bell,
                color: "green",
                features: ["Race alerts", "Drop notifications", "Series updates"]
              },
              {
                title: "Racing Calendar",
                description: "Track upcoming races and card drops across all motorsport series",
                icon: Calendar,
                color: "orange",
                features: ["Multi-series calendar", "Drop schedules", "Event planning"]
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative"
              >
                {/* Gradient Border */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000`} />
                
                {/* Content */}
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 h-full">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg bg-${feature.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}-500`} />
                  </div>
                  
                  {/* Text Content */}
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 mb-6">{feature.description}</p>
                  
                  {/* Feature List */}
                  <ul className="space-y-2">
                    {feature.features.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                        <div className={`h-1.5 w-1.5 rounded-full bg-${feature.color}-500/50`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <Link
              href="/features"
              className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm transition-all hover:scale-105"
            >
              <span className="text-white mr-2">Explore All Features</span>
              <ArrowRight className="h-5 w-5 text-white" />
            </Link>
          </div>
        </div>
      </div>

      {/* App Preview Carousel */}
      <div className="relative py-32 overflow-hidden bg-gradient-to-b from-slate-900 to-black overflow-x-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4 px-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
              <Smartphone className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm text-white/80">App Preview</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                Experience PitDeck
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-purple-500">
                Mobile
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Take a sneak peek at what's coming to your device
            </p>
          </div>

         <AppPreviewCarousel />
        </div>
      </div>

      {/* Download CTA */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-blue-600 to-slate-900" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 animate-pulse-slow" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="relative px-8 py-24">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-yellow-400 mr-2 animate-pulse" />
                  <span className="text-sm text-white/80">Early Access Coming Soon</span>
                </div>

                {/* Title */}
                <h2 className="text-4xl sm:text-5xl font-bold text-white">
                  Be the First to Experience{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 animate-gradient">
                    PitDeck Mobile
                  </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Join our waitlist for exclusive early access and special rewards when we launch.
                </p>
                
                {/* Action Buttons */}
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
                  <Link
                    href="https://pitdeck.app/auth/register"
                    className="rounded-full px-8 py-4 text-white border border-white/10 hover:bg-white/10 transition-colors inline-flex items-center justify-center backdrop-blur-sm text-lg group"
                  >
                    Try Web Version
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* App Store Badges */}
                <div className="pt-12 space-y-4">
                  <p className="text-sm text-gray-400">Coming soon to</p>
                  <div className="flex gap-6 justify-center">
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

                {/* Feature Pills */}
                <div className="flex flex-wrap justify-center gap-4 pt-8">
                  {[
                    { icon: MapPin, text: "Location Based" },
                    { icon: Signal, text: "Live Updates" },
                    { icon: Gift, text: "Exclusive Drops" },
                    { icon: Scan, text: "AR Scanner" }
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
                    >
                      <feature.icon className="h-4 w-4 text-blue-400 mr-2" />
                      <span className="text-sm text-white/80">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-black to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black to-transparent" />
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}