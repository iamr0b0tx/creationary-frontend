'use client';

import { logger } from '@/lib/clientLogger';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    const errorMessage = `Error: ${error.message}\nStack: ${error.stack}\nDigest: ${error.digest}`;
    // I should add a toast here but it was setup in a different branch so I will do that later
    logger.error(errorMessage);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border border-red-200 bg-white p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
      <p className="text-gray-700">{error.message}</p>
      <button
        onClick={() => reset()}
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Try again
      </button>
      </div>
    </div>
  );
}