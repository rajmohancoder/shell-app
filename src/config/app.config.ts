import { environment } from './environment';

export const appConfig = {
  appName: 'Enterprise Platform',
  version: '0.1.0',
  apiUrl: environment.apiUrl,
  auth: {
    tenantId: 'mock-tenant-id',
    clientId: 'mock-client-id',
    redirectUri: window.location.origin,
    cacheLocation: 'sessionStorage' as const,
  },
  navigation: {
    sidebarWidth: 256,
    headerHeight: 64,
  },
} as const;
