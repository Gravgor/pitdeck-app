import { ArrowRight, Check, Clock, Sparkles, Star, Zap, JoystickIcon, MessageSquare } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

const CURRENT_PHASE = 'alpha';

export const metadata: Metadata = {
  title: 'PitDeck Roadmap | F1 Cards & Motorsport Digital Collection Game Development',
  description: 'Explore the future of PitDeck - upcoming features for F1 cards, motorsport cards collection game, and cross-series trading platform. See what\'s next for digital racing collectibles.',
  keywords: [
    'F1 cards roadmap',
    'motorsport cards development',
    'racing collection game updates',
    'digital cards future',
    'F1 collectibles platform',
    'motorsport trading features'
  ],
  openGraph: {
    title: 'PitDeck Development Roadmap',
    description: 'See what\'s next for the ultimate F1 and motorsport digital cards collection game',
    images: ['/og/roadmap.jpg']
  }
};

const ROADMAP_PHASES = [
  {
    id: 'alpha',
    name: 'Alpha Release',
    status: 'current',
    description: 'Initial platform launch with core features and early community building',
    date: 'Q4 2024',
    icon: Sparkles,
    gradient: 'from-amber-500/20 to-yellow-500/20',
    features: [
      { name: 'Core card collection system', completed: true },
      { name: 'Secure authentication', completed: true },
      { name: 'P2P trading platform', completed: true },
      { name: 'Dynamic rarity system', completed: true },
      { name: 'Achievement system', completed: true },
      { name: 'Geo-based card drops', completed: true },
      { name: 'Basic marketplace', completed: true },
      { name: 'Community features', completed: true },
    ]
  },
  {
    id: 'beta',
    name: 'Beta Release',
    status: 'upcoming',
    description: 'Enhanced features, mobile app launch, and expanded marketplace',
    date: 'Q1 2025',
    icon: Star,
    gradient: 'from-blue-500/20 to-indigo-500/20',
    features: [
      { name: 'Mobile app beta launch', completed: false },
      { name: 'Advanced trading mechanics', completed: true },
      { name: 'Market analytics dashboard', completed: true },
      { name: 'Live race integration', completed: true },
      { name: 'Community events system', completed: false },
      { name: 'Collection insights', completed: true },
    ]
  },
  {
    id: 'launch',
    name: 'Full Launch',
    status: 'upcoming',
    description: 'Complete platform release with all core features and mobile apps',
    date: 'Q2 2025',
    icon: Zap,
    gradient: 'from-purple-500/20 to-pink-500/20',
    features: [
      { name: 'Cross-platform mobile app', completed: false },
      { name: 'Tournament system', completed: false },
      { name: 'Premium memberships', completed: false },
      { name: 'Pro collection tools', completed: false },
      { name: 'Event integration', completed: false },
      { name: 'Global rankings', completed: false },
    ]
  },
  {
    id: 'future',
    name: 'Future Vision',
    status: 'planned',
    description: 'Next-generation features and platform expansion',
    date: 'Q3-Q4 2025',
    icon: Star,
    gradient: 'from-red-500/20 to-orange-500/20',
    features: [
      { name: 'AR viewing experience', completed: false },
      { name: 'Team partnerships', completed: false },
      { name: 'Advanced trading engine', completed: false },
      { name: 'Global event expansion', completed: false },
      { name: 'Community governance', completed: false },
    ]
  }
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-blue-600/20 to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full 
                          border border-white/10 bg-white/5 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm text-white/80">Alpha Phase Active</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
                Development
              </span>{' '}
              <span className="text-white">Roadmap</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Follow our journey from alpha to full release. See what features are coming
              and help shape the future of PitDeck.
            </p>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-24">
          {ROADMAP_PHASES.map((phase, index) => (
            <div key={phase.id} className="relative">
              {/* Connection Line */}
              {index !== ROADMAP_PHASES.length - 1 && (
                <div className="absolute left-8 top-16 bottom-0 w-px bg-gradient-to-b from-white/20 to-transparent" />
              )}

              <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Phase Info */}
                <div className="lg:col-span-1">
                  <div className="flex items-start gap-4">
                    <div className={`
                      relative group w-16 h-16 rounded-xl flex items-center justify-center
                      bg-gradient-to-br ${phase.gradient} backdrop-blur-xl
                      border border-white/10 overflow-hidden
                    `}>
                      <div className="absolute inset-0 bg-black opacity-50" />
                      <phase.icon className="relative h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{phase.name}</h2>
                      <p className="text-gray-400">{phase.date}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-400 leading-relaxed">{phase.description}</p>
                </div>

                {/* Features Grid */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {phase.features.map((feature) => (
                    <div
                      key={feature.name}
                      className="relative group p-4 rounded-xl 
                               bg-gradient-to-br from-white/5 to-white/[0.02]
                               border border-white/10 hover:border-white/20 
                               backdrop-blur-xl transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-500/10 
                                    opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                      <div className="relative flex items-center gap-3">
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center
                          ${feature.completed 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-white/10 text-white/70'}
                        `}>
                          {feature.completed ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        <span className="text-white font-medium">{feature.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="relative px-8 py-16">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <h2 className="text-3xl font-bold text-white">Shape Our Future</h2>
              <p className="text-lg text-gray-300">
                Join our community and help influence the development of PitDeck.
                Your feedback drives our roadmap forward.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/discord"
                  className="inline-flex items-center justify-center px-8 py-3 
                           bg-[#5865F2] hover:bg-[#4752C4] rounded-xl text-white 
                           font-medium transition-colors"
                >
                  <JoystickIcon className="mr-2 h-5 w-5" />
                  Join Discord
                </Link>
                <Link
                  href="/feedback"
                  className="inline-flex items-center justify-center px-8 py-3 
                           border border-white/10 rounded-xl text-white 
                           hover:bg-white/5 font-medium transition-colors"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Submit Feedback
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 