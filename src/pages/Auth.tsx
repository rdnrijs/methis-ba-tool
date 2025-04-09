
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import Layout from '@/components/Layout';
import ValidationAlert from '@/components/prompt-config/ValidationAlert';
import { UserPlus, LogIn, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Handle sign in with email and password
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    if (!email || !password) {
      setValidationError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setValidationError(error.message);
        return;
      }

      if (data.user) {
        toast.success('Successfully signed in!');
        navigate('/analyze');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setValidationError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle sign up with email and password
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    if (!email || !password) {
      setValidationError('Please enter both email and password');
      return;
    }
    
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setValidationError(error.message);
        return;
      }

      if (data.user) {
        toast.success('Account created successfully! Please check your email to confirm your registration.');
        // Don't navigate yet, wait for email confirmation
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setValidationError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset email
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    if (!email) {
      setValidationError('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) {
        setValidationError(error.message);
        return;
      }

      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      console.error('Error resetting password:', error);
      setValidationError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Welcome to Methis BA Tool</h1>
            <p className="mt-2 text-muted-foreground">Sign in or create an account</p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <ValidationAlert validationError={validationError} />
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email" 
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const resetTab = document.getElementById('reset-tab');
                            if (resetTab) resetTab.click();
                          }}
                          className="text-sm text-blue-500 hover:text-blue-700"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loading}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Enter your details to create a new account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email" 
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Password must be at least 6 characters
                      </p>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loading}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reset" id="reset-tab">
              <Card>
                <CardHeader>
                  <CardTitle>Reset Password</CardTitle>
                  <CardDescription>
                    Enter your email to receive password reset instructions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <Input
                        id="reset-email"
                        type="email" 
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loading}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      {loading ? 'Sending...' : 'Send Reset Instructions'}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const loginTab = document.getElementById('login-tab');
                      if (loginTab) loginTab.click();
                    }}
                  >
                    Back to Login
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
