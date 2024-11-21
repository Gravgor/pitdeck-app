import { MapView } from '@/components/map/MapView';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Drop Map | PitDeck',
  description: 'Find and collect PitDeck drops near you.',
};

export default async function MapPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const drops = await prisma.drop.findMany({
    where: {
      expiresAt: {
        gt: new Date(),
      },
      isActive: true,
    },
    include: {
      rewards: true,
    },
  });

  return (
    <div className="min-h-screen bg-[#0A0C10]">
      <MapView drops={drops} isPremium={true} />
    </div>
  );
} 