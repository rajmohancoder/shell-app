// Lazy-loads remote micro-frontend components via Module Federation imports.
// Caches the lazy components so each remote is loaded only once.
import { lazy, type ComponentType } from 'react';

type RemoteImport = () => Promise<{ default: ComponentType<any> }>;

const remoteImports: Record<string, RemoteImport> = {
  // @ts-ignore - Module Federation remote import, resolved at build time
  customer: () => import('customer/CustomerApp'),
  // @ts-ignore - Module Federation remote import, resolved at build time
  orders: () => import('orders/OrdersApp'),
  // @ts-ignore - Module Federation remote import, resolved at build time
  analytics: () => import('analytics/AnalyticsApp'),
  // @ts-ignore - Module Federation remote import, resolved at build time
  admin: () => import('admin/AdminApp'),
};

const remoteComponentsCache = new Map<string, ReturnType<typeof lazy>>();

export function getRemoteComponent(remoteName: string): React.LazyExoticComponent<ComponentType<any>> {
  const cached = remoteComponentsCache.get(remoteName);
  if (cached) return cached;

  const importFn = remoteImports[remoteName];
  if (!importFn) {
    throw new Error(`Unknown remote: "${remoteName}". Available: ${Object.keys(remoteImports).join(', ')}`);
  }

  const LazyComponent = lazy(importFn);
  remoteComponentsCache.set(remoteName, LazyComponent);
  return LazyComponent;
}

export function isRemoteDefined(remoteName: string): boolean {
  return remoteName in remoteImports;
}
