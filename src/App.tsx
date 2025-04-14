import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./main";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Lists from "./pages/Lists";
import ListDetail from "./pages/ListDetail";
import StoreDashboard from "./pages/StoreDashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import HowItWorks from "./components/home/HowItWorks";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ 
  children, 
  requiredRole
}: { 
  children: JSX.Element, 
  requiredRole?: 'customer' | 'store' 
}) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to sign in if not authenticated
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If a specific role is required, check it
  if (requiredRole && user?.userType !== requiredRole) {
    // Redirect based on user role
    const redirectPath = user?.userType === 'customer' ? '/lists' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          
          {/* Protected customer routes */}
          <Route path="/lists" element={
            <ProtectedRoute requiredRole="customer">
              <Lists />
            </ProtectedRoute>
          } />
          <Route path="/lists/:id" element={
            <ProtectedRoute requiredRole="customer">
              <ListDetail />
            </ProtectedRoute>
          } />
          
          {/* Protected store owner route */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="store">
              <StoreDashboard />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
