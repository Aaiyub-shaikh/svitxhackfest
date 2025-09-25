import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UserPlus, ShoppingCart, DollarSign, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BuyerPortal = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoggedIn(true);
    toast({
      title: "Login successful!",
      description: "Welcome to the Buyer Portal",
    });
  };

  const handleRegister = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoggedIn(true);
    setIsRegistering(false);
    toast({
      title: "Registration successful!",
      description: "Your buyer account has been created",
    });
  };

  const handleRequirementSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Requirement posted!",
      description: "Farmers can now see your crop requirements",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Buyer Portal</h1>
            <p className="text-muted-foreground">Connect with farmers and source quality crops</p>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>{isRegistering ? 'Create Account' : 'Login'}</CardTitle>
              <CardDescription>
                {isRegistering 
                  ? 'Join our marketplace to connect with farmers' 
                  : 'Access your buyer dashboard'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                {isRegistering && (
                  <>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" type="text" required className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" type="text" required className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" required className="mt-2" />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required className="mt-2" />
                </div>
                <Button type="submit" className="w-full bg-gradient-growth text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isRegistering ? 'Create Account' : 'Login'}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-primary hover:underline text-sm"
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
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Buyer Dashboard</h1>
          <p className="text-muted-foreground text-lg">Manage your crop requirements and connect with farmers</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsLoggedIn(false)}
          className="text-primary border-primary hover:bg-primary/10"
        >
          Logout
        </Button>
      </div>

      <Tabs defaultValue="requirements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requirements">Post Requirements</TabsTrigger>
          <TabsTrigger value="dashboard">My Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Post Crop Requirements
              </CardTitle>
              <CardDescription>
                Specify your crop needs and let farmers contact you directly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRequirementSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="crop-type">Crop Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="tomato">Tomato</SelectItem>
                        <SelectItem value="potato">Potato</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity Needed (tons)</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="e.g., 50"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price-range">Price Range (₹/ton)</Label>
                    <Input
                      id="price-range"
                      type="text"
                      placeholder="e.g., ₹20,000 - ₹25,000"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Preferred Location</Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="City, State"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="delivery-date">Required Delivery Date</Label>
                    <Input
                      id="delivery-date"
                      type="date"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-phone">Contact Phone</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="additional-requirements">Additional Requirements</Label>
                  <Textarea
                    id="additional-requirements"
                    placeholder="Specify quality standards, packaging requirements, etc."
                    className="mt-2"
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-growth text-white shadow-success">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Post Requirement
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Requirements</CardTitle>
                <ShoppingCart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">5</div>
                <p className="text-xs text-muted-foreground">Currently posted</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Farmer Responses</CardTitle>
                <UserPlus className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">12</div>
                <p className="text-xs text-muted-foreground">New inquiries this week</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                <DollarSign className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">2.5h</div>
                <p className="text-xs text-muted-foreground">Faster than average</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Requirements</CardTitle>
              <CardDescription>Your latest crop requirement posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { crop: 'Rice', quantity: '100 tons', price: '₹22,000/ton', location: 'Punjab', status: 'Active', responses: 8 },
                  { crop: 'Wheat', quantity: '75 tons', price: '₹25,000/ton', location: 'Haryana', status: 'Active', responses: 5 },
                  { crop: 'Cotton', quantity: '50 tons', price: '₹45,000/ton', location: 'Gujarat', status: 'Completed', responses: 12 }
                ].map((req, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-growth rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{req.crop} - {req.quantity}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <DollarSign className="w-3 h-3" />
                          {req.price}
                          <MapPin className="w-3 h-3 ml-2" />
                          {req.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={req.status === 'Active' ? 'default' : 'secondary'}>
                        {req.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {req.responses} responses
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuyerPortal;