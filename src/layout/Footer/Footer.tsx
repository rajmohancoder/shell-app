import { appConfig } from '@/config/app.config';

export function Footer() {
  return (
    <footer className="flex h-12 items-center justify-between border-t border-shell-border bg-white px-6">
      <p className="text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Enterprise Platform. All rights reserved.
      </p>
      <p className="text-xs text-gray-400">v{appConfig.version}</p>
    </footer>
  );
}
