import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Update logged in state when auth context changes
    setIsLoggedIn(!!user);
  }, [user]);
  
  const handleLoginSuccess = () => {
    navigate('/analyze');
  };
  
  const handleStartClick = async () => {
    if (isLoggedIn) {
      navigate('/analyze');
    } else {
      // Scroll to login form
      document.getElementById('login-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <Layout>
      <div className="flex flex-col min-h-[80vh]">
        {/* Hero Section */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between py-10 gap-8">
          {/* Left column - Hero text */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
              Transform Client Requests into AI-powered Requirements
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Accelerate business analysis with Methis's AI-powered requirements 
              tool—built by consultants, for consultants. At Methis, we understand 
              the unique challenges and language of your industry. This BA tool 
              rapidly transforms complex client requests into clear, structured 
              requirements, significantly shortening analysis cycles and enabling 
              faster, more accurate project execution.
            </p>
            <Button size="lg" onClick={handleStartClick} className="gap-2 px-8 py-6 text-lg bg-red-600 hover:bg-red-700">
              Start Analyzing
              <ArrowRight className="ml-1" />
            </Button>
          </div>

          {/* Right column - Login form or Welcome message */}
          <div id="login-form-section" className="flex-1 w-full max-w-md">
            {isLoggedIn ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold">Welcome back!</h2>
                    <p className="text-muted-foreground">
                      You're currently signed in as <span className="font-medium">{user?.email}</span>
                    </p>
                    <Button 
                      onClick={() => navigate('/analyze')} 
                      className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Go to Analysis Tool
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="bg-red-100 dark:bg-red-900/30 p-2.5 rounded-full inline-flex mb-4">
                  <ArrowRight className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold mb-4">Sign in to Methis BA Tool</h2>
                <LoginForm switchToReset={() => navigate('/auth?reset=true')} />
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Button variant="link" onClick={() => navigate('/auth')} className="p-0 text-red-600 hover:text-red-700">
                      Sign up here
                    </Button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
