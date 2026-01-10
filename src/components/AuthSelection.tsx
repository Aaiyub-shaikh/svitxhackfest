import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, Users, ArrowRight, Sprout, ShoppingBag } from 'lucide-react';

export const AuthSelection = () => {
  return (
    <div className="min-h-screen bg-gradient-earth flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-primary">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Welcome to AgriSmart
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your role to access personalized farming solutions and marketplace features
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Farmer Card */}
          <Card className="shadow-primary hover-lift border-0 group">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-bounce">
                <Sprout className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-foreground mb-2">
                Farmer Portal
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Access AI-powered farming insights, IoT monitoring, and disease detection tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Real-time field monitoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>AI disease detection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Smart irrigation planning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Market price insights</span>
                </div>
              </div>
              <Button asChild className="w-full bg-gradient-success shadow-success hover:shadow-primary transition-smooth hover-lift">
                <Link to="/farmer" className="flex items-center justify-center gap-2">
                  <Leaf className="w-4 h-4" />
                  Continue as Farmer
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Buyer Card */}
          <Card className="shadow-primary hover-lift border-0 group">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-warm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-bounce">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-foreground mb-2">
                Buyer Portal
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Connect directly with farmers and source quality crops for your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Direct farmer connections</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Quality crop sourcing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Bulk order management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Market trend analysis</span>
                </div>
              </div>
              <Button asChild className="w-full bg-gradient-warm shadow-warm hover:shadow-primary transition-smooth hover-lift">
                <Link to="/buyer" className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  Continue as Buyer
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            New to AgriSmart? Create your account when you select your portal above
          </p>
        </div>
      </div>
    </div>
  );
};