import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { LogIn } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ValidationAlert from '@/components/prompt-config/ValidationAlert';

interface LoginFormProps {
  switchToReset: () => void;
}

const LoginForm = ({ switchToReset }: LoginFormProps) => {
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

  return (
    <Card>
      <CardContent className="pt-6">
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
