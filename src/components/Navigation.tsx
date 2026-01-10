import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, Users, ShoppingCart, Bot, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, session, signOut } = useAuth();
  const { toast } = useToast();

  // Get user type from user metadata
  const userType = user?.user_metadata?.user_type || session?.user?.user_metadata?.user_type;

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Logged out successfully",
        description: "See you later!",
      });
    }
  };

  // Define navigation items based on authentication state
  const getNavigationItems = () => {
    const baseItems = [{ name: 'Home', href: '/', icon: Leaf }];
    
    if (!user) {
      // Show both portals for unauthenticated users (they'll see login forms)
      return [
        ...baseItems,
        { name: 'Farmer Portal', href: '/farmer', icon: Leaf },
        { name: 'Buyer Portal', href: '/buyer', icon: Users }
      ];
    }
    
    // Authenticated user - show appropriate portal and shared features
    const authenticatedItems = [...baseItems];
    
    if (userType === 'farmer') {
      authenticatedItems.push({ name: 'Farmer Dashboard', href: '/farmer', icon: Leaf });
    } else if (userType === 'buyer') {
      authenticatedItems.push({ name: 'Buyer Dashboard', href: '/buyer', icon: Users });
    }
    
    // Add shared authenticated features
    authenticatedItems.push(
      { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
      { name: 'AI Assistant', href: '/assistant', icon: Bot }
    );
    
    return authenticatedItems;
  };

  const navigation = getNavigationItems();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-sky shadow-primary sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center hover-lift">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">AgriSmart</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                    isActive(item.href)
                      ? 'bg-white/20 text-white shadow-glow'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* User Info and Logout for Authenticated Users */}
            {user && (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/20">
                <div className="flex items-center space-x-2 text-white/90">
                  <User className="w-4 h-4" />
                  <span className="text-sm capitalize">{userType}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white/80 hover:text-white hover:bg-white/10 transition-smooth"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/10 backdrop-blur-sm rounded-lg mt-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-smooth ${
                      isActive(item.href)
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile User Info and Logout */}
              {user && (
                <div className="border-t border-white/20 pt-3 mt-3">
                  <div className="flex items-center space-x-2 px-3 py-2 text-white/90">
                    <User className="w-5 h-5" />
                    <span className="text-base capitalize">Logged in as {userType}</span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 transition-smooth"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;