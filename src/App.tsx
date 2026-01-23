
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import SuiviPage from "./pages/SuiviPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminContentEditor from "./pages/admin/AdminContentEditor";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/suivi" element={<SuiviPage />} />
            <Route path="/admin" element={<Navigate to="/ecqm19-admin" replace />} />
            <Route path="/admin/dashboard" element={<Navigate to="/ecqm19-admin/dashboard" replace />} />
            <Route path="/ecqm19-admin" element={<AdminLoginPage />} />
            <Route path="/ecqm19-admin/dashboard" element={<AdminDashboard />} />
            <Route path="/ecqm19-admin/content" element={<AdminContentEditor />} />
            <Route path="/*" element={<Index />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
