export default function StatCard({
    label,
    value,
    accent = false,
  }: {
    label: string;
    value: string | number;
    accent?: boolean;
  }) {
    return (
      <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
        <div className="text-[11px] font-mono uppercase tracking-widest text-dispatch-dim mb-1.5">
          {label}
        </div>
        <div className={`text-2xl font-bold ${accent ? 'text-dispatch-accent' : 'text-dispatch-text'}`}>
          {value}
        </div>
      </div>
    );
  }