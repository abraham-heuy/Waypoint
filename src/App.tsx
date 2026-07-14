import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ToastContainer from './components/ui/ToastContainer';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { RequireAuth, RequireUserOnly, RequireSuperAdmin } from './components/dashboard/RouteGuards';
import { useAuthStore } from './store/authStore';

// Public pages
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

// Admin pages
import AdminLayout from './components/admin/AdminLayout';
import AdminAiActivityPage from './pages/admin/AdminAIActivityPage';
import AdminAuditLogPage from './pages/admin/AdminAuditLogPage';
import AdminConfigPage from './pages/admin/AdminConfigPage';
import AdminFeedbackPage from './pages/admin/AdminFeedbackPage';
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminPartnershipsPage from './pages/admin/AdminPatnershipsPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminRoutesPage from './pages/admin/AdminRoutes';
import AdminUserDetailPage from './pages/admin/AdminUserDetail';
import AdminUsersPage from './pages/admin/AdminUserPage';
import AdminKycPage from './pages/admin/AdminkycPage';
import ProgramsPage from './pages/ProgamsPage';
import PartnershipsPage from './pages/PatnershipsPage';
import CareersPage from './pages/careerPage';
import JezzaAiPage from './components/product/jezzaai';
import RouteOptimizerPage from './components/product/optimizer';
import CostComputationPage from './components/product/costCompute';
import MapsIntegrationPage from './components/product/maps';
import TaskInsightsPage from './components/product/task-insights';
import PrivacyPage from './pages/privacypage';
import TermsPage from './pages/termspage';
import FAQPage from './pages/faqpage';
import { usePageTitle } from './hooks/usePageTitle';


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
  usePageTitle();
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const loading = useAuthStore((s) => s.loading);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;
    checkAuth();
  }, [checkAuth]);

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
        {/* Public routes */}
        <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><BlogListPage /></PublicLayout>} />
        <Route path="/blog/:slug" element={<PublicLayout><BlogPostPage /></PublicLayout>} />
        <Route path="/pricing" element={<PublicLayout><PricingPage /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
        <Route path="/get-started" element={<PublicLayout><SignupPage /></PublicLayout>} />
        <Route path="/partnerships" element={<PublicLayout><PartnershipsPage /></PublicLayout>} />
        <Route path="/programs" element={<PublicLayout><ProgramsPage /></PublicLayout>} />
        <Route path="/careers" element={<PublicLayout><CareersPage /></PublicLayout>} />
        <Route path="/products/route-optimizer" element={<PublicLayout><RouteOptimizerPage /></PublicLayout>} />
        <Route path="/products/jezza-ai" element={<PublicLayout><JezzaAiPage /></PublicLayout>} />
        <Route path="/products/task-insights" element={<PublicLayout><TaskInsightsPage /></PublicLayout>} />
        <Route path="/products/maps-integration" element={<PublicLayout><MapsIntegrationPage /></PublicLayout>} />
        <Route path="/products/cost-computation" element={<PublicLayout><CostComputationPage /></PublicLayout>} />
        <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
        <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />
        <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />


        {/* Protected routes (RequireUserOnly) */}
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

        {/* Protected routes (RequireAuth) */}
        <Route
          path="/dashboard/*"
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

        {/* Admin routes (RequireSuperAdmin) */}
        <Route
          path="/admin"
          element={
            <RequireSuperAdmin>
              <AdminLayout />
            </RequireSuperAdmin>
          }
        >
          <Route index element={<AdminOverviewPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="users/:id" element={<AdminUserDetailPage />} />
          <Route path="kyc" element={<AdminKycPage />} />
          <Route path="routes" element={<AdminRoutesPage />} />
          <Route path="ai-activity" element={<AdminAiActivityPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="feedback" element={<AdminFeedbackPage />} />
          <Route path="partnerships" element={<AdminPartnershipsPage />} />
          <Route path="config" element={<AdminConfigPage />} />
          <Route path="audit-log" element={<AdminAuditLogPage />} />
        </Route>

        {/* 404 */}
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