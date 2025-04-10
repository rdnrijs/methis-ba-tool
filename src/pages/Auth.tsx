
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [isProcessing, setIsProcessing] = useState(false);

  // Process the URL parameters for authentication flows
  useEffect(() => {
    const processAuthParams = async () => {
      try {
        // Check URL for token (email confirmation or password reset)
        const reset = searchParams.get('reset') === 'true';
        const type = searchParams.get('type');
        
        // Check for hash fragment which contains access token on email confirmation
        const hash = window.location.hash;
        
        if (hash && hash.includes('access_token')) {
          setIsProcessing(true);
          console.log('Detected access token in URL, processing email confirmation');
          
          // Extract the token - works with Supabase's hash format
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          
          if (accessToken) {
            // The supabase client will automatically handle the session
            const { error } = await supabase.auth.getUser(accessToken);
            
            if (error) {
              console.error('Error verifying email:', error);
              toast.error('Failed to verify email: ' + error.message);
            } else {
              toast.success('Email verified successfully! You can now sign in');
              setActiveTab('login');
            }
          }
          setIsProcessing(false);
        } else if (reset || type === 'recovery') {
          setActiveTab('reset');
          toast.info('You can now reset your password');
        } else if (type === 'signup') {
          toast.success('Email confirmation sent! Please check your inbox');
          setActiveTab('login');
        }
      } catch (error) {
        console.error('Error processing auth params:', error);
        setIsProcessing(false);
      }
    };

    processAuthParams();
  }, [searchParams, navigate]);

  const handleSwitchToReset = () => {
    setActiveTab('reset');
  };

  const handleSwitchToLogin = () => {
    setActiveTab('login');
  };

  if (isProcessing) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Verifying your email...</h2>
            <p className="text-muted-foreground">Please wait while we verify your account.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Welcome to Methis BA Tool</h1>
            <p className="mt-2 text-muted-foreground">Sign in or create an account</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm switchToReset={handleSwitchToReset} />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignupForm switchToLogin={handleSwitchToLogin} />
            </TabsContent>
            
            <TabsContent value="reset" id="reset-tab">
              <ResetPasswordForm switchToLogin={handleSwitchToLogin} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
