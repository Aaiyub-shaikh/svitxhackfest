import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Phone, Mail, MapPin, Calendar, DollarSign, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllRequirements } from '@/services/marketplace';

const Marketplace = () => {
  const { toast } = useToast();

  const staticRequirements = [
    {
      id: 1,
      buyer: 'AgriCorp Ltd.',
      crop: 'Rice',
      quantity: '100 tons',
      priceRange: '₹20,000 - ₹22,000',
      location: 'Punjab',
      deadline: '2024-10-15',
      contact: '+91 98765 43210',
      email: 'procurement@agricorp.com',
      description: 'Premium basmati rice required. Organic certification preferred.',
      status: 'Active',
      postedDate: '2024-09-20'
    },
    {
      id: 2,
      buyer: 'FreshMart Distributors',
      crop: 'Tomato',
      quantity: '25 tons',
      priceRange: '₹15,000 - ₹18,000',
      location: 'Maharashtra',
      deadline: '2024-10-10',
      contact: '+91 87654 32109',
      email: 'sourcing@freshmart.com',
      description: 'Fresh tomatoes for retail distribution. Quality grade A required.',
      status: 'Active',
      postedDate: '2024-09-22'
    },
    {
      id: 3,
      buyer: 'Global Foods Inc.',
      crop: 'Wheat',
      quantity: '200 tons',
      priceRange: '₹24,000 - ₹26,000',
      location: 'Haryana',
      deadline: '2024-11-01',
      contact: '+91 76543 21098',
      email: 'buy@globalfoods.com',
      description: 'High protein wheat for export. Moisture content below 12%.',
      status: 'Active',
      postedDate: '2024-09-18'
    },
    {
      id: 4,
      buyer: 'Organic Harvest Co.',
      crop: 'Cotton',
      quantity: '75 tons',
      priceRange: '₹45,000 - ₹50,000',
      location: 'Gujarat',
      deadline: '2024-10-25',
      contact: '+91 65432 10987',
      email: 'organic@harvest.com',
      description: 'Certified organic cotton for textile manufacturing.',
      status: 'Active',
      postedDate: '2024-09-25'
    }
  ];

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const dynamic = getAllRequirements().map(r => ({
      id: r.id,
      buyer: r.buyerName,
      crop: r.crop,
      quantity: `${r.quantityTons} tons`,
      priceRange: r.priceRange,
      location: r.location,
      deadline: r.deliveryDateISO,
      contact: r.contactPhone,
      email: r.email || '',
      description: r.description || '',
      status: r.status,
      postedDate: r.postedDateISO,
    }));
    setItems([...dynamic, ...staticRequirements]);
  }, []);

  const handleContact = (contact: string, method: 'phone' | 'email') => {
    if (method === 'phone') {
      toast({
        title: "Contact Information",
        description: `Call: ${contact}`,
      });
    } else {
      toast({
        title: "Contact Information",
        description: `Email: ${contact}`,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Buyer-Farmer Marketplace</h1>
        <p className="text-muted-foreground text-lg">Connect directly with buyers looking for your crops</p>
      </div>

      {/* Search and Filter Section */}
      <Card className="shadow-card mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Search Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input placeholder="Search by crop name..." className="w-full" />
            </div>
            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Crop Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="corn">Corn</SelectItem>
                  <SelectItem value="tomato">Tomato</SelectItem>
                  <SelectItem value="cotton">Cotton</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="haryana">Haryana</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button className="w-full bg-gradient-growth text-white">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Active Buyer Requirements</h2>
          <Badge variant="secondary" className="text-sm">
            {items.length} requirements found
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {items.map((requirement) => (
            <Card key={requirement.id} className="shadow-card hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-growth rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-white" />
                      </div>
                      {requirement.buyer}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Posted on {new Date(requirement.postedDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="bg-success text-success-foreground">
                    {requirement.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Crop Type</p>
                        <p className="text-lg font-semibold text-primary">{requirement.crop}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                        <p className="text-lg font-semibold">{requirement.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Price Range</p>
                        <p className="text-lg font-semibold text-accent">{requirement.priceRange}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                        <p className="text-lg font-semibold flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {requirement.location}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                      <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">
                        {requirement.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Deadline: {new Date(requirement.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">Contact Information</p>
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleContact(requirement.contact, 'phone')}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          {requirement.contact}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleContact(requirement.email, 'email')}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {requirement.email}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full bg-gradient-growth text-white shadow-success">
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Buyer
                      </Button>
                      <Button variant="outline" className="w-full">
                        <DollarSign className="w-4 h-4 mr-2" />
                        View Full Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Information Section */}
      <Card className="shadow-card mt-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-growth rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">1. Browse Requirements</h3>
              <p className="text-sm text-muted-foreground">
                Search and filter buyer requirements based on your crop type and location
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-growth rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">2. Contact Buyers</h3>
              <p className="text-sm text-muted-foreground">
                Connect directly with buyers through phone or email to discuss your offer
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-growth rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">3. Close Deals</h3>
              <p className="text-sm text-muted-foreground">
                Negotiate prices and finalize crop sales directly with buyers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Marketplace;