import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Auth pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Main pages
import Dashboard from "@/pages/Dashboard"; 
import ManufacturingOrders from "@/pages/ManufacturingOrders";
import WorkOrders from "@/pages/WorkOrders";
import Products from "@/pages/Products";
import BOM from "@/pages/BOM";
import Inventory from "@/pages/Inventory";
import WorkCenters from "@/pages/WorkCenters";
import Reports from "@/pages/Reports";
import Profile from "@/pages/Profile";
import APITest from "@/pages/APITest";
import AuthTest from "@/pages/AuthTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="manufacturing-orders" element={<ManufacturingOrders />} />
              <Route path="work-orders" element={<WorkOrders />} />
              <Route path="products" element={<Products />} />
              <Route path="bom" element={<BOM />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="work-centers" element={<WorkCenters />} />
              <Route path="reports" element={<Reports />} />
              <Route path="api-test" element={<APITest />} />
              <Route path="auth-test" element={<AuthTest />} />
              <Route path="settings" element={<div className="p-8 text-center text-muted-foreground">Settings - Coming Soon</div>} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
