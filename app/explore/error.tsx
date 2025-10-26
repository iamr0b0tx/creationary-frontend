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
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p> {/* Displaying the error message */}
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}