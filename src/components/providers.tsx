'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { GlobalModelProvider } from '@/features/navigation/hooks';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <GlobalModelProvider>
        {children}
        <Toaster />
      </GlobalModelProvider>
    </ThemeProvider>
  );
}
