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
import { useAuth } from '@/hooks/useAuth';
import { predictDisease } from '@/integrations/ml/api';
import type { PredictionResponse } from '@/integrations/ml/types';
import StreamlitEmbed from '@/components/StreamlitEmbed';
import { AuthForm } from '@/components/AuthForm';

const FarmerPortal = () => {
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<PredictionResponse | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setAnalysis(null);
      toast({
        title: "Image uploaded",
        description: "Running disease detection...",
      });
      await analyzeImage(file);
    }
  };

  const analyzeImage = async (file: File) => {
    try {
      setAnalysisLoading(true);
      const result = await predictDisease(file);
      setAnalysis(result);
      const pretty = result.predicted_label.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
      toast({
        title: "Analysis complete",
        description: `Detected: ${pretty}`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Analysis failed",
        description: err?.message || "Unable to analyze the image",
        variant: "destructive",
      });
    } finally {
      setAnalysisLoading(false);
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
                    {analysisLoading ? (
                      <>
                        <div className="bg-gradient-growth h-2 rounded-full animate-pulse">
                          <div className="bg-white h-2 rounded-full w-1/3"></div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">Analyzing image...</p>
                      </>
                    ) : analysis ? (
                      <p className="text-sm text-success mt-2">Analysis complete</p>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">Ready</p>
                    )}
                  </div>

                  {analysis && (
                    <Card className="bg-success/5 border-success/20">
                      <CardHeader>
                        <CardTitle className="text-success flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          AI Analysis Result
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-lg font-semibold">
                              Detection: {analysis.predicted_label.replace(/_/g, ' ').replace(/\s+/g, ' ').trim()}
                            </p>
                            {analysis.topk && (
                              <p className="text-sm text-muted-foreground">
                                Top predictions: {analysis.topk.map(t => `${t.label.split('_').join(' ')} (${(t.confidence*100).toFixed(1)}%)`).join(', ')}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium mb-1">Description</p>
                              <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">
                                {analysis.info.description}
                              </p>
                              <p className="font-medium mt-4 mb-1">Symptoms</p>
                              <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">
                                {analysis.info.symptoms}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium mb-1">Recommendations</p>
                              <ul className="list-disc list-inside text-sm bg-muted/50 p-3 rounded-lg space-y-1">
                                {analysis.info.recommendations.map((rec, i) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                              <p className="font-medium mt-4 mb-1">Pesticides</p>
                              <ul className="list-disc list-inside text-sm bg-muted/50 p-3 rounded-lg space-y-1">
                                {analysis.info.pesticides.map((p, i) => (
                                  <li key={i}>{p}</li>
                                ))}
                              </ul>
                              <div className="p-3 bg-success/10 rounded-lg mt-4">
                                <p className="text-sm text-success">
                                  Organic: {analysis.info.organic_treatment}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Full Streamlit app embedded (uses VITE_STREAMLIT_URL) */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Prefer the full Streamlit interface? It’s embedded below. You can also open it directly in a new tab.
                </p>
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
              </div>
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

                <Button type="submit" className="w-full bg-gradient-primary text-white shadow-primary hover:shadow-success transition-smooth hover-lift">
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