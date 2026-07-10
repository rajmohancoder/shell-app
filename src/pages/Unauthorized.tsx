import { Link } from 'react-router-dom';

export function Unauthorized() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-2 text-6xl font-bold text-gray-300">403</h1>
      <p className="mb-2 text-lg text-gray-600">Access denied</p>
      <p className="mb-6 text-sm text-gray-500">
        You do not have the required permissions to view this page.
      </p>
      <Link
        to="/"
        className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
