import { useEffect, useState } from 'react';
import TiltCard from './Tiltcard';

interface Testimonial {
  name: string;
  role: string;
  segment: string;
  quote: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'James Mwangi',
    role: 'Delivery rider, Nairobi',
    segment: 'Driver',
    quote:
      'I used to plan my lunch run by feel. Now I get through the same orders about 20 minutes faster, and I actually know which stop is cutting it close before I leave.',
    rating: 5,
  },
  {
    name: 'Sarah Chen',
    role: 'Freelancer',
    segment: 'Errands',
    quote:
      'I just tell the assistant what I need to do on a Saturday and it hands back a loop that makes sense. The rideshare fallback has saved me more than once when my car was in the shop.',
    rating: 5,
  },
  {
    name: 'Diego Fernández',
    role: 'Travel blogger',
    segment: 'Trip planning',
    quote:
      "Planned four days in a city I'd never visited. It caught that two museums I wanted were closed the day I'd picked, and rebuilt the order around that.",
    rating: 4,
  },
  {
    name: 'Grace Wanjiru',
    role: 'Operations lead, small courier team',
    segment: 'Business',
    quote:
      'Seeing all three drivers on one dashboard, with on-time rates that update themselves, replaced a spreadsheet I was updating by hand every evening.',
    rating: 5,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-3" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`w-4 h-4 ${i < rating ? 'fill-dispatch-accent' : 'fill-dispatch-line'}`}
        >
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.8l-5.2 2.9 1-5.9L1.5 7.7l5.9-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center max-w-lg mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">People plan their days on this.</h2>
        <p className="text-dispatch-dim text-sm sm:text-base">
          Across drivers, errands, trips, and small teams — the same optimizer, different days.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-stretch">
        <TiltCard className="rounded-xl">
          <div
            key={active}
            className="rounded-xl border border-dispatch-accent bg-dispatch-panel p-7 sm:p-8 h-full flex flex-col justify-between animate-fade-up"
          >
            <div>
              <Stars rating={TESTIMONIALS[active].rating} />
              <p className="text-base sm:text-lg leading-relaxed mb-6">
                &ldquo;{TESTIMONIALS[active].quote}&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-dispatch-accent/15 border border-dispatch-accentDim flex items-center justify-center font-mono text-sm text-dispatch-accent">
                {TESTIMONIALS[active].name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="text-sm font-semibold">{TESTIMONIALS[active].name}</div>
                <div className="text-xs text-dispatch-dim">{TESTIMONIALS[active].role}</div>
              </div>
              <span className="ml-auto text-[10px] uppercase tracking-wide text-dispatch-accent border border-dispatch-accentDim rounded-full px-2.5 py-1">
                {TESTIMONIALS[active].segment}
              </span>
            </div>
          </div>
        </TiltCard>

        <div className="grid grid-cols-2 gap-4 content-start">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActive(i)}
              className={`text-left rounded-lg border p-4 transition-colors ${
                active === i
                  ? 'border-dispatch-accent bg-dispatch-accent/5'
                  : 'border-dispatch-line hover:border-dispatch-dim'
              }`}
            >
              <div className="text-xs font-semibold mb-1">{t.name}</div>
              <div className="text-[11px] text-dispatch-dim mb-2">{t.segment}</div>
              <Stars rating={t.rating} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}