import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RemoteLoader } from './RemoteLoader';
import { Dashboard, NotFound, Unauthorized } from '@/pages';
import { remoteApps } from '@/federation/remotes';
import type { Permission } from '@rajmohancoder/types';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {remoteApps.map((remote) =>
          remote.name === 'customer' ? (
            // TEMPORARY: Bypass all auth checks for Customer MFE integration testing.
            // The ProtectedRoute wrapper is omitted so that the Customer Management
            // Micro Frontend loads without authentication or authorization.
            // Revert by deleting this branch and keeping the standard ProtectedRoute path.
            <Route
              key={remote.name}
              path={remote.routePath}
              element={<RemoteLoader remoteName={remote.name} />}
            />
          ) : (
            <Route
              key={remote.name}
              path={remote.routePath}
              element={
                <ProtectedRoute
                  requiredPermissions={
                    remote.requiredPermission
                      ? [remote.requiredPermission as Permission]
                      : undefined
                  }
                >
                  <RemoteLoader remoteName={remote.name} />
                </ProtectedRoute>
              }
            />
          ),
        )}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
