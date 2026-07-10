import { useShell } from '@/hooks';

export function Dashboard() {
  const { user, roles, permissions, tenant, featureFlags } = useShell();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-shell-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">User</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-gray-900">{user?.name ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-900">{user?.email ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Roles</dt>
              <dd className="font-medium text-gray-900">{roles.join(', ') || '—'}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-lg border border-shell-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Tenant</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-gray-900">{tenant.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Plan</dt>
              <dd className="font-medium text-gray-900">{tenant.plan}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-lg border border-shell-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Permissions</h2>
          <ul className="space-y-1 text-sm">
            {permissions.length > 0 ? (
              permissions.map((p) => (
                <li key={p} className="text-gray-700">{p}</li>
              ))
            ) : (
              <li className="text-gray-400">No permissions assigned</li>
            )}
          </ul>
        </div>
        <div className="rounded-lg border border-shell-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Feature Flags</h2>
          <ul className="space-y-1 text-sm">
            {Object.entries(featureFlags).map(([key, enabled]) => (
              <li key={key} className="flex items-center justify-between">
                <span className="text-gray-700">{key}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                }`}>
                  {enabled ? 'ON' : 'OFF'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
