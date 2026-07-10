import type { ReactNode } from 'react';
import { MsalAuthProvider } from '@rajmohancoder/auth-sdk';
import { msalConfig } from '@/auth/authConfig';
import { SharedProvider } from '@/contexts/SharedContext';
import { GlobalErrorBoundary } from '@/components/ErrorBoundary';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <GlobalErrorBoundary>
      <MsalAuthProvider {...msalConfig}>
        <SharedProvider>
          {children}
        </SharedProvider>
      </MsalAuthProvider>
    </GlobalErrorBoundary>
  );
}
