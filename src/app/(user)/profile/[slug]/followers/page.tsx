import { getUserByUsername } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { FollowButton } from "@/components/profile/FollowButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Users } from "lucide-react";

export default async function FollowersPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  const { slug } = await params;
  const profileUser = await getUserByUsername(slug);

  if (!profileUser) {
    return null;
  }

  const followers = await prisma.user.findUnique({
    where: { id: profileUser.id },
    select: {
      followers: {
        select: {
          id: true,
          name: true,
          image: true,
          _count: {
            select: {
              followers: true,
              cards: true
            }
          }
        }
      }
    }
  });

  if (!followers?.followers.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">
          People following {profileUser.name}
        </h1>
        
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="p-4 bg-gray-800/50 rounded-full mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No Followers Yet</h2>
          <p className="text-gray-400 text-center max-w-md">
            {profileUser.name} doesn't have any followers yet. Be the first to follow and stay updated with their collection!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">
        People following {profileUser.name}
      </h1>

      <div className="space-y-4">
        {followers.followers.map((follower) => (
          <div 
            key={follower.id}
            className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <Image
                src={follower.image || '/default-avatar.png'}
                alt={follower.name || 'User'}
                width={48}
                height={48}
                className="rounded-full ring-2 ring-red-500/20"
              />
              <div>
                <Link 
                  href={`/profile/${follower.name}`}
                  className="font-medium text-white hover:text-red-400 transition-colors"
                >
                  {follower.name}
                </Link>
                <div className="text-sm text-gray-400">
                  {follower._count.cards} cards · {follower._count.followers} followers
                </div>
              </div>
            </div>

            {session?.user?.id !== follower.id && (
              <FollowButton
                userId={follower.id}
                initialIsFollowing={false}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 