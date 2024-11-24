import { ProfileActions } from '@/components/profile/ProfileActions';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserByUsername } from "@/lib/user";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { ChevronRight, ArrowRightLeft, Package, Trophy, Pencil } from 'lucide-react';
import { CardGrid } from '@/components/cards/CardGrid';
import { ResolvingMetadata, Metadata } from 'next';
import ProfileNotFound from './not-found';
import { FollowButton } from '@/components/profile/FollowButton';
import { prisma } from "@/lib/prisma";
import { getRecentActivities } from '@/lib/activity';
import { ActivityFeed } from '@/components/profile/ActivityFeed';
import { LevelProgress } from '@/components/profile/LevelProgress';
import Image from 'next/image';
import { cleanNickname } from '@/lib/utils';
import { UserAvatar } from '@/components/ui/UserAvatar';

interface ProfilePageProps {
    params: Promise<{ 
      slug: string;
    }>;
}
  

// Mock activity data
const recentActivity = [
  {
    id: 1,
    type: 'trade',
    description: 'Traded McLaren MCL38 for Red Bull RB19',
    timestamp: '2h ago',
    icon: ArrowRightLeft,
  },
  {
    id: 2,
    type: 'pack',
    description: 'Opened Legendary Pack',
    timestamp: '5h ago',
    icon: Package,
  },
  {
    id: 3,
    type: 'achievement',
    description: 'Completed "First Trade" quest',
    timestamp: '1d ago',
    icon: Trophy,
  },
];

export async function generateMetadata(
  { params }: ProfilePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Get user data
  const { slug } = await params;
  const user = await getUserByUsername(slug);
  
  if (!user) {
    return {
      title: 'Profile Not Found | PitDeck',
      description: 'This profile could not be found on PitDeck.',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const cleanName = cleanNickname(user.name || '');

  return {
      title: `${cleanName}'s Profile | PitDeck`,
    description: `Check out ${cleanName}'s racing card collection on PitDeck. View their cards, trades, and achievements.`,
    openGraph: {
      title: `${cleanName}'s Racing Card Collection`,
      description: `Explore ${cleanName}'s collection of ${user._count.cards} racing cards, including trades and achievements.`,
      images: [user.image || '', ...previousImages],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cleanName}'s Racing Card Collection | PitDeck`,
      description: `Explore ${cleanName}'s collection of ${user._count.cards} racing cards, including trades and achievements.`,
      images: [user.image || '', ...previousImages],
    },
    alternates: {
      canonical: `/profile/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
      other: {
        'facebook-domain-verification': 'your-facebook-verification-code',
      },
    },
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  const { slug } = await params;
  const profileUser = await getUserByUsername(slug);

  if (!profileUser) {
    return <ProfileNotFound />;
  }

  const isOwner = session?.user?.id === profileUser.id;
  const displayCards = profileUser.cards.slice(0, 10);

  // Check if current user is following this profile
  const isFollowing = session?.user ? await prisma.user.findFirst({
    where: {
      id: session.user.id,
      following: {
        some: {
          id: profileUser.id
        }
      }
    }
  }) : null;

  // Get follower counts
  const followData = await prisma.user.findUnique({
    where: { id: profileUser.id },
    select: {
      _count: {
        select: {
          followers: true,
          following: true
        }
      }
    }
  });

  const activities = await getRecentActivities(profileUser.id);
  const cleanName = cleanNickname(profileUser.name || '');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-6 shadow-xl border border-red-500/10">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
         {profileUser.image?.trim() ? (
          <div className="relative w-24 h-24">
            <Image
              src={profileUser.image}
              alt={`${profileUser.name}'s profile`}
              fill
              className="rounded-full object-cover ring-2 ring-white/20"
            />
          </div>
         ) : (
          <UserAvatar name={profileUser.name} size={96} />
         )}

<div className="flex-grow">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                {cleanName}
              </h1>
              {profileUser.role === 'PITDECK_TEAM' && (
                <span className="px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-500 rounded-full border border-red-500/20">
                  PitDeck Team
                </span>
              )}
            </div>
            <p className="text-gray-400">@{profileUser.name}</p>
            <p className="text-gray-400 mt-2 text-sm">
              {'Racing enthusiast, F1 fan, and avid collector.'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href={`/profile/${profileUser.name}/followers`} className="hover:text-white">
                <span className="font-bold text-white">{followData?._count.followers}</span> followers
              </Link>
              <Link href={`/profile/${profileUser.name}/following`} className="hover:text-white">
                <span className="font-bold text-white">{followData?._count.following}</span> following
              </Link>
            </div>

            {!isOwner && session?.user && (
              <FollowButton 
                userId={profileUser.id} 
                initialIsFollowing={!!isFollowing}
              />
            )}
          </div>
        </div>

        {isOwner && (
          <div className="mt-4">
            <Link
              href="/settings/profile"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Link>
          </div>
        )}

        {/* Stats Overview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Cards', value: profileUser._count.cards },
            { label: 'Trades', value: profileUser._count.sentTrades + profileUser._count.receivedTrades },
            { label: 'Packs Opened', value: profileUser._count.packsPurchased },
            { label: 'Coins', value: profileUser.coins.toLocaleString() }
          ].map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-red-500/10 hover:border-red-500/20 transition-colors">
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Collection Preview */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Collection Preview</h2>
            <Link 
              href={`/collection/${cleanName}`}
              className="flex items-center gap-1 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="bg-black/50 rounded-xl p-6 border border-red-500/10">
            <CardGrid cards={displayCards} />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
         <ActivityFeed activities={activities} />
        </section>

        {/* Level Progress */}
        <section className="mt-8">
          <LevelProgress xp={profileUser.totalXp} />
        </section>
      </div>
    </div>
  );
}