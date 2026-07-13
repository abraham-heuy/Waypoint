import { useEffect, useRef, useState } from 'react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
  trendData: number[];
}

const STATS: Stat[] = [
  { value: 42000, suffix: '+', label: 'Routes optimized', trendData: [120, 145, 132, 168, 190, 175, 210, 230, 245, 260, 280, 310] },
  { value: 31, suffix: '%', label: 'Average time saved', trendData: [22, 24, 26, 25, 28, 30, 29, 31, 33, 32, 35, 31], decimals: 1 },
  { value: 900, suffix: '+', label: 'Active drivers', trendData: [400, 450, 480, 520, 580, 620, 680, 730, 780, 820, 860, 900] },
  { value: 4.8, suffix: '/5', label: 'Average rating', trendData: [4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.7, 4.8, 4.8, 4.9, 4.9, 4.8], decimals: 1 },
  { value: 1500, suffix: 'hrs', label: 'Total time saved', trendData: [60, 80, 110, 150, 200, 260, 330, 410, 500, 600, 720, 850] },
  { value: 3.2, suffix: 'k', label: 'Stops per route', trendData: [2.0, 2.2, 2.5, 2.6, 2.8, 3.0, 3.1, 3.2, 3.3, 3.4, 3.2, 3.2], decimals: 1 },
];

function useCountUp(target: number, active: boolean, decimals = 0, durationMs = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, durationMs]);
  return value.toFixed(decimals);
}

const Sparkline = ({
  data,
  active,
  delay,
  color = 'currentColor',
}: {
  data: number[];
  active: boolean;
  delay?: number;
  color?: string;
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 30;

  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * height * 0.8 - height * 0.1,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ');

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [pathD]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-6 sm:h-7 mt-2"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        ref={pathRef}
        d={pathD}
        strokeDasharray={pathLength}
        strokeDashoffset={active ? 0 : pathLength}
        style={{
          transition: `stroke-dashoffset 1s ease-out ${(delay || 0) / 1000}s`,
        }}
      />
    </svg>
  );
};

function StatItem({ stat, active, delay }: { stat: Stat; active: boolean; delay: number }) {
  const display = useCountUp(stat.value, active, stat.decimals ?? 0);

  return (
    <div
      className={`text-center transition-all duration-700 ${
        active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold text-dispatch-accent">
        {Number(display).toLocaleString(undefined, {
          minimumFractionDigits: stat.decimals ?? 0,
          maximumFractionDigits: stat.decimals ?? 0,
        })}
        {stat.suffix}
      </div>
      <div className="text-xs sm:text-sm text-dispatch-dim mt-1">{stat.label}</div>
      <Sparkline
        data={stat.trendData}
        active={active}
        delay={delay + 300}
        color="currentColor"
      />
    </div>
  );
}

export default function AnimatedStats() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-t border-dispatch-line bg-dispatch-panel/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {STATS.map((s, i) => (
            <StatItem key={s.label} stat={s} active={active} delay={i * 100} />
          ))}
        </div>
        <p className="text-center text-[10px] sm:text-xs text-dispatch-dim/40 font-mono mt-6 tracking-wider">
          ↑ trending over the last 12 days
        </p>
      </div>
    </section>
  );
}