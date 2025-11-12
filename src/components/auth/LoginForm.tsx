
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { LogIn, Bug } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ValidationAlert from '@/components/prompt-config/ValidationAlert';
import { useDevMode } from '@/hooks/useDevMode';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginFormProps {
  switchToReset: () => void;
}

const LoginForm = ({ switchToReset }: LoginFormProps) => {
  const navigate = useNavigate();
  const { settings } = useDevMode();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Pre-fill credentials if dev mode is enabled
  useEffect(() => {
    if (settings.enabled && settings.testEmail) {
      setEmail(settings.testEmail);
      setPassword(settings.testPassword);
    }
  }, [settings.enabled, settings.testEmail, settings.testPassword]);

  // Auto-login if enabled
  useEffect(() => {
    if (settings.enabled && settings.autoLogin && settings.testEmail && settings.testPassword) {
      handleSignIn(new Event('submit') as any);
    }
  }, []); // Only run on mount

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
      console.log('Attempting to sign in with Supabase...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase auth error:', error);
        setValidationError(error.message);
        toast.error(`Login error: ${error.message}`);
        return;
      }

      if (data.user) {
        console.log('Successfully signed in:', data.user.email);
        toast.success('Successfully signed in!');
        navigate('/analyze');
      } else {
        setValidationError('No user returned after successful login');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      setValidationError(`An unexpected error occurred: ${error.message || 'Please try again.'}`);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {settings.enabled && (
          <Alert className="mb-4 bg-orange-50/50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900">
            <Bug className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <AlertDescription className="text-sm">
              Development mode active. Credentials pre-filled for testing.
            </AlertDescription>
          </Alert>
        )}
        <ValidationAlert validationError={validationError} />
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
                  switchToReset();
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
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={loading}
          >
            <LogIn className="mr-2 h-4 w-4" />
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
