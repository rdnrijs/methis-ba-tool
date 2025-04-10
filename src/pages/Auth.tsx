
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from "sonner";
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('login');

  // Check for password reset or email confirmation params
  useEffect(() => {
    const reset = searchParams.get('reset');
    const type = searchParams.get('type');
    
    if (reset === 'true') {
      setActiveTab('reset');
      toast.info('You can now reset your password');
    } else if (type === 'recovery') {
      setActiveTab('reset');
      toast.info('You can now reset your password');
    } else if (type === 'signup') {
      toast.success('Email confirmed! You can now sign in');
      setActiveTab('login');
    }
  }, [searchParams]);

  const handleSwitchToReset = () => {
    setActiveTab('reset');
  };

  const handleSwitchToLogin = () => {
    setActiveTab('login');
  };

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
