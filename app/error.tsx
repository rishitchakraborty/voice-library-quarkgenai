'use client';

import { useEffect } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Studio Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 text-slate-900">
      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 border border-amber-200">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold mb-2">Studio encountered a temporary error</h2>
      <p className="text-xs text-slate-600 mb-5 max-w-md">
        {error?.message || 'An unexpected error occurred while loading the studio components.'}
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0084FF] text-white text-xs font-semibold hover:bg-[#0070DD] transition-colors shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try again</span>
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
        >
          Reload Studio
        </button>
      </div>
    </div>
  );
}
