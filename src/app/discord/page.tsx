import { ArrowRight, MessageCircle, Users, Zap, Shield, Gift, Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const COMMUNITY_FEATURES = [
  {
    icon: Users,
    title: 'Active Community',
    description: 'Join thousands of motorsport enthusiasts collecting and trading cards.'
  },
  {
    icon: Gift,
    title: 'Exclusive Drops',
    description: 'Get notified about special card drops and community events.'
  },
  {
    icon: Bell,
    title: 'Latest Updates',
    description: 'Be the first to know about new features and platform updates.'
  },
  {
    icon: Shield,
    title: 'Trading Hub',
    description: 'Safe and verified trading channels for the community.'
  }
];

export default function DiscordPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/30 via-blue-600/20 to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <MessageCircle className="h-4 w-4 text-[#5865F2] mr-2" />
              <span className="text-sm text-white/80">Join many collectors around the world</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Join the PitDeck Community
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Connect with fellow collectors, get exclusive updates, and participate in community events.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://discord.gg/f7jb4Vsf2R"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full bg-[#5865F2] text-white hover:bg-[#4752C4] transition-colors"
              >
                Join Discord Server
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {COMMUNITY_FEATURES.map((feature, index) => (
            <div
              key={index}
              className="relative group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="p-3 bg-[#5865F2]/10 rounded-xl w-fit mb-4">
                <feature.icon className="h-6 w-6 text-[#5865F2]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#5865F2]/20 to-purple-600/20" />
          <Image
            src="/discord-preview.jpg"
            alt="Discord Server Preview"
            width={1200}
            height={600}
            className="relative rounded-xl"
          />
        </div>
      </div>
    </div>
  );
} 