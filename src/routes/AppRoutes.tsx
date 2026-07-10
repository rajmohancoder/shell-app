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
        {remoteApps.map((remote) => (
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
        ))}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
