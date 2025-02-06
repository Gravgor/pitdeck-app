import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import Image from 'next/image';
import { Sparkles, Rocket, ArrowRight } from 'lucide-react';
import { WaitlistForm } from '@/components/waitlist/WaitlistForm';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Join Early Access | PitDeck Mobile',
  description: 'Join the PitDeck Mobile early access program and get exclusive rewards.',
};

export default async function WaitlistPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-blue-600/30 to-transparent animate-gradient" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                Join PitDeck Mobile
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-purple-500">
                Early Access Program
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Follow these steps to get exclusive early access to PitDeck Mobile
            </p>
          </div>

          <WaitlistForm session={session} />
        </div>
      </div>
    </div>
  );
} 