interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>
        {icon && <div className="rounded-2xl bg-slate-50 p-3 text-slate-400">{icon}</div>}
      </div>
    </div>
  );
}

export default StatsCard;
