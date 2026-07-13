import { useEffect, useState } from 'react';
import TiltCard from './Tiltcard';

const STEPS = [
  {
    title: 'Tell us your stops',
    body: 'Type them, drop pins on a map, or describe your day to the assistant in plain language.',
  },
  {
    title: 'We solve the order',
    body: 'Real drive times go into an exact or near-exact optimizer, not a straight-line approximation.',
  },
  {
    title: 'You get the route',
    body: 'Turn-by-turn directions, timing per leg, and a rideshare fallback anywhere you need it.',
  },
];

const STEP_DURATION_MS = 4200;

function StepIllustration({ step }: { step: number }) {
  // three tiny animated SVG scenes, keyed by step so the animation restarts on change
  if (step === 0) {
    return (
      <svg viewBox="0 0 300 180" className="w-full h-full">
        {[
          [60, 130],
          [110, 60],
          [170, 100],
          [230, 50],
          [250, 140],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r="5"
              className="fill-dispatch-accent"
              style={{
                opacity: 0,
                animation: `fade-up 0.5s ease ${i * 0.25}s forwards`,
              }}
            />
            <circle
              cx={x}
              cy={y}
              r="10"
              fill="none"
              stroke="#f2a93b"
              strokeWidth="1.5"
              style={{
                opacity: 0,
                animation: `ping-ring 1.2s ease ${i * 0.25 + 0.1}s forwards`,
              }}
            />
          </g>
        ))}
        <style>{`
          @keyframes ping-ring {
            0% { opacity: 0.6; r: 6; }
            100% { opacity: 0; r: 18; }
          }
        `}</style>
      </svg>
    );
  }

  if (step === 1) {
    const cols = 5;
    const rows = 5;
    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({ r, c, delay: (r + c) * 0.06 });
      }
    }
    return (
      <svg viewBox="0 0 300 180" className="w-full h-full">
        {cells.map(({ r, c, delay }, i) => (
          <rect
            key={i}
            x={40 + c * 44}
            y={20 + r * 28}
            width="38"
            height="22"
            rx="3"
            className="fill-dispatch-panel2 stroke-dispatch-line"
            style={{
              opacity: 0,
              animation: `fade-up 0.4s ease ${delay}s forwards`,
            }}
          />
        ))}
        {cells
          .filter(({ r, c }) => r === c)
          .map(({ r, c, delay }, i) => (
            <rect
              key={`hl-${i}`}
              x={40 + c * 44}
              y={20 + r * 28}
              width="38"
              height="22"
              rx="3"
              className="fill-dispatch-accent"
              style={{
                opacity: 0,
                animation: `fade-up 0.4s ease ${delay + 0.15}s forwards`,
              }}
            />
          ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 300 180" className="w-full h-full">
      <path
        d="M40 140 C 90 40, 150 160, 200 60 S 260 40, 265 40"
        fill="none"
        stroke="#f2a93b"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="400"
        strokeDashoffset="400"
        style={{ animation: 'draw-path 1.6s ease forwards' }}
      />
      <circle cx="40" cy="140" r="6" className="fill-dispatch-accent" />
      <circle cx="265" cy="40" r="6" fill="none" stroke="#f2a93b" strokeWidth="2" />
      <circle r="5" className="fill-dispatch-text" style={{ offsetPath: 'none' }}>
        <animateMotion
          dur="1.6s"
          fill="freeze"
          path="M40 140 C 90 40, 150 160, 200 60 S 260 40, 265 40"
        />
      </circle>
      <style>{`
        @keyframes draw-path {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}

export default function InteractiveSteps() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setActive((i) => (i + 1) % STEPS.length), STEP_DURATION_MS);
    return () => clearTimeout(id);
  }, [active, paused]);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-dispatch-line">
      <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">Three steps, every time.</h2>

      <div
        className="grid lg:grid-cols-2 gap-8 items-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <TiltCard maxTilt={6} className="rounded-xl order-2 lg:order-1">
          <div className="rounded-xl border border-dispatch-line bg-dispatch-panel h-64 sm:h-80 flex items-center justify-center overflow-hidden">
            <div key={active} className="w-full h-full p-6">
              <StepIllustration step={active} />
            </div>
          </div>
        </TiltCard>

        <div className="order-1 lg:order-2">
          <div className="flex gap-2 mb-6">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="h-1 flex-1 rounded-full bg-dispatch-line overflow-hidden"
                aria-label={`Show step ${i + 1}`}
              >
                <div
                  className="h-full bg-dispatch-accent"
                  style={{
                    width: i < active ? '100%' : i > active ? '0%' : undefined,
                    animation:
                      i === active && !paused
                        ? `step-progress ${STEP_DURATION_MS}ms linear forwards`
                        : undefined,
                  }}
                />
              </button>
            ))}
          </div>

          {STEPS.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setActive(i)}
              className={`w-full text-left mb-3 rounded-lg p-4 transition-colors border ${
                active === i
                  ? 'border-dispatch-accent bg-dispatch-accent/5'
                  : 'border-transparent hover:border-dispatch-line'
              }`}
            >
              <div className="flex items-baseline gap-3 mb-1.5">
                <span className="font-mono text-xs text-dispatch-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-sm font-semibold">{s.title}</h3>
              </div>
              <p className="text-xs text-dispatch-dim leading-relaxed pl-7">{s.body}</p>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes step-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}