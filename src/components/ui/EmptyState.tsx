"use client";

export default function EmptyState({
  message = "No data",
  action,
}: {
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/75 p-10 text-center text-slate-500 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-2xl text-cyan-700 shadow-inner">
        •
      </div>
      <div className="mt-4 text-base font-medium text-slate-700">{message}</div>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
