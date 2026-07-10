import { NavLink } from 'react-router-dom';
import { useShell } from '@/hooks';
import { remoteApps } from '@/federation/remotes';
import { isPermissionAllowed } from '@/utils';
import type { NavigationItem } from '@/types';

const navItems: NavigationItem[] = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  ...remoteApps.map((r) => ({
    label: r.displayName,
    path: r.routePath.replace('/*', ''),
    icon: getIconForRemote(r.name),
    requiredPermission: r.requiredPermission,
  })),
  { label: 'Unauthorized', path: '/unauthorized', icon: '🔒' },
];

function getIconForRemote(name: string): string {
  const icons: Record<string, string> = {
    customer: '👥',
    orders: '📦',
    analytics: '📈',
    admin: '⚙',
  };
  return icons[name] ?? '📄';
}

export function Sidebar() {
  const { permissions } = useShell();

  return (
    <nav className="flex w-64 flex-col border-r border-shell-border bg-shell-sidebar">
      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          if (!isPermissionAllowed(permissions, item.requiredPermission)) {
            return null;
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
