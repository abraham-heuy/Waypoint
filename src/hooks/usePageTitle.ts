import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TITLE_MAP: Record<string, string> = {
  '/': 'Route Planning for Everyone',
  '/about': 'About',
  '/blog': 'Blog',
  '/pricing': 'Pricing',
  '/contact': 'Contact',
  '/faq': 'FAQ',
  '/careers': 'Careers',
  '/partnerships': 'Partnerships',
  '/programs': 'Programs',
  '/products/route-optimizer': 'Route Optimizer',
  '/products/jezza-ai': 'Jezza AI',
  '/products/task-insights': 'Task Insights',
  '/products/maps-integration': 'Maps Integration',
  '/products/cost-computation': 'Cost Computation',
  '/get-started': 'Get Started',
  '/login': 'Log In',
  '/dashboard': 'Dashboard',
  '/onboarding': 'Onboarding',
  '/choose-plan': 'Choose Plan',
  '/planner': 'Route Planner',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
};

export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let pageTitle = 'Waypoint'; // default fallback

    // Exact match first
    let titleKey: string | null = TITLE_MAP[path] || null;

    // If no exact match, check for nested route matches (e.g., /products/*)
    if (!titleKey) {
      const matchedKey = Object.keys(TITLE_MAP).find((key) => path.startsWith(key + '/'));
      titleKey = matchedKey ? TITLE_MAP[matchedKey] : null;
    }

    if (titleKey) {
      pageTitle = `Waypoint - ${titleKey}`;
    }

    document.title = pageTitle;
  }, [location]);
}