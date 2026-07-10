import type { Permission } from '@rajmohancoder/types';

export type Theme = 'light' | 'dark';

export type Locale = 'en-US' | 'es-ES' | 'fr-FR';

export interface ShellContextValue {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  roles: string[];
  permissions: Permission[];
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  tenant: {
    id: string;
    name: string;
    plan: string;
  };
  featureFlags: Record<string, boolean>;
  theme: Theme;
  locale: Locale;
  apiBaseUrl: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
}

export interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  requiredPermission?: Permission;
  children?: NavigationItem[];
}

export interface RemoteApp {
  name: string;
  displayName: string;
  routePath: string;
  modulePath: string;
  requiredPermission?: Permission;
  navOrder: number;
}
