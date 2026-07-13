import { useEffect, useState } from 'react';
import type { PricingPlan } from '../../types';
import { fetchPricingPlans } from '../../lib/api';
import { Skeleton } from '../ui/primitives';
import Button from '../ui/Button';

interface PricingCardsProps {
  onSelect?: (plan: PricingPlan) => void;
  selectingPlanId?: string | null;
  ctaLabel?: (plan: PricingPlan) => string;
}

export default function PricingCards({ onSelect, selectingPlanId, ctaLabel }: PricingCardsProps) {
  const [plans, setPlans] = useState<PricingPlan[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPricingPlans().then((res) => {
      if (cancelled) return;
      if (res.ok && res.data) setPlans(res.data);
      else setError('Could not load live pricing — showing standard plans.');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!plans) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-72" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {error && <p className="text-xs text-dispatch-dim mb-4 text-center">{error}</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-xl border p-6 flex flex-col ${
              plan.highlighted
                ? 'border-dispatch-accent bg-dispatch-accent/5'
                : 'border-dispatch-line bg-dispatch-panel'
            }`}
          >
            {plan.highlighted && (
              <div className="text-[10px] uppercase tracking-wide text-dispatch-accent font-bold mb-2">
                Most popular
              </div>
            )}
            <h3 className="text-base font-semibold mb-1">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-2xl font-bold">${plan.price}</span>
              <span className="text-xs text-dispatch-dim">/{plan.billingPeriod === 'month' ? 'mo' : 'once'}</span>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="text-xs text-dispatch-dim flex gap-2">
                  <span className="text-dispatch-accent">•</span>
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.highlighted ? 'primary' : 'secondary'}
              className="w-full"
              loading={selectingPlanId === plan.id}
              onClick={() => onSelect?.(plan)}
            >
              {ctaLabel ? ctaLabel(plan) : `Choose ${plan.name}`}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
