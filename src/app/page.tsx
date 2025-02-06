import { ArrowRight, Trophy, Users, Wallet, Star, Sparkles, Zap, Flag, Car, ArrowLeftRight, Calendar, Compass, MapPin, Signal, Smartphone, Gift, Clock, Download, Bell, Scan, Navigation, Globe, Apple, Play, Shield, MessageCircle, Vote } from 'lucide-react';
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
            <span>Already available on web at</span>
            <Link href="https://pitdeck.app/auth/register" className="font-semibold underline">
              app.pitdeck.app
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section - Mobile First */}
      <div className="relative min-h-screen overflow-hidden flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-blue-600/20 to-slate-900/40" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-yellow-400 mr-2 animate-pulse" />
                <span className="text-sm text-white/80">Early Access Program Now Live</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                    Join The Future of
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 animate-gradient">
                    Motorsport Cards
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                    On Mobile
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-400 max-w-2xl">
                  Be among the first to experience PitDeck Mobile. Get exclusive rewards, early access features, and help shape the future of motorsport card collecting.
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
                    Join Early Access
                  </span>
                </Link>
                
                <Link
                  href="#rewards"
                  className="rounded-full px-8 py-4 text-white border border-white/10 hover:bg-white/10 transition-all inline-flex items-center justify-center backdrop-blur-sm hover:scale-105"
                >
                  View Rewards
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Early Access Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                {[
                  { label: "Spots Left", value: "272" },
                  { label: "Early Users", value: "28" },
                  { label: "Days Until Launch", value: "20" }

                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Mobile Preview */}
            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-blue-500 rounded-3xl blur-2xl opacity-20 animate-pulse" />
              <div className="absolute -inset-8 bg-gradient-conic from-blue-500/30 via-transparent to-transparent animate-spin-slow" />
              
              <div className="relative">
                <div className="relative aspect-[9/19.5] max-w-[300px] mx-auto transform hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-black rounded-[2.5rem] p-4 shadow-2xl">
                    <div className="relative h-full w-full bg-[#0A0C10] rounded-[2rem] overflow-hidden">
                      <Image
                        src="/screenshots/image.png"
                        alt="PitDeck Mobile Early Access"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />
                    </div>
                  </div>
                  
                  {/* Phone Details */}
                  <div className="absolute -right-2 top-16 w-1 h-8 bg-gray-800 rounded-l" />
                  <div className="absolute -right-2 top-32 w-1 h-12 bg-gray-800 rounded-l" />
                </div>

                {/* Floating Features */}
                {[
                  { icon: Gift, text: "Early Access Rewards", color: "red", position: "top-12 -right-8" },
                  { icon: Users, text: "Referral Program", color: "blue", position: "top-1/2 -right-12" },
                  { icon: Star, text: "Exclusive Content", color: "purple", position: "bottom-24 -right-8" }
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

      {/* Early Access Program */}
      <div className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
              <span className="text-sm text-white/80">Limited Spots Available</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                Join PitDeck Mobile
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-purple-500">
                Early Access Program
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Be among the first to experience the future of motorsport card collecting and get exclusive rewards
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Early Bird Rewards",
                description: "Get exclusive cards and special edition packs available only to early access members",
                icon: Gift,
                color: "red"
              },
              {
                title: "Referral Bonuses",
                description: "Invite friends and earn special rewards for each referral who joins PitDeck",
                icon: Users,
                color: "blue"
              },
              {
                title: "Priority Access",
                description: "Get first access to new features, special events, and limited edition drops",
                icon: Star,
                color: "yellow"
              }
            ].map((feature, i) => (
              <div key={i} className="group relative">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000`} />
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
                  <feature.icon className={`h-8 w-8 text-${feature.color}-500 mb-4`} />
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Referral Program Preview */}
          <div className="mt-24 text-center space-y-8">
            <h3 className="text-3xl font-bold text-white">
              Invite Friends, Earn Rewards
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { count: "5", reward: "Exclusive Early Access Pack" },
                { count: "10", reward: "Limited Edition Card" },
                { count: "25", reward: "Legendary Status + Special Badge" }
              ].map((tier, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl opacity-25 group-hover:opacity-50 transition-opacity blur" />
                  <div className="relative p-6 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
                      {tier.count}
                    </div>
                    <div className="text-sm text-gray-400">Referrals</div>
                    <div className="mt-2 text-white">{tier.reward}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* App Screenshots Carousel */}
          <div className="mt-24">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Sneak Peek at PitDeck Mobile
              </h3>
              <p className="text-gray-400">
                Get a glimpse of what's coming to your device
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-blue-500 rounded-3xl blur-2xl opacity-20" />
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "/screenshots/image.png",
                  "/screenshots/collection.png",
                  "/screenshots/market.png",
                  "/screenshots/profile.png"
                ].map((screenshot, i) => (
                  <div key={i} className="relative aspect-[9/19.5] rounded-2xl overflow-hidden group">
                    <Image
                      src={screenshot}
                      alt={`PitDeck Mobile Screenshot ${i + 1}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Early Access CTA */}
          <div className="mt-24 text-center">
            <Link
              href="/waitlist"
              className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-blue-500 text-white font-medium text-lg group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center">
                <Download className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1" />
                Join Early Access
              </span>
            </Link>
            
            <p className="mt-4 text-sm text-gray-400">
              Limited spots available. Join now to secure your place!
            </p>
          </div>
        </div>
      </div>

      {/* Partners Banner */}
      <div className="relative py-12 overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-8">
            <p className="text-sm text-gray-400 uppercase tracking-wider">Trusted Partners</p>
            
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60 hover:opacity-100 transition-opacity">
              <Link 
                href="https://discord.gg/GEZGbfpDqM" 
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-24 w-24 grayscale hover:grayscale-0 transition-all transform hover:scale-105"
              >
                <Image
                  src="/partners/partner1.png"
                  alt="Join our Discord community"
                  fill
                  className="object-contain"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section - Mobile Focused */}
      <div className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <Smartphone className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm text-white/80">Early Access Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                Exclusive Mobile
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-purple-500">
                Early Access Features
              </span>
            </h2>
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
              <span className="text-sm text-white/80">Early Access Preview</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                Be The First To
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-purple-500">
                Experience PitDeck Mobile
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get exclusive early access to these features and more
            </p>
          </div>

         <AppPreviewCarousel />
        </div>
      </div>

      {/* Early Access Benefits */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-blue-600 to-slate-900" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 animate-pulse-slow" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="relative px-8 py-24">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                  <Trophy className="h-4 w-4 text-yellow-400 mr-2" />
                  <span className="text-sm text-white/80">Early Access Perks</span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-bold text-white">
                  Exclusive Benefits for{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-purple-500">
                    Early Adopters
                  </span>
                </h2>

                <div className="grid md:grid-cols-2 gap-8 mt-12">
                  {[
                    {
                      title: "Limited Edition Cards",
                      description: "Get exclusive cards only available during early access",
                      icon: Star
                    },
                    {
                      title: "Beta Tester Badge",
                      description: "Show off your early supporter status with a unique profile badge",
                      icon: Shield
                    },
                    {
                      title: "Priority Support",
                      description: "Direct access to our development team",
                      icon: MessageCircle
                    },
                    {
                      title: "Feature Voting",
                      description: "Help shape the future of PitDeck Mobile",
                      icon: Vote
                    }
                  ].map((benefit, i) => (
                    <div key={i} className="relative group p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                      <benefit.icon className="h-8 w-8 text-blue-400 mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                      <p className="text-gray-400">{benefit.description}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-12 space-y-6">
                  <p className="text-2xl text-white">
                    Limited to first <span className="text-red-500 font-bold">300</span> users
                  </p>
                  <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
                    <div className="w-1/3 h-full bg-gradient-to-r from-red-500 to-blue-500 animate-pulse" />
                  </div>
                  <p className="text-gray-400">28 spots already claimed</p>
                </div>


                <Link
                  href="/waitlist"
                  className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-blue-500 text-white font-medium text-lg group relative overflow-hidden"
                >
                  <span className="relative flex items-center">
                    <Download className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1" />
                    Secure Your Early Access
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-slate-900" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-8">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              Ready to Join the
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-purple-500">
              Future of Motorsport Cards?
            </span>
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link
              href="/waitlist"
              className="group relative overflow-hidden rounded-full px-8 py-4 inline-flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-blue-600 to-purple-600 transition-transform duration-300 group-hover:scale-[1.1] animate-gradient" />
              <span className="relative text-white font-medium text-lg flex items-center">
                <Download className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1" />
                Join Early Access
              </span>
            </Link>
            
            <Link
              href="https://discord.gg/vvDnj2uhWQ"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-8 py-4 text-white border border-white/10 hover:bg-white/10 transition-all inline-flex items-center justify-center backdrop-blur-sm hover:scale-105"
            >
              Join Discord
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-8 text-gray-400">
            Join our community of early adopters and help shape the future of PitDeck
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