'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus } from 'lucide-react';
import {toast} from "sonner"

interface FollowButtonProps {
  userId: string;
  initialIsFollowing: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({ userId, initialIsFollowing, onFollowChange }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to follow/unfollow');

      const newFollowState = !isFollowing;
      setIsFollowing(newFollowState);
      onFollowChange?.(newFollowState);
      toast.success(newFollowState ? "You're now following this user" : "You've unfollowed this user")
    } catch (error) {
      toast.error("Failed to update follow status")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      size="sm"
      onClick={handleFollow}
      disabled={isLoading}
      className={`gap-2 ${isFollowing ? 'border-red-500/20 hover:border-red-500/40' : ''}`}
    >
      {isFollowing ? (
        <>
          <UserMinus className="h-4 w-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
} 