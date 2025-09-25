import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Users, ShoppingCart, Bot, TrendingUp, Shield, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-farming.jpg';

const Index = () => {
  const features = [
    {
      icon: Leaf,
      title: 'IoT Data Dashboard',
      description: 'Real-time field monitoring with soil, temperature, and weather data',
      link: '/farmer'
    },
    {
      icon: Shield,
      title: 'Disease Detection',
      description: 'AI-powered crop disease identification with treatment recommendations',
      link: '/farmer'
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Voice-enabled farming assistant in multiple Indian languages',
      link: '/assistant'
    },
    {
      icon: Zap,
      title: 'Smart Irrigation',
      description: 'Automated irrigation scheduling with SMS alerts',
      link: '/farmer'
    },
    {
      icon: ShoppingCart,
      title: 'Marketplace',
      description: 'Direct connection between farmers and buyers',
      link: '/marketplace'
    },
    {
      icon: TrendingUp,
      title: 'Market Intelligence',
      description: 'Real-time crop prices and market trends',
      link: '/buyer'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Smart farming with IoT technology" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-earth-sky/80"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Smart Farming
              <span className="block bg-gradient-harvest bg-clip-text text-transparent">
                Advisory Platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Empowering farmers with AI-driven insights, IoT monitoring, and direct market connections
              for sustainable and profitable agriculture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-glow">
                <Link to="/farmer" className="flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  Farmer Portal
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/buyer" className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Buyer Portal
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Complete Farming Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From field monitoring to market connections, everything you need for modern agriculture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-glow transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-growth rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground mb-4">
                      {feature.description}
                    </CardDescription>
                    <Button asChild variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Link to={feature.link} className="flex items-center gap-2">
                        Learn More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-earth-sky">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-white/80">Active Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-white/80">Registered Buyers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-white/80">Disease Detection Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30%</div>
              <div className="text-white/80">Increase in Yield</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of farmers already using our platform to increase yields and profits
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-growth text-white shadow-success">
                <Link to="/farmer" className="flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  Start as Farmer
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/marketplace" className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Explore Marketplace
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;