
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { useMaintenance } from "@/hooks/useMaintenance";
import MaintenancePage from "@/components/pages/MaintenancePage";
import Index from "./pages/Index";
import SuiviPage from "./pages/SuiviPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import ScrollToTop from "./components/ScrollToTop";
import SeoHead from "./components/SeoHead";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import GlobalErrorFallback from "./components/GlobalErrorFallback";
import PageLoader from "./components/ui/PageLoader";

// Pages admin chargées à la demande (code-splitting) : jamais vues par les
// visiteurs, elles alourdissaient inutilement le bundle principal.
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminContentEditor = lazy(() => import("./pages/admin/AdminContentEditor"));
const AdminVisualEditor = lazy(() => import("./pages/admin/AdminVisualEditor"));
const AdminCareersPage = lazy(() => import("./pages/admin/AdminCareersPage"));
const AdminDocumentationPage = lazy(() => import("./pages/admin/AdminDocumentationPage"));

const queryClient = new QueryClient();

/**
 * Wrapper qui affiche la page de maintenance si activée.
 * Les routes admin (/vision-admin/*) ne sont jamais bloquées.
 */
const MaintenanceGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { enabled, message, loading } = useMaintenance();

  if (loading) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  if (enabled) {
    return <MaintenancePage message={message} />;
  }

  return <>{children}</>;
};

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SeoHead />
          <ScrollToTop />
          <ErrorBoundary fallback={<GlobalErrorFallback />}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Routes admin : jamais bloquées par la maintenance */}
                <Route path="/admin" element={<Navigate to="/vision-admin" replace />} />
                <Route path="/admin/dashboard" element={<Navigate to="/vision-admin/dashboard" replace />} />
                <Route path="/vision-admin" element={<AdminLoginPage />} />
                <Route path="/vision-admin/dashboard" element={<AdminDashboard />} />
                <Route path="/vision-admin/content" element={<AdminContentEditor />} />
                <Route path="/vision-admin/visual" element={<AdminVisualEditor />} />
                <Route path="/vision-admin/jobs" element={<AdminCareersPage />} />
                <Route path="/vision-admin/documentation" element={<AdminDocumentationPage />} />
                {/* Routes publiques : protégées par le mode maintenance */}
                <Route path="/suivi" element={<MaintenanceGuard><SuiviPage /></MaintenanceGuard>} />
                <Route path="/*" element={<MaintenanceGuard><Index /></MaintenanceGuard>} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
