import type { GrowthPoint } from '../../lib/adminApi';

export default function GrowthChart({ data }: { data: GrowthPoint[] }) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.newUsers), 1);
  const barWidth = 100 / data.length;

  return (
    <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
      <div className="text-[11px] font-mono uppercase tracking-widest text-dispatch-dim mb-3">
        New users, last {data.length} days
      </div>
      <svg viewBox="0 0 100 40" className="w-full h-32" preserveAspectRatio="none">
        {data.map((d, i) => {
          const height = (d.newUsers / max) * 36;
          return (
            <rect
              key={d.date}
              x={i * barWidth + barWidth * 0.15}
              y={40 - height}
              width={barWidth * 0.7}
              height={height}
              className="fill-dispatch-accent"
              opacity={0.85}
            >
              <title>{`${d.date}: ${d.newUsers} new users`}</title>
            </rect>
          );
        })}
      </svg>
    </div>
  );
}