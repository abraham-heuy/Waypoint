import { useNavigate } from 'react-router-dom';
import Hero3D from '../components/landing/Hero3D';
import FeatureGrid from '../components/landing/FeatureGrid';
import SegmentShowcase from '../components/landing/SegmentShowcase';
import InteractiveSteps from '../components/landing/InteractiveSteps';
import ProductShowcase from '../components/landing/ProductShowcase';
import AiWorkflowSection from '../components/landing/aiWorkflowSection';
import AnimatedStats from '../components/landing/animatedStats';
import TestimonialsSection from '../components/landing/testimonialsCard';
import Button from '../components/ui/Button';
import JezzaBot from '../components/landing/jezzabot';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero – already has bottom border */}
      <section className="relative overflow-hidden border-b border-dispatch-line">
        <Hero3D />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dispatch-bg/40 to-dispatch-bg pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-32 sm:pt-36 sm:pb-44">
          <div className="max-w-xl animate-fade-up">
            <div className="inline-block text-xs font-mono uppercase tracking-widest text-dispatch-accent border border-dispatch-accentDim rounded-full px-3 py-1 mb-6">
              Route planning, rebuilt
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
              Plan your day.
              <br />
              Drive the shortest version of it.
            </h1>
            <p className="text-dispatch-dim text-base sm:text-lg leading-relaxed mb-8 max-w-md">
              For delivery drivers, errand runners, trip planners, and small teams — Waypoint
              turns a list of stops into the fastest real route, with an assistant that does the
              thinking if you'd rather not.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate('/get-started')}>Get started free</Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/about')}>See how it works</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Real output first — builds trust before the feature pitch */}
      <ProductShowcase />

      {/* All subsequent sections get a top border */}
      <section className="border-t border-dispatch-line"><FeatureGrid /></section>
      <section className="border-t border-dispatch-line"><AiWorkflowSection /></section>
      <section className="border-t border-dispatch-line"><InteractiveSteps /></section>
      <section className="border-t border-dispatch-line"><SegmentShowcase /></section>
      <section className="border-t border-dispatch-line"><TestimonialsSection /></section>

      {/* Final CTA – also with top border */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center border-t border-dispatch-line overflow-hidden">
        {/* Decorative animated rings */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10" aria-hidden="true">
          <div className="w-96 h-96 rounded-full border border-dispatch-accent animate-[pulse_4s_ease-in-out_infinite]" />
          <div className="absolute w-64 h-64 rounded-full border border-dispatch-accentDim animate-[pulse_4s_ease-in-out_infinite_0.5s]" />
          <div className="absolute w-40 h-40 rounded-full border border-dispatch-line animate-[pulse_4s_ease-in-out_infinite_1s]" />
        </div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-dispatch-accent/5 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-dispatch-text via-dispatch-accent to-dispatch-text bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_6s_linear_infinite]">
            Your first routes are free.
          </h2>
          <p className="text-dispatch-dim mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            A short set of questions, then you're planning — start planning now.
          </p>
          <div className="inline-block relative group">
            <Button
              size="lg"
              onClick={() => navigate('/get-started')}
              className="relative z-10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-dispatch-accent/30"
            >
              Get started free
            </Button>
            {/* Button glow effect */}
            <div className="absolute inset-0 rounded-lg bg-dispatch-accent blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-0" />
          </div>
          <div className="mt-6 text-xs text-dispatch-dim/50 font-mono">
            No credit card · Free credits included for trials
          </div>
        </div>

        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
        `}</style>
      </section>

      {/* Animated stats – at the very bottom, also with top border */}
      <section className="border-t border-dispatch-line"><AnimatedStats /></section>

      <JezzaBot />

    </div>
  );
}
