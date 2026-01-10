import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { AuthenticatedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import FarmerPortal from "./pages/FarmerPortal";
import BuyerPortal from "./pages/BuyerPortal";
import Marketplace from "./pages/Marketplace";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/farmer" element={<FarmerPortal />} />
            <Route path="/buyer" element={<BuyerPortal />} />
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

export default App;
