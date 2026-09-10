'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Suppress error logging in client console
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 text-slate-900">
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-sm text-slate-600 mb-6">An unexpected error occurred while loading the studio.</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 rounded-xl bg-[#0084FF] text-white text-xs font-semibold hover:bg-[#0070DD] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
