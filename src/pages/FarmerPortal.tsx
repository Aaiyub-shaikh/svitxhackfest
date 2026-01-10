import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Thermometer, Droplets, Eye, Calendar, Sprout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchWeather } from '@/services/weather';
import { useAuth } from '@/hooks/useAuth';
import StreamlitEmbed from '@/components/StreamlitEmbed';
import { AuthForm } from '@/components/AuthForm';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { generateIrrigationSchedule, IrrigationEvent, CropType } from '@/lib/irrigation';
import { getAllRequirements, BuyerRequirement } from '@/services/marketplace';

type SimpleWeather = {
  city: string;
  country?: string;
  temperatureC: number;
  humidity: number;
  description: string;
  windKph: number;
  rainNext24hMm: number;
};

const FarmerPortal = () => {
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Force re-render when user state changes or route changes
  useEffect(() => {
    // This ensures the component re-renders when navigating to this route
  }, [user, location.pathname]);

  // Fetch buyer requirements for farmers (read-only)
  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const items = await getAllRequirements();
          setBuyerNeeds(items);
        } catch (err) {
          console.error('Failed to load buyer needs', err);
        }
      })();
    }
  }, [user]);

  // Weather state (sample data)
  const [city, setCity] = useState<string>('Vadodara, IN');
  const [weather, setWeather] = useState<SimpleWeather>({
    city: 'Vadodara',
    country: 'IN',
    temperatureC: 30,
    humidity: 65,
    description: 'Partly cloudy',
    windKph: 12,
    rainNext24hMm: 8,
  });

  // Irrigation form state
  const [cropType, setCropType] = useState<CropType | ''>('');
  const [sowingDate, setSowingDate] = useState<string>('');
  const [landSize, setLandSize] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [smsEnabled, setSmsEnabled] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<IrrigationEvent[]>([]);
  const [buyerNeeds, setBuyerNeeds] = useState<BuyerRequirement[]>([]);

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



  const handleIrrigationSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const acres = parseFloat(landSize || '0') || 0;
    if (!cropType || !sowingDate || acres <= 0) {
      toast({
        title: 'Missing details',
        description: 'Please fill Crop Type, Sowing Date, and Land Size',
        variant: 'destructive',
      });
      return;
    }
    const events = generateIrrigationSchedule(cropType as CropType, sowingDate, acres, weather?.rainNext24hMm);
    setSchedule(events);
    toast({
      title: 'Irrigation schedule generated',
      description: smsEnabled ? 'SMS alerts enabled' : 'Schedule generated successfully',
    });
  };

  const loadWeather = () => {
    (async () => {
      // Map some common city names to lat/lon. For other cities default to Vadodara.
      const map: Record<string, { lat: number; lon: number }> = {
        'vadodara': { lat: 22.3072, lon: 73.1812 },
        'mumbai': { lat: 19.07598, lon: 72.87766 },
        'delhi': { lat: 28.7041, lon: 77.1025 },
        'ahmedabad': { lat: 23.0225, lon: 72.5714 },
      };
      const key = city.split(',')[0].trim().toLowerCase();
      const coords = map[key] || map['vadodara'];
      try {
        const res = await fetchWeather(coords.lat, coords.lon);
        // res: temperature, humidity, rain_probability (percent), short_forecast
        const rainMm = Math.round((res.rain_probability || 0) * 0.1); // crude conversion for display
        setWeather({
          city: city.split(',')[0].trim(),
          country: city.split(',')[1]?.trim() || 'IN',
          temperatureC: res.temperature ?? weather.temperatureC,
          humidity: res.humidity ?? weather.humidity,
          description: res.short_forecast || weather.description,
          windKph: weather.windKph,
          rainNext24hMm: rainMm,
        });
        toast({ title: 'Weather updated', description: 'Using live or sample data' });
      } catch (err: any) {
        console.error('Weather fetch failed', err);
        toast({ title: 'Weather fetch failed', description: String(err), variant: 'destructive' });
      }
    })();
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
        userType="farmer"
        title="Farmer Portal"
        description="Access AI-powered farming insights and tools"
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Farmer Dashboard</h1>
          <p className="text-muted-foreground text-lg">Monitor your fields and get AI-powered farming insights</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="text-primary border-primary hover:bg-primary/10 hover-lift"
        >
          Logout
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">IoT Dashboard</TabsTrigger>
          <TabsTrigger value="disease">Disease Detection</TabsTrigger>
          <TabsTrigger value="irrigation">Smart Irrigation</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Live IoT Dashboard</CardTitle>
              <CardDescription>Real-time sensor data and ML-based crop recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: '800px', border: 'none', overflow: 'auto' }}>
                <iframe 
                  src="/iot-dashboard.html"
                  width="100%"
                  height="100%"
                  style={{ border: 'none', minHeight: '800px' }}
                  title="IoT Dashboard"
                />
              </div>
            </CardContent>
          </Card>

          {/* Buyer Requirements for farmers (read-only) */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Buyer Requirements</CardTitle>
              <CardDescription>Recent buyer needs submitted (read-only)</CardDescription>
            </CardHeader>
            <CardContent>
              {buyerNeeds.length === 0 ? (
                <p className="text-sm text-muted-foreground">No buyer requirements available.</p>
              ) : (
                <div className="space-y-4">
                  {buyerNeeds.map((req) => (
                    <div key={req.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-growth rounded-lg flex items-center justify-center">
                            <Thermometer className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium capitalize">{req.crop} - {req.quantityTons} tons</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="font-medium">{req.priceRange}</span>
                              <span className="ml-2">{req.location}</span>
                            </p>
                            {req.description && (
                              <p className="text-sm mt-2 text-muted-foreground">"{req.description}"</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">Posted {new Date(req.postedDateISO).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          <Badge variant={'default'}>Open</Badge>
                          <div className="text-right">
                            <p className="text-sm font-medium">{req.buyerName}</p>
                            {req.contactPhone && (
                              <div className="mt-1 flex items-center gap-2">
                                <Button asChild size="sm" variant="outline">
                                  <a href={`tel:${req.contactPhone}`}>Call</a>
                                </Button>
                                <Button asChild size="sm" variant="outline">
                                  <a href={`mailto:${req.email || ''}`}>Email</a>
                                </Button>
                              </div>
                            )}
                            {!req.contactPhone && req.email && (
                              <div className="mt-1">
                                <Button asChild size="sm" variant="outline">
                                  <a href={`mailto:${req.email}`}>Email</a>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </TabsContent>

        {/* Weather Forecast & Rainfall Prediction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Weather Forecast & Rainfall Prediction</CardTitle>
              <CardDescription>Sample weather and forecast data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City, Country (e.g., Mumbai, IN)"
                  className="flex-1"
                />
                <Button onClick={loadWeather} variant="outline">
                  Update
                </Button>
              </div>


              {weather && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold">{weather.city}{weather.country ? `, ${weather.country}` : ''}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Temp</p>
                    <p className="font-semibold text-primary">{weather.temperatureC}°C</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Humidity</p>
                    <p className="font-semibold">{weather.humidity}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Wind</p>
                    <p className="font-semibold">{weather.windKph} kph</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 col-span-2">
                    <p className="text-xs text-muted-foreground">Conditions</p>
                    <p className="font-semibold capitalize">{weather.description}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-success/10">
                    <p className="text-xs text-muted-foreground">Rain (next 24h)</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-success bg-success/20">
                        {weather.rainNext24hMm} mm
                      </Badge>
                      <span className="text-sm">
                        {weather.rainNext24hMm > 5 ? 'Irrigation can be delayed' : 'Plan irrigation'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <TabsContent value="disease" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>AI Disease Detection (Streamlit)</CardTitle>
              <CardDescription>
                This section uses the connected Streamlit app for image upload and AI-based analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <a
                  href={(import.meta.env.VITE_STREAMLIT_URL as string) || 'http://localhost:8501'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  Open Streamlit in new tab
                </a>
              </div>
              <StreamlitEmbed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="irrigation" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Smart Irrigation Planning</CardTitle>
              <CardDescription>
                Generate customized irrigation schedules based on your crop type and field conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="irrigation-form" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="crop-type">Crop Type</Label>
                    <Select value={cropType} onValueChange={(v) => setCropType(v as CropType)}>
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
                    {/* Hidden field so plain JS can read crop value without using React */}
                    <input type="hidden" id="crop-type-hidden" value={cropType} />
                  </div>

                  <div>
                    <Label htmlFor="sowing-date">Sowing Date</Label>
                    <Input
                      id="sowing-date"
                      type="date"
                      value={sowingDate}
                      onChange={(e) => setSowingDate(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location (lat,lon)</Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="e.g. 28.7041,77.1025"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="land-size">Land Size (acres)</Label>
                    <Input
                      id="land-size"
                      type="number"
                      value={landSize}
                      onChange={(e) => setLandSize(e.target.value)}
                      placeholder="Enter land size"
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mt-6">
                      <Checkbox id="sms-enabled" checked={smsEnabled} onCheckedChange={(v) => setSmsEnabled(Boolean(v))} />
                      <Label htmlFor="sms-enabled">Enable SMS Alerts</Label>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="mt-1"
                      disabled={!smsEnabled}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Keep existing React handler for schedule generation, and emit an event that the plain JS listener will use for ML prediction */}
                  <Button
                    type="button"
                    id="generate-irrigation"
                    className="flex-1 bg-gradient-primary text-white shadow-primary hover:shadow-success transition-smooth hover-lift"
                    onClick={(e) => { handleIrrigationSubmit(e as unknown as Event); window.dispatchEvent(new CustomEvent('irrigation:generate')); }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Generate Irrigation Schedule
                  </Button>
                  <Button type="button" variant="outline" disabled={!smsEnabled || !phone} onClick={() => toast({ title: 'SMS Sent (simulated)', description: `Alerts to ${phone}` })}>
                    Send test SMS
                  </Button>
                </div>
              </form>

              {schedule.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold mb-3">Upcoming Irrigation Schedule</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Volume (L)</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedule.map((ev, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{new Date(ev.dateISO).toLocaleDateString()}</TableCell>
                          <TableCell className="text-primary font-medium">{ev.volumeLiters.toLocaleString()}</TableCell>
                          <TableCell>{ev.notes || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Container for ML prediction results (vanilla JS will render here) */}
              <div id="irrigation-result" className="mt-6"></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmerPortal;