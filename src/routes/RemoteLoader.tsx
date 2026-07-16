// React component that lazy-loads and renders a remote micro-frontend.
// Shows a spinner while loading, an "unavailable" placeholder if the
// remote isn't defined, and catches errors via ModuleErrorBoundary.
import { Suspense } from 'react';
import { ModuleErrorBoundary } from '@/components/ErrorBoundary';
import { getRemoteComponent, isRemoteDefined } from '@/federation/remoteLoader';

interface RemoteLoaderProps {
  remoteName: string;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

function LoadingFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-sm text-gray-500">Loading module...</p>
      </div>
    </div>
  );
}

function RemoteUnavailable({ remoteName }: { remoteName: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <p className="text-sm font-medium text-gray-700">
        Module <strong>{remoteName}</strong> is not available
      </p>
      <p className="mt-1 text-xs text-gray-500">
        This remote application will be available once deployed.
      </p>
    </div>
  );
}

export function RemoteLoader({ remoteName, fallback, errorFallback }: RemoteLoaderProps) {
  if (!isRemoteDefined(remoteName)) {
    return <RemoteUnavailable remoteName={remoteName} />;
  }

  const RemoteComponent = getRemoteComponent(remoteName);

  return (
    <ModuleErrorBoundary moduleName={remoteName} fallback={errorFallback}>
      <Suspense fallback={fallback ?? <LoadingFallback />}>
        <RemoteComponent />
      </Suspense>
    </ModuleErrorBoundary>
  );
}
