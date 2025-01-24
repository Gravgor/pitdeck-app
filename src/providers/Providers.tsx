'use client';

import { SessionProvider } from 'next-auth/react';
import { UserProvider } from './UserProvider';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchInterval: 1000 * 30, // 30 seconds
      retry: 1,
    },
  },
});

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? 'phc_SxHgEQIYfIEuxVHdSfWyfd38wUCTWGk0gLZGOwrVNDY', {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST as string,
    person_profiles: 'always',
  })
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <UserProvider>
          <PostHogProvider client={posthog}>
            {children}
          </PostHogProvider>
          <Toaster 
            theme="dark" 
            position="top-right"
            expand
            richColors
            closeButton
          />
        </UserProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
} 