import { Card } from '../ui/primitives';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="text-[10px] uppercase tracking-wide text-dispatch-dim mb-1.5">{label}</div>
      <div className="text-xl font-bold font-mono">{value}</div>
      {hint && <div className="text-[11px] text-dispatch-dim mt-1">{hint}</div>}
    </Card>
  );
}
