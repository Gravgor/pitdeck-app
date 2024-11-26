import { MapView } from '@/components/map/MapView';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Drop Map | PitDeck',
  description: 'Find and collect PitDeck drops near you.',
};

export default async function MapPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  async function updateLocation(latitude: number, longitude: number) {
    'use server';
    
    try {
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get('__Secure-next-auth.session-token')?.value;

      const response = await fetch(`${process.env.NEW_BACKEND_URL}/users/location/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      revalidatePath('/map');
    } catch (error) {
      console.error('Error updating location:', error);
    }
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
      <MapView 
        drops={drops} 
        isPremium={true} 
        updateLocation={updateLocation}
      />
    </div>
  );
} 