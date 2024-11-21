import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useUserData() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['userData', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const response = await fetch(`/api/users/${session.user.id}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      return response.json();
    },
    enabled: !!session?.user?.id,
  });
} 