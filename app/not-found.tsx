import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 text-slate-900">
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-600 mb-6">The requested resource could not be found.</p>
      <Link
        href="/"
        className="px-4 py-2 rounded-xl bg-[#0084FF] text-white text-xs font-semibold hover:bg-[#0070DD] transition-colors"
      >
        Return to Voice Studio
      </Link>
    </div>
  );
}
