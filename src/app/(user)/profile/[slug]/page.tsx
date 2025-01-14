import { ProfileActions } from '@/components/profile/ProfileActions';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserByUsername } from "@/lib/user";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { ChevronRight, ArrowRightLeft, Package, Trophy, Pencil, Wallet, Car, Settings } from 'lucide-react';
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
import { ProfileStats } from '@/components/profile/ProfileStats';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  const stats = {
    xp: profileUser.totalXp,
    totalCards: profileUser._count.cards,
    trades: profileUser._count.sentTrades + profileUser._count.receivedTrades,
    packsOpened: profileUser._count.packsPurchased,
    coins: profileUser.coins
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-4 sm:p-6 shadow-xl border border-red-500/10">
        <div className="flex flex-col gap-6">
          {/* Profile Header - Redesigned for better mobile */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            {/* Profile Image - Centered on mobile */}
            <div className="flex justify-center sm:justify-start">
              {profileUser.image?.trim() ? (
                <div className="relative w-24 h-24 sm:w-24 sm:h-24">
                  <Image
                    src={profileUser.image}
                    alt={`${profileUser.name}'s profile`}
                    fill
                    className="rounded-full object-cover ring-2 ring-white/20"
                    priority
                  />
                </div>
              ) : (
                <UserAvatar name={profileUser.name} size={96} />
              )}
            </div>

            {/* User Info - Centered on mobile */}
            <div className="flex-grow text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start gap-2">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    {cleanName}
                  </h1>
                  {profileUser.role === 'PITDECK_TEAM' && (
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-500 rounded-full border border-red-500/20">
                    PitDeck Team
                  </span>
                  )}
                </div>
                <p className="text-gray-400">@{profileUser.name}</p>
                <p className="text-gray-400 mt-1 text-sm max-w-md">
                  {profileUser.bio || 'No bio yet.'}
                </p>
              </div>
            </div>
          </div>

          {/* Followers and Actions */}
          <div className="border-t border-b border-gray-800/60 py-4">
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6">
              {/* Followers/Following - Full width on mobile */}
              <div className="flex items-center justify-center w-full sm:w-auto gap-8 sm:gap-6">
                <Link 
                  href={`/profile/${profileUser.name}/followers`} 
                  className="flex flex-col items-center hover:bg-white/5 px-4 py-2 rounded-lg transition-colors"
                >
                  <span className="text-xl font-bold text-white">{followData?._count.followers}</span>
                  <span className="text-sm text-gray-400">Followers</span>
                </Link>
                <div className="h-8 w-px bg-gray-800/60" />
                <Link 
                  href={`/profile/${profileUser.name}/following`} 
                  className="flex flex-col items-center hover:bg-white/5 px-4 py-2 rounded-lg transition-colors"
                >
                  <span className="text-xl font-bold text-white">{followData?._count.following}</span>
                  <span className="text-sm text-gray-400">Following</span>
                </Link>
              </div>

              {/* Action Buttons - Centered on mobile */}
              <div className="flex justify-center w-full sm:w-auto gap-3">
                {!isOwner && session?.user && (
                  <FollowButton 
                    userId={profileUser.id} 
                    initialIsFollowing={!!isFollowing}
                  />
                )}
                
                {isOwner && (
                  <Link href="/settings/profile" className="w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full flex items-center justify-center gap-2 text-sm bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
                    >
                      <Settings className="w-4 h-4" />
                      Customize Profile
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <ProfileStats stats={stats} />

          {/* Collection Preview */}
          <section className="mt-8 sm:mt-12">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Collection Preview</h2>
              <Link 
                href={`/collection/${cleanName}`}
                className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-black/50 rounded-xl p-3 sm:p-6 border border-red-500/10">
              <CardGrid cards={displayCards} isOwner={isOwner} />
            </div>
          </section>

          {/* Recent Activity */}
          <section className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Recent Activity</h2>
            <ActivityFeed activities={activities} />
          </section>
        </div>
      </div>
    </div>
  );
}