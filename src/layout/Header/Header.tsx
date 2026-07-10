import { useShell } from '@/hooks';

export function Header() {
  const { user, isAuthenticated, login, logout, isAuthLoading } = useShell();

  return (
    <header className="flex h-16 items-center justify-between border-b border-shell-border bg-shell-header px-6">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-gray-900">Enterprise Platform</span>
      </div>
      <div className="flex items-center gap-4">
        {isAuthLoading ? (
          <span className="text-sm text-gray-400">Loading...</span>
        ) : isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="rounded-md px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
