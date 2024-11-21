import { ArrowRight, Check, Clock, Sparkles, Star, Zap } from 'lucide-react';
import Link from 'next/link';

const CURRENT_PHASE = 'alpha';

const ROADMAP_PHASES = [
  {
    id: 'alpha',
    name: 'Alpha Release',
    status: 'current',
    description: 'Initial platform launch with core features',
    date: 'Q4 2024',
    features: [
      { name: 'Card collection system', completed: true },
      { name: 'User authentication', completed: true },
      { name: 'Trading functionality', completed: true },
      { name: 'Card rarity system', completed: true },
      { name: 'Achievement tracking', completed: true },
      { name: 'Location-based drops', completed: true },
      { name: 'Basic marketplace', completed: true },
      { name: 'Social features', completed: true },
    ]
  },
  {
    id: 'beta',
    name: 'Beta Release',
    status: 'upcoming',
    description: 'Platform stability and feature enhancements',
    date: 'Q1 2025',
    features: [
      { name: 'Mobile app beta', completed: false },
      { name: 'Advanced trading features', completed: false },
      { name: 'Enhanced marketplace analytics', completed: false },
      { name: 'Real-time race integration', completed: true },
      { name: 'Community events system', completed: false },
      { name: 'Collection analytics dashboard', completed: false },
    ]
  },
  {
    id: 'launch',
    name: 'Full Launch',
    status: 'upcoming',
    description: 'Complete platform release with advanced features',
    date: 'Q2 2025',
    features: [
      { name: 'Cross-platform mobile app', completed: false },
      { name: 'Tournament system', completed: false },
      { name: 'Premium membership tiers', completed: false },
      { name: 'Advanced collection tools', completed: false },
      { name: 'Live event integration', completed: false },
      { name: 'Global leaderboards', completed: false },
    ]
  },
  {
    id: 'future',
    name: 'Future Updates',
    status: 'planned',
    description: 'Planned expansions and enhancements',
    date: 'Q3-Q4 2025',
    features: [
      { name: 'AR card viewing experience', completed: false },
      { name: 'Team partnerships & exclusive content', completed: false },
      { name: 'Advanced trading mechanics', completed: false },
      { name: 'NFT integration options', completed: false },
      { name: 'International event expansions', completed: false },
      { name: 'Community governance features', completed: false },
    ]
  }
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-blue-600/20 to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm text-white/80">Currently in Alpha</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              PitDeck Development Roadmap
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Track our journey from alpha to full release. See what features are coming
              and help shape the future of PitDeck.
            </p>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
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
                      w-16 h-16 rounded-xl flex items-center justify-center
                      ${phase.status === 'current' ? 'bg-yellow-500' : 
                        phase.status === 'completed' ? 'bg-green-500' : 'bg-white/10'}
                    `}>
                      {phase.status === 'current' ? (
                        <Sparkles className="h-8 w-8 text-white" />
                      ) : phase.status === 'completed' ? (
                        <Check className="h-8 w-8 text-white" />
                      ) : (
                        <Clock className="h-8 w-8 text-white/70" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{phase.name}</h2>
                      <p className="text-gray-400">{phase.date}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-400">{phase.description}</p>
                </div>

                {/* Features Grid */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {phase.features.map((feature) => (
                    <div
                      key={feature.name}
                      className="relative group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center
                          ${feature.completed ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/70'}
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="relative px-8 py-12">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold text-white">Help Shape Our Future</h2>
              <p className="text-lg text-gray-300">
                Join our community and provide feedback to influence the development of PitDeck.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/discord"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full bg-white text-blue-600 hover:bg-gray-100 transition-colors"
                >
                  Join Discord Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/feedback"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
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