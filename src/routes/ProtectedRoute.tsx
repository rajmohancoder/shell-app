import { Navigate } from 'react-router-dom';
import { useShell } from '@/hooks';
import type { Permission } from '@rajmohancoder/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requiredPermissions,
  fallbackPath = '/unauthorized',
}: ProtectedRouteProps) {
  const { isAuthenticated, isAuthLoading, permissions } = useShell();

  if (isAuthLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every((p) =>
      permissions.includes(p),
    );
    if (!hasAllPermissions) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  return <>{children}</>;
}
