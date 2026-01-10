import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, LogIn, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  userType: 'farmer' | 'buyer';
  title: string;
  description: string;
}

export const AuthForm = ({ userType, title, description }: AuthFormProps) => {
  const { toast } = useToast();
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (isRegistering) {
        const profileData = {
          full_name: formData.get('name') as string,
          phone: formData.get('phone') as string,
          ...(userType === 'farmer' && {
            farm_name: formData.get('farm-name') as string,
            farm_location: formData.get('location') as string,
            farm_size_acres: formData.get('farm-size') as string
          }),
          ...(userType === 'buyer' && {
            company_name: formData.get('company') as string
          })
        };

        // Capture the response so we can read the actual assigned user type
        const { data, error } = await signUp(email, password, userType, profileData);
        
        if (error) {
          toast({
            title: "Registration failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          // Get user type from server response - this is the source of truth
          const serverUserType = data?.user?.user_metadata?.user_type as 'farmer' | 'buyer' | undefined;
          const actualUserType = serverUserType || userType;
          
          toast({
            title: "Registration successful!",
            description: `Welcome to the ${actualUserType} portal`,
          });
          
          // Wait for state to update, then navigate and force reload
          const redirectPath = actualUserType === 'farmer' ? '/farmer' : '/buyer';
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 100);
        }
      } else {
        const { data, error } = await signIn(email, password);
        
        if (error) {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          // Get user type from server response - this is the source of truth
          const serverUserType = data?.user?.user_metadata?.user_type as 'farmer' | 'buyer' | undefined;

          // Prefer the portal's expected userType when signing in from a portal page
          // (this prevents accidental redirects if the backend returns an unexpected role)
          const actualUserType = userType || serverUserType;

          if (serverUserType && serverUserType !== userType) {
            console.warn(`AuthForm: server returned user_type='${serverUserType}' but form expected '${userType}'. Using '${actualUserType}' for redirect.`);
          }

          toast({
            title: "Login successful!",
            description: `Welcome to the ${actualUserType} portal`,
          });

          // Wait for state to update, then navigate and force reload
          const redirectPath = actualUserType === 'farmer' ? '/farmer' : '/buyer';
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 100);
        }
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <Card className="shadow-primary hover-lift border-0">
          <CardHeader>
            <CardTitle>{isRegistering ? 'Create Account' : 'Login'}</CardTitle>
            <CardDescription>
              {isRegistering 
                ? `Join our platform as a ${userType}` 
                : `Access your ${userType} dashboard`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input name="name" type="text" required className="mt-2" />
                  </div>
                  {userType === 'farmer' && (
                    <>
                      <div>
                        <Label htmlFor="farm-name">Farm Name</Label>
                        <Input name="farm-name" type="text" required className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="location">Farm Location</Label>
                        <Input name="location" type="text" placeholder="City, State" required className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="farm-size">Farm Size (acres)</Label>
                        <Input name="farm-size" type="number" required className="mt-2" />
                      </div>
                    </>
                  )}
                  {userType === 'buyer' && (
                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input name="company" type="text" required className="mt-2" />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input name="phone" type="tel" required className="mt-2" />
                  </div>
                </>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input name="email" type="email" required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input name="password" type="password" required className="mt-2" />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary text-white shadow-primary hover:shadow-success transition-smooth"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : isRegistering ? (
                  <UserPlus className="w-4 h-4 mr-2" />
                ) : (
                  <LogIn className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Please wait...' : (isRegistering ? 'Create Account' : 'Login')}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-primary hover:text-accent transition-gentle hover:underline text-sm"
                disabled={isLoading}
              >
                {isRegistering 
                  ? 'Already have an account? Login' 
                  : "Don't have an account? Register"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};