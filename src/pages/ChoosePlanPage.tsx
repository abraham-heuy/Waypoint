import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingCards from '../components/landing/PricingCards';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { toast } from '../store/toastStore';
import type { PricingPlan } from '../types';

export default function ChoosePlanPage() {
  const [selecting, setSelecting] = useState<string | null>(null);
  const setTier = useAuthStore((s) => s.setTier);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  async function handleSelect(plan: PricingPlan) {
    setSelecting(plan.id);
    await new Promise((r) => setTimeout(r, 500)); // mock checkout step
    setTier(plan.id);
    setSelecting(null);
    toast.success(plan.id === 'free' ? "You're on the Free plan." : `Upgraded to ${plan.name}.`);
    navigate('/dashboard');
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="text-center max-w-lg mx-auto mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          {user ? `One more thing, ${user.name.split(' ')[0]}.` : 'Choose how you start.'}
        </h1>
        <p className="text-dispatch-dim text-sm">
          Start free with starter credits, or pick a plan now — you can always change this later.
        </p>
      </div>
      <PricingCards
        onSelect={handleSelect}
        selectingPlanId={selecting}
        ctaLabel={(plan) => (plan.id === 'free' ? 'Continue free' : `Choose ${plan.name}`)}
      />
      <div className="text-center mt-8">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          Skip for now
        </Button>
      </div>
    </div>
  );
}
