import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ToastContainer from './components/ui/ToastContainer';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { RequireAuth, RequireUserOnly } from './components/dashboard/RouteGuards';
import { useAuthStore } from './store/authStore';

import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { BlogListPage, BlogPostPage } from './pages/BlogPages';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingWizardPage from './pages/OnboardingWizardPage';
import ChoosePlanPage from './pages/ChoosePlanPage';
import DashboardRouter from './pages/dashboards/DashboardRouter';
import RoutePlannerPage from './pages/RoutePlannerPage';

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const loading = useAuthStore((s) => s.loading);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;
    checkAuth();
  }, [checkAuth]);

  // Show loading spinner while checking auth
  if (loading && !hasChecked.current) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dispatch-gold" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><BlogListPage /></PublicLayout>} />
        <Route path="/blog/:slug" element={<PublicLayout><BlogPostPage /></PublicLayout>} />
        <Route path="/pricing" element={<PublicLayout><PricingPage /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
        <Route path="/get-started" element={<PublicLayout><SignupPage /></PublicLayout>} />

        <Route
          path="/onboarding"
          element={
            <RequireUserOnly>
              <OnboardingWizardPage />
            </RequireUserOnly>
          }
        />
        <Route
          path="/choose-plan"
          element={
            <RequireUserOnly>
              <ChoosePlanPage />
            </RequireUserOnly>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardRouter />
            </RequireAuth>
          }
        />
        <Route
          path="/planner"
          element={
            <RequireAuth>
              <RoutePlannerPage />
            </RequireAuth>
          }
        />

        <Route
          path="*"
          element={
            <PublicLayout>
              <div className="max-w-lg mx-auto px-4 py-24 text-center">
                <h1 className="text-2xl font-bold mb-2">Page not found.</h1>
                <p className="text-dispatch-dim text-sm">That route doesn't exist — check the address.</p>
              </div>
            </PublicLayout>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}