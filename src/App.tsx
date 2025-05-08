import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Analyze from "./pages/Analyze";
import NotFound from "./pages/NotFound";
import APIConfig from "./pages/APIConfig";
import Auth from "./pages/Auth";
import Logs from "./pages/Logs";
import History from './pages/History';
import { AuthProvider } from "./contexts/AuthContext";
import { AnalyzeProvider } from "./contexts/AnalyzeContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AnalyzeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/analyze" element={
                <ProtectedRoute>
                  <Analyze />
                </ProtectedRoute>
              } />
              <Route path="/api-config" element={
                <ProtectedRoute>
                  <APIConfig />
                </ProtectedRoute>
              } />
              <Route path="/logs" element={
                <ProtectedRoute>
                  <Logs />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AnalyzeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
