import { useNavigate } from 'react-router-dom';
import PricingCards from '../components/landing/PricingCards';

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center max-w-lg mx-auto mb-14">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Simple pricing, real credits.</h1>
        <p className="text-dispatch-dim text-sm sm:text-base">
          Every plan includes the same optimizer — the difference is how many routes you can run and how many stops each one can hold.
        </p>
      </div>
      <PricingCards onSelect={() => navigate('/get-started')} />
    </div>
  );
}
