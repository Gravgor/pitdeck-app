'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pack } from '@prisma/client';
import { useUser } from '@/providers/UserProvider';
import { PackOpeningModal } from './PackOpeningModal';
import { Package, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';


interface PackStoreProps {
  packs: Pack[];
  isLoading?: boolean;
}

export function PackStore({ packs, isLoading = false }: PackStoreProps) {
  const router = useRouter();
  const { user } = useUser();
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenPack = async (pack: Pack) => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    setSelectedPack(pack);
    setIsOpening(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-white/80">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-lg">Loading packs...</p>
      </div>
    );
  }

  if (!packs || packs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-white/5 rounded-xl border border-white/10">
        <div className="bg-white/10 rounded-full p-4 mb-4">
          <Package className="h-8 w-8 text-white/80" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No Packs Available</h3>
        <p className="text-white/60 text-center max-w-md mb-6">
          There are currently no card packs available in the store. Please check back later!
        </p>
        <div className="flex items-center gap-2 text-sm text-white/60 bg-white/5 px-4 py-2 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span>New packs are released regularly</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User's Balance */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 rounded-full p-2">
            <Package className="h-5 w-5 text-white/80" />
          </div>
          <div>
            <p className="text-sm text-white/60">Your Balance</p>
            <p className="text-lg font-medium text-white">
              {user ? `${user.coins?.toLocaleString() ?? 0} Coins` : 'Sign in to view balance'}
            </p>
          </div>
        </div>
        {!user && (
          <button
            onClick={() => router.push('/auth/signin')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packs.map((pack) => (
          <div
            key={pack.id}
            className="bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:transform hover:scale-[1.02]"
          >
            <div className="aspect-[2/1] relative overflow-hidden">
              <Image
                loading="lazy"
                placeholder="blur"
                src={pack.imageUrl}
                alt={pack.name}
                className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                  pack.type === 'LEGENDARY' ? 'bg-yellow-500' :
                  pack.type === 'PREMIUM' ? 'bg-purple-500' :
                  'bg-blue-500'
                }`}>
                  {pack.type}
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">{pack.name}</h3>
              <p className="text-gray-400 text-sm">{pack.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">
                    {pack.price.toLocaleString()}
                  </span>
                  <span className="text-white/60">Coins</span>
                </div>
                <button
                  onClick={() => handleOpenPack(pack)}
                  // @ts-ignore
                  disabled={!user || (user.coins && user.coins < pack.price)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {!user ? 'Sign In' :
                   user.coins && user.coins < pack.price ? 'Insufficient Funds' :
                   'Open Pack'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPack && (
        <PackOpeningModal
          pack={selectedPack}
          isOpen={isOpening}
          onClose={() => {
            setIsOpening(false);
            setSelectedPack(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}