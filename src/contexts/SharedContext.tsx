import { createContext, useContext, useMemo, useCallback, useState, type ReactNode } from 'react';
import { useAuth } from '@rajmohancoder/auth-sdk';
import type { ShellContextValue, Theme, Locale } from '@/types';
import { environment } from '@/config/environment';

const mockTenant = {
  id: 'tenant-001',
  name: 'Acme Corporation',
  plan: 'enterprise',
};

const mockFeatureFlags: Record<string, boolean> = {
  'customer-management': true,
  'order-management': true,
  'analytics': true,
  'admin-panel': true,
  'new-checkout': false,
};

const SharedContext = createContext<ShellContextValue | null>(null);

export function SharedProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [theme, setThemeState] = useState<Theme>('light');
  const [locale, setLocaleState] = useState<Locale>('en-US');

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const value = useMemo<ShellContextValue>(() => ({
    user: auth.user
      ? { id: auth.user.id, name: auth.user.name, email: auth.user.email }
      : null,
    roles: auth.roles,
    permissions: auth.permissions,
    isAuthenticated: auth.status === 'authenticated',
    isAuthLoading: auth.status === 'loading',
    tenant: mockTenant,
    featureFlags: mockFeatureFlags,
    theme,
    locale,
    apiBaseUrl: environment.apiUrl,
    login: auth.login,
    logout: auth.logout,
    setTheme,
    setLocale,
  }), [auth, theme, locale, setTheme, setLocale]);

  return (
    <SharedContext.Provider value={value}>
      {children}
    </SharedContext.Provider>
  );
}

export function useShell(): ShellContextValue {
  const ctx = useContext(SharedContext);
  if (!ctx) {
    throw new Error('useShell must be used within a SharedProvider');
  }
  return ctx;
}
