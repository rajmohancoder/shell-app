// Registry of all remote micro-frontends consumed by the shell.
// Each entry declares the route prefix, display name, module path,
// optional required permission, and nav ordering for the sidebar.
import type { RemoteApp } from '@/types';

export const remoteApps: RemoteApp[] = [
  {
    name: 'customer',
    displayName: 'Customer Management',
    routePath: '/customers/*',
    modulePath: './CustomerApp',
    // TEMPORARY: Permission check disabled for integration testing.
    // Required permission 'customer:view' is commented out so that
    // the Customer Management MFE can be loaded without authorization.
    // Re-enable by uncommenting the line below before deploying to production.
    // requiredPermission: 'customer:view',
    navOrder: 1,
  },
  {
    name: 'orders',
    displayName: 'Orders',
    routePath: '/orders/*',
    modulePath: './OrdersApp',
    requiredPermission: 'order:view',
    navOrder: 2,
  },
  {
    name: 'analytics',
    displayName: 'Analytics',
    routePath: '/analytics/*',
    modulePath: './AnalyticsApp',
    navOrder: 3,
  },
  {
    name: 'admin',
    displayName: 'Administration',
    routePath: '/admin/*',
    modulePath: './AdminApp',
    requiredPermission: 'admin:users',
    navOrder: 4,
  },
];

export function getRemoteUrl(remoteName: string): string {
  const envVar = `VITE_${remoteName.toUpperCase()}_REMOTE`;
  const url = (import.meta as Record<string, any>).env[envVar] as string | undefined;
  return url ?? `http://localhost:3000/${remoteName}`;
}
