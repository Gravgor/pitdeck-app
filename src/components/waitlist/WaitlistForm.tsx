'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Check, Download, Apple } from 'lucide-react';

interface WaitlistFormProps {
  session: any;
}

export function WaitlistForm({ session }: WaitlistFormProps) {
  const [hasJoinedDiscord, setHasJoinedDiscord] = useState(false);
  const searchParams = useSearchParams();

  const DISCORD_OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&response_type=code&permissions=0&scope=identify%20guilds.join&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!)}&guild_id=${process.env.NEXT_PUBLIC_DISCORD_GUILD_ID}`;

  useEffect(() => {
    // Check if user has returned from Discord auth
    const code = searchParams.get('code');
    if (code) {
      localStorage.setItem('discord_joined', 'true');
      setHasJoinedDiscord(true);
    } else {
      // Check localStorage for previous Discord join
      const joined = localStorage.getItem('discord_joined') === 'true';
      setHasJoinedDiscord(joined);
    }
  }, [searchParams]);

  return (
    <div className="space-y-8">
      {/* Step 1: Discord Authentication */}
      <div className={`relative p-6 bg-white/5 backdrop-blur-sm rounded-xl border ${!hasJoinedDiscord ? 'border-blue-500/50' : 'border-white/10'}`}>
        <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
          1
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-4">Join Our Discord</h3>
        
        {!hasJoinedDiscord ? (
          <Link
            href={DISCORD_OAUTH_URL}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] transition-colors rounded-lg text-white font-medium"
          >
            <Image
              src="/discord-mark-white.svg"
              alt="Discord"
              width={24}
              height={24}
            />
            Join Discord Server
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-green-500">
            <Check className="w-5 h-5" />
            <span>Successfully joined Discord!</span>
          </div>
        )}
      </div>

      {/* Step 2: TestFlight Access */}
      <div className={`relative p-6 bg-white/5 backdrop-blur-sm rounded-xl border ${hasJoinedDiscord ? 'border-blue-500/50' : 'border-white/10'}`}>
        <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
          2
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-4">Download PitDeck Mobile</h3>
        
        {hasJoinedDiscord ? (
          <div className="space-y-4">
            <p className="text-gray-400">
              You're all set! Click below to download the beta.
            </p>
            
            <Link
              href="https://testflight.apple.com/join/X4pdGYuv"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 transition-colors rounded-lg text-white font-medium"
            >
              <Apple className="w-5 h-5" />
              Download on TestFlight
            </Link>
          </div>
        ) : (
          <div className="text-gray-500">
            Complete step 1 to get access to TestFlight
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="text-center text-sm text-gray-400">
        <p>Need help? Contact us in</p>
        <Link
          href="https://discord.gg/vvDnj2uhWQ"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Discord
        </Link>
      </div>
    </div>
  );
} 