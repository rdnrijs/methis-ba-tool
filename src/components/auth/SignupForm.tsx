
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { UserPlus, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ValidationAlert from '@/components/prompt-config/ValidationAlert';

interface SignupFormProps {
  switchToLogin: () => void;
}

const SignupForm = ({ switchToLogin }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Handle sign up with email and password
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSignupSuccess(false);
    
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
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        }
      });

      if (error) {
        setValidationError(error.message);
        return;
      }

      if (data.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          setValidationError('This email is already registered. Please sign in instead.');
          return;
        }
        
        setSignupSuccess(true);
        console.log('User created:', data.user);
        
        if (data.user.confirmed_at) {
          // User is already confirmed (if email confirmation is disabled in Supabase)
          toast.success('Account created successfully! You can now sign in');
        } else {
          // User needs to confirm email
          toast.info('Please check your email to confirm your registration');
        }
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setValidationError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ValidationAlert validationError={validationError} />
        {signupSuccess ? (
          <div className="p-4 text-center space-y-4">
            <h3 className="font-medium text-lg">Account Created Successfully!</h3>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Verification Required</AlertTitle>
              <AlertDescription>
                Please check your email and click the confirmation link to complete your registration.
                <p className="mt-2 text-sm text-muted-foreground">
                  If you don't see the email, be sure to check your spam folder.
                </p>
              </AlertDescription>
            </Alert>
            <Button 
              onClick={switchToLogin}
              className="mt-4"
            >
              Proceed to Login
            </Button>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};

export default SignupForm;
