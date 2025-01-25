import { Metadata } from 'next';
import Link from 'next/link';
import { MessageSquare, Users, Zap, Gift, Trophy, Bell } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PitDeck Discord | Join F1 Cards & Motorsport Collection Community',
  description: 'Join the PitDeck Discord community. Connect with F1 cards collectors, trade motorsport cards, and get exclusive drops for your digital racing collection.',
  keywords: [
    'F1 cards community',
    'motorsport cards discord',
    'racing collection game community',
    'digital cards trading',
    'F1 collectibles discord',
    'PitDeck community'
  ],
  openGraph: {
    title: 'Join PitDeck Discord Community',
    description: 'Connect with motorsport card collectors worldwide',
    images: ['/og/discord.jpg']
  }
};

export default function DiscordPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/30 via-blue-600/20 to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <MessageSquare className="h-4 w-4 text-[#5865F2] mr-2" />
              <span className="text-sm text-white/80">Join Our Community</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                Connect With Motorsport
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#5865F2] to-blue-500">
                Card Collectors Worldwide
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of F1 and motorsport enthusiasts. Trade cards, get exclusive drops, and be part of an amazing community.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {["F1 Trading", "Community Events", "Exclusive Drops", "Live Race Chat", "Market Updates", "Series News"].map((feature) => (
                <div key={feature} className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                  <span className="text-sm text-white/80">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-8">
              <Link
                href="https://discord.gg/3T66XNXAsh"
                className="inline-flex items-center px-8 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium transition-colors"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Join Discord Community
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Active Trading Community",
              description: "Connect with collectors and trade cards from all racing series",
              icon: Users,
              color: "blue"
            },
            {
              title: "Exclusive Drops",
              description: "Get early access to new card releases and special editions",
              icon: Gift,
              color: "purple"
            },
            {
              title: "Live Race Discussion",
              description: "Chat about races across F1, F2, F3, WEC, IndyCar, and Formula E",
              icon: Zap,
              color: "yellow"
            },
            {
              title: "Trading Competitions",
              description: "Participate in community events and win exclusive rewards",
              icon: Trophy,
              color: "red"
            },
            {
              title: "Market Updates",
              description: "Stay informed about card values and trading opportunities",
              icon: Bell,
              color: "green"
            },
            {
              title: "Community Support",
              description: "Get help from experienced collectors and our team",
              icon: MessageSquare,
              color: "indigo"
            }
          ].map((feature, i) => (
            <div key={i} className="group relative">
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000`} />
              <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
                <div className={`w-12 h-12 rounded-lg bg-${feature.color}-500/10 flex items-center justify-center mb-6`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-500`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 