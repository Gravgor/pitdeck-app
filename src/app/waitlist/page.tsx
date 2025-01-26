import { Metadata } from 'next';
import Image from 'next/image';
import { Sparkles, Rocket, ArrowRight } from 'lucide-react';
import { WaitlistForm } from '@/components/waitlist/WaitlistForm';

export const metadata: Metadata = {
  title: 'Join PitDeck Waitlist | F1 Cards & Motorsport Collection Game',
  description: 'Be the first to experience PitDeck - the ultimate F1 cards and motorsport digital collection game. Join our waitlist for early access and exclusive rewards.',
  keywords: [
    'F1 cards waitlist',
    'motorsport cards app',
    'racing collection game',
    'digital cards beta',
    'F1 collectibles platform',
    'motorsport trading app'
  ],
  openGraph: {
    title: 'Join PitDeck Mobile Waitlist',
    description: 'Get early access to the ultimate motorsport cards collection game',
    images: ['/og/waitlist.jpg']
  }
};

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-blue-600/30 to-transparent animate-gradient" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        {/* Kickstarter Banner */}
        <div className="mb-16 relative overflow-hidden rounded-2xl border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#05CE78]/20 via-[#1ED760]/20 to-transparent" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          
          <div className="relative px-6 py-8 sm:px-8 sm:py-12">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#05CE78]/20 bg-[#05CE78]/10 backdrop-blur-sm">
                  <Rocket className="h-4 w-4 text-[#05CE78] mr-2" />
                  <span className="text-sm text-white/80">Launch is available on Kickstarter</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Back Our Project <span className="text-[#05CE78]">Early</span>
                </h2>
                
                <p className="text-gray-400">
                  Get exclusive rewards, limited edition packs, and lifetime benefits by supporting our Kickstarter campaign.
                </p>

                <a 
                  href="https://www.kickstarter.com/projects/marceli-pitdeck/pitdeck-explore-the-world-and-collect-motorsport-legends?ref=biadml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-2.5 rounded-lg bg-[#05CE78] hover:bg-[#04b76b] text-white font-medium transition-colors"
                >
                  Visit Kickstarter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>

              <div className="relative w-full sm:w-64 h-32">
                <Image
                  src="/campaign.png"
                  alt="PitDeck Kickstarter Preview"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm text-white/80">Early Access</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                Join the Ultimate
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
                Motorsport Cards Platform
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 leading-relaxed">
              Be among the first to experience the future of motorsport card collecting. 
              From F1 to Formula E, collect and trade digital cards from every major racing series.
            </p>

            <div className="flex flex-wrap gap-3">
              {["F1 Cards", "F2 Cards", "F3 Cards", "WEC Cards", "IndyCar Cards", "Formula E Cards"].map((series) => (
                <div key={series} className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                  <span className="text-sm text-white/80">{series}</span>
                </div>
              ))}
            </div>

            <WaitlistForm />
          </div>

          {/* Right Content - Phone Preview */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-3xl blur-xl opacity-10 animate-pulse" />
            <div className="relative aspect-[9/19.5] max-w-[280px] mx-auto">
              <div className="absolute inset-0 bg-black rounded-[2.5rem] p-3 shadow-2xl">
                <div className="relative h-full w-full bg-[#0A0C10] rounded-[2rem] overflow-hidden">
                  <Image
                    src="/screenshots/collection.png"
                    alt="PitDeck Mobile App Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 