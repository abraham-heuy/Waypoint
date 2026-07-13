import { useEffect, useState } from 'react';
import TiltCard from './Tiltcard';

const SAMPLE_MESSAGE = 'pharmacy, then groceries, then pick up Sam by 4';

const PARSED_STOPS = [
  { label: 'Pharmacy', time: 'No deadline' },
  { label: 'Groceries', time: 'No deadline' },
  { label: 'Pick up Sam', time: 'By 4:00 PM' },
];

const INSIGHT = 'Grouped the pharmacy and groceries since they\'re 4 minutes apart, then timed the last leg to make the 4:00 pickup with room to spare.';

type Stage = 'typing' | 'thinking' | 'parsed' | 'routed';
const STAGE_ORDER: Stage[] = ['typing', 'thinking', 'parsed', 'routed'];
const STAGE_DURATIONS: Record<Stage, number> = {
  typing: 2200,
  thinking: 1100,
  parsed: 2600,
  routed: 2600,
};

function useTypewriter(text: string, active: boolean, speedMs = 38) {
  const [shown, setShown] = useState('');

  useEffect(() => {
    if (!active) {
      setShown('');
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speedMs);
    return () => clearInterval(id);
  }, [active, text, speedMs]);

  return shown;
}

export default function AiWorkflowSection() {
  const [stage, setStage] = useState<Stage>('typing');

  useEffect(() => {
    const id = setTimeout(() => {
      const idx = STAGE_ORDER.indexOf(stage);
      setStage(STAGE_ORDER[(idx + 1) % STAGE_ORDER.length]);
    }, STAGE_DURATIONS[stage]);
    return () => clearTimeout(id);
  }, [stage]);

  const typed = useTypewriter(SAMPLE_MESSAGE, stage === 'typing');
  const stageIndex = STAGE_ORDER.indexOf(stage);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-dispatch-line">
      <div className="text-center max-w-xl mx-auto mb-12">
        <div className="inline-block text-xs font-mono uppercase tracking-widest text-dispatch-accent border border-dispatch-accentDim rounded-full px-3 py-1 mb-4">
          The assistant, live
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Say it once. It plans the rest.</h2>
        <p className="text-dispatch-dim text-sm sm:text-base">
          Free text in, parsed stops and reasoning out — then straight into the same optimizer as everything else.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {STAGE_ORDER.map((s, i) => (
          <button
            key={s}
            onClick={() => setStage(s)}
            className={`h-1 w-16 rounded-full transition-colors ${
              i <= stageIndex ? 'bg-dispatch-accent' : 'bg-dispatch-line'
            }`}
            aria-label={`Jump to stage ${i + 1}`}
          />
        ))}
      </div>

      <TiltCard maxTilt={5} className="rounded-xl max-w-2xl mx-auto">
        <div className="rounded-xl border border-dispatch-line bg-dispatch-panel p-6 sm:p-8 min-h-[260px] flex flex-col justify-center">
          {(stage === 'typing' || stage === 'thinking') && (
            <div className="space-y-4">
              <div className="text-[11px] uppercase tracking-wide text-dispatch-dim">You type</div>
              <div className="rounded-lg bg-dispatch-panel2 border border-dispatch-line px-4 py-3 text-sm min-h-[2.75rem] flex items-center">
                {typed}
                {stage === 'typing' && (
                  <span className="inline-block w-[2px] h-4 bg-dispatch-accent ml-0.5 animate-pulse" />
                )}
              </div>
              {stage === 'thinking' && (
                <div className="flex items-center gap-2 text-xs text-dispatch-dim pl-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-dispatch-dim animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-dispatch-dim animate-pulse [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-dispatch-dim animate-pulse [animation-delay:0.3s]" />
                  <span>Parsing stops and checking timing…</span>
                </div>
              )}
            </div>
          )}

          {stage === 'parsed' && (
            <div className="space-y-4 animate-fade-up">
              <div className="text-[11px] uppercase tracking-wide text-dispatch-dim">Parsed into stops</div>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {PARSED_STOPS.map((s, i) => (
                  <div
                    key={s.label}
                    className="rounded-lg border border-dispatch-line bg-dispatch-panel2 p-3 animate-fade-up"
                    style={{ animationDelay: `${i * 140}ms` }}
                  >
                    <div className="text-xs font-semibold mb-1">{s.label}</div>
                    <div className="text-[11px] font-mono text-dispatch-dim">{s.time}</div>
                  </div>
                ))}
              </div>
              <div className="border-l-2 border-dispatch-accentDim pl-3 text-xs text-dispatch-dim leading-relaxed">
                {INSIGHT}
              </div>
            </div>
          )}

          {stage === 'routed' && (
            <div className="animate-fade-up">
              <div className="text-[11px] uppercase tracking-wide text-dispatch-dim mb-4">Sent to the optimizer</div>
              <svg viewBox="0 0 400 100" className="w-full h-24">
                <path
                  d="M20 70 C 100 20, 180 90, 260 40 S 360 20, 380 30"
                  fill="none"
                  stroke="#f2a93b"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="480"
                  strokeDashoffset="480"
                  style={{ animation: 'ai-route-draw 1.4s ease forwards' }}
                />
                <circle cx="20" cy="70" r="5" fill="#f2a93b" />
                <circle cx="150" cy="55" r="4" fill="#e7edf0" />
                <circle cx="260" cy="40" r="4" fill="#e7edf0" />
                <circle cx="380" cy="30" r="5" fill="none" stroke="#f2a93b" strokeWidth="2" />
              </svg>
              <div className="flex items-center justify-between text-xs font-mono text-dispatch-dim mt-2">
                <span>3 stops</span>
                <span className="text-dispatch-accent">Route ready — 18 min</span>
              </div>
              <style>{`
                @keyframes ai-route-draw {
                  to { stroke-dashoffset: 0; }
                }
              `}</style>
            </div>
          )}
        </div>
      </TiltCard>
    </section>
  );
}
