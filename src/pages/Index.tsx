import { useAuth } from '@/hooks/useAuth';
import { AuthSelection } from '@/components/AuthSelection';

const Index = () => {
  const { loading } = useAuth();

  // Show loading while auth is being validated to avoid UI flashes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Keep the home page minimal; the weather panel is shown on the Farmer Dashboard.
  return <AuthSelection />;
};

export default Index;