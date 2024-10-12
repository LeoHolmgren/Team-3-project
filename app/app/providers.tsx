'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './appContext'; 

const queryClient = new QueryClient();

export default function Providers({
  children,
  resetAppState,
}: Readonly<{
  children: React.ReactNode;
  resetAppState?: () => void;  // Pass resetAppState from Home.tsx
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        {resetAppState ? (
          <AppProvider resetAppState={resetAppState}>
            {children}
          </AppProvider>
        ) : (
          children
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
