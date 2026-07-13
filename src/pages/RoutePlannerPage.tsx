import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Card } from '../components/ui/primitives';
import Button from '../components/ui/Button';

export default function RoutePlannerPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Card className="p-8 text-center max-w-lg mx-auto mt-8">
        <h1 className="text-lg font-semibold mb-2">Full route planner goes here.</h1>
        <p className="text-sm text-dispatch-dim leading-relaxed mb-6">
          This is the seam for the map-based planner — draggable pins, the real-time OSRM
          duration matrix, and the Held-Karp/OR-Tools solver — the same building blocks from the
          standalone route optimizer, wired into this account's saved routes and credits.
        </p>
        <Button onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
      </Card>
    </DashboardLayout>
  );
}
