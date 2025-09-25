import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Thermometer, Droplets, Eye, Calendar, AlertTriangle, Sprout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FarmerPortal = () => {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      toast({
        title: "Image uploaded successfully",
        description: "AI analysis will begin shortly...",
      });
    }
  };

  const handleIrrigationSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Irrigation schedule generated!",
      description: "Your smart irrigation plan is ready. SMS alerts activated.",
    });
  };

  const iotData = {
    temperature: 28,
    humidity: 65,
    soilMoisture: 45,
    soilType: 'Loamy',
    weather: 'Partly Cloudy',
    rainfall: '15mm expected'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Farmer Portal</h1>
        <p className="text-muted-foreground text-lg">Monitor your fields and get AI-powered farming insights</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">IoT Dashboard</TabsTrigger>
          <TabsTrigger value="disease">Disease Detection</TabsTrigger>
          <TabsTrigger value="irrigation">Smart Irrigation</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                <Thermometer className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{iotData.temperature}°C</div>
                <p className="text-xs text-muted-foreground">Optimal range: 20-30°C</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                <Droplets className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{iotData.humidity}%</div>
                <p className="text-xs text-muted-foreground">Good humidity level</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
                <Droplets className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{iotData.soilMoisture}%</div>
                <p className="text-xs text-muted-foreground">Consider irrigation soon</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Field Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Soil Type:</span>
                  <span className="font-medium">{iotData.soilType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weather:</span>
                  <span className="font-medium">{iotData.weather}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rainfall:</span>
                  <span className="font-medium text-primary">{iotData.rainfall}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-success" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-success/10 rounded-lg">
                  <p className="text-sm text-success-foreground">
                    ✓ Temperature and humidity are optimal for crop growth
                  </p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <p className="text-sm text-warning-foreground">
                    ⚠ Soil moisture is decreasing. Plan irrigation within 2 days
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary">
                    📊 Expected rainfall will help maintain moisture levels
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="disease" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>AI Disease Detection</CardTitle>
              <CardDescription>
                Upload crop images for instant AI-based disease analysis and treatment recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="crop-image">Upload Crop Image</Label>
                <Input
                  id="crop-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-2"
                />
              </div>

              {imageFile && (
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold mb-2">Uploaded: {imageFile.name}</h3>
                    <div className="bg-gradient-growth h-2 rounded-full animate-pulse">
                      <div className="bg-white h-2 rounded-full w-1/3"></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Analyzing image...</p>
                  </div>

                  <Card className="bg-success/5 border-success/20">
                    <CardHeader>
                      <CardTitle className="text-success flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        AI Analysis Result
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p><strong>Detection:</strong> Healthy crop detected</p>
                        <p><strong>Confidence:</strong> 94%</p>
                        <p><strong>Recommendation:</strong> Continue current care routine. Monitor for any changes in leaf color or texture.</p>
                        <div className="p-3 bg-success/10 rounded-lg">
                          <p className="text-sm text-success">
                            ✓ No immediate treatment required. Keep monitoring regularly.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
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
              <form onSubmit={handleIrrigationSubmit} className="space-y-6">
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
                    <Label htmlFor="sowing-date">Sowing Date</Label>
                    <Input
                      id="sowing-date"
                      type="date"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="land-size">Land Size (acres)</Label>
                    <Input
                      id="land-size"
                      type="number"
                      placeholder="Enter land size"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone for SMS Alerts</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className="mt-2"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-growth text-white shadow-success">
                  <Calendar className="w-4 h-4 mr-2" />
                  Generate Irrigation Schedule
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmerPortal;