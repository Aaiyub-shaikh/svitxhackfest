import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/AuthForm';
import { addRequirement, getRequirementsByUser, BuyerRequirement, CropOption } from '@/services/marketplace';

const BuyerPortal = () => {
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Force re-render when user state changes or route changes
  useEffect(() => {
    // This ensures the component re-renders when navigating to this route
  }, [user, location.pathname]);

  const [crop, setCrop] = useState<CropOption | ''>('');
  const [quantity, setQuantity] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [preferredLocation, setPreferredLocation] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [additional, setAdditional] = useState<string>('');
  const [myRequirements, setMyRequirements] = useState<BuyerRequirement[]>([]);

  useEffect(() => {
    if (user) {
      (async () => {
        const list = await getRequirementsByUser(user.id);
        setMyRequirements(list);
      })();
    }
  }, [user]);

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

  const handleRequirementSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    if (!crop || !quantity || !priceRange || !preferredLocation || !deliveryDate || !contactPhone) {
      toast({ title: 'Missing details', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const item: BuyerRequirement = {
      id,
      buyerUserId: user.id,
      buyerName: (user.user_metadata?.company_name as string) || user.email || 'Buyer',
      crop: crop as CropOption,
      quantityTons: parseFloat(quantity),
      priceRange,
      location: preferredLocation,
      deliveryDateISO: deliveryDate,
      contactPhone,
      email: user.email || undefined,
      description: additional || undefined,
      status: 'Active',
      postedDateISO: new Date().toISOString(),
    };
    (async () => {
      try {
        const created = await addRequirement(item as BuyerRequirement);
        // Update local UI with created item (map DB shape if necessary)
        const uiItem: BuyerRequirement = {
          id: (created && created.id) ? created.id.toString() : item.id,
          buyerUserId: (created && created.buyer_id) ? created.buyer_id.toString() : item.buyerUserId,
          buyerName: (created && created.buyer_email) ? created.buyer_email : item.buyerName,
          crop: item.crop,
          quantityTons: item.quantityTons,
          priceRange: item.priceRange,
          location: item.location,
          deliveryDateISO: (created && created.delivery_date) ? new Date(created.delivery_date).toISOString() : item.deliveryDateISO,
          contactPhone: item.contactPhone,
          email: (created && created.buyer_email) ? created.buyer_email : item.email,
          description: item.description,
          status: 'Active',
          postedDateISO: (created && created.created_at) ? created.created_at : item.postedDateISO,
        };
        setMyRequirements(prev => [uiItem, ...prev]);
      } catch (err) {
        setMyRequirements(prev => [item, ...prev]);
      }
    })();
    // Reset form
    setCrop(''); setQuantity(''); setPriceRange(''); setPreferredLocation(''); setDeliveryDate(''); setContactPhone(''); setAdditional('');
    toast({
      title: 'Requirement posted!',
      description: 'Farmers can now see your crop requirements',
    });
  };

if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthForm 
        userType="buyer"
        title="Buyer Portal"
        description="Connect with farmers and source quality crops"
      />
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
          onClick={handleLogout}
          className="text-primary border-primary hover:bg-primary/10 hover-lift"
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
                    <Select value={crop} onValueChange={(v) => setCrop(v as CropOption)}>
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
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
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
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
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
                      value={preferredLocation}
                      onChange={(e) => setPreferredLocation(e.target.value)}
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
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-phone">Contact Phone</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
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
                    value={additional}
                    onChange={(e) => setAdditional(e.target.value)}
                    placeholder="Specify quality standards, packaging requirements, etc."
                    className="mt-2"
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-primary text-white shadow-primary hover:shadow-success transition-smooth hover-lift">
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
                <div className="text-2xl font-bold text-primary">{myRequirements.filter(r => r.status === 'Active').length}</div>
                <p className="text-xs text-muted-foreground">Currently posted</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Farmer Responses</CardTitle>
                <UserPlus className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">0</div>
                <p className="text-xs text-muted-foreground">(Demo) Responses tracked</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                <DollarSign className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">—</div>
                <p className="text-xs text-muted-foreground">Demo metric</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>My Requirements</CardTitle>
              <CardDescription>Your latest crop requirement posts</CardDescription>
            </CardHeader>
            <CardContent>
              {myRequirements.length === 0 ? (
                <p className="text-sm text-muted-foreground">You haven't posted any requirements yet.</p>
              ) : (
                <div className="space-y-4">
                  {myRequirements.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-growth rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium capitalize">{req.crop} - {req.quantityTons} tons</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <DollarSign className="w-3 h-3" />
                            {req.priceRange}
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
                          Posted {new Date(req.postedDateISO).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuyerPortal;