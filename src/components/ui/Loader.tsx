"use client";

export default function Loader() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-600" />
        Loading...
      </div>
    </div>
  );
}
