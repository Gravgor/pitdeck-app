'use client';

import { SessionProvider } from 'next-auth/react';
import { UserProvider } from './UserProvider';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchInterval: 1000 * 30, // 30 seconds
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <UserProvider>
          {children}
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