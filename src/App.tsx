import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { AuthenticatedRoute, FarmerRoute, BuyerRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import FarmerPortal from "./pages/FarmerPortal";
import BuyerPortal from "./pages/BuyerPortal";
import Marketplace from "./pages/Marketplace";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/4851355a-993a-4a63-a581-a0e249f20adf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:17',message:'App component rendering',data:{windowLocation:window.location.href},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Role-based route protection: farmers can only access farmer portal, buyers only buyer portal */}
            <Route path="/farmer" element={
              <FarmerRoute>
                <FarmerPortal />
              </FarmerRoute>
            } />
            <Route path="/buyer" element={
              <BuyerRoute>
                <BuyerPortal />
              </BuyerRoute>
            } />
            <Route path="/marketplace" element={
              <AuthenticatedRoute>
                <Marketplace />
              </AuthenticatedRoute>
            } />
            <Route path="/assistant" element={
              <AuthenticatedRoute>
                <AIAssistant />
              </AuthenticatedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
