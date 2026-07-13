import { useAuthStore } from '../../store/authStore';
import DriverDashboard from './DriverDashboard';
import ErrandDashboard from './ErrandDashboard';
import TouristDashboard from './TouristDashboard';
import BusinessDashboard from './BusinessDashboard';

export default function DashboardRouter() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  switch (user.segment) {
    case 'delivery':
      return <DriverDashboard />;
    case 'field_team':
    case 'enterprise':
      return <BusinessDashboard />;
    case 'solo':
    default:
      return <ErrandDashboard />;
  }
}