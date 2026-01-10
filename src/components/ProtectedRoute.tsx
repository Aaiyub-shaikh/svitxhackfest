import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedUserTypes?: ('farmer' | 'buyer')[];
  redirectTo?: string;
  requireUserType?: boolean; // when false, only checks that user is logged in
}

export const ProtectedRoute = ({ 
  children, 
  allowedUserTypes = ['farmer', 'buyer'], 
  redirectTo = '/',
  requireUserType = true,
}: ProtectedRouteProps) => {
  const { user, session, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md shadow-primary">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground text-center">
              Checking authentication...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!user || !session) {
    return <Navigate to={redirectTo} replace />;
  }

  // If the route requires checking user type, enforce it
  if (requireUserType) {
    // Get user type from user metadata or session
    const userType = user.user_metadata?.user_type || session.user?.user_metadata?.user_type;

    // Redirect if user type is not allowed - redirect to the user's own portal when possible
    if (userType && !allowedUserTypes.includes(userType)) {
      const portalPath = userType === 'farmer' ? '/farmer' : '/buyer';
      return <Navigate to={portalPath} replace />;
    }

    // If user type is not set, redirect to home to choose a role/login
    if (!userType) {
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and (optionally) has correct permissions
  return <>{children}</>;
};

// Route guard that allows unauthenticated access (for login forms) but enforces role-based access when authenticated
const PortalRoute = ({ 
  children, 
  allowedUserType 
}: { 
  children: ReactNode;
  allowedUserType: 'farmer' | 'buyer';
}) => {
  const { user, session, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md shadow-primary">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground text-center">
              Checking authentication...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Allow unauthenticated users to access (they'll see login form in the portal page)
  if (!user || !session) {
    return <>{children}</>;
  }

  // For authenticated users, enforce role-based access
  const userType = user.user_metadata?.user_type || session.user?.user_metadata?.user_type;
  
  // If user has wrong role, redirect them to their own portal
  if (userType && userType !== allowedUserType) {
    const portalPath = userType === 'farmer' ? '/farmer' : '/buyer';
    return <Navigate to={portalPath} replace />;
  }

  // User is authenticated and has correct role, or no role set (show portal)
  return <>{children}</>;
};

// Specific route guards for convenience
export const FarmerRoute = ({ children }: { children: ReactNode }) => (
  <PortalRoute allowedUserType="farmer">
    {children}
  </PortalRoute>
);

export const BuyerRoute = ({ children }: { children: ReactNode }) => (
  <PortalRoute allowedUserType="buyer">
    {children}
  </PortalRoute>
);

export const AuthenticatedRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedUserTypes={['farmer', 'buyer']} redirectTo="/" requireUserType={false}>
    {children}
  </ProtectedRoute>
);
