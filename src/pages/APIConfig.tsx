
import Layout from '@/components/Layout';
import APIKeyForm from '@/components/APIKeyForm';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getSelectedProvider } from '@/utils/storageUtils';
import { Card, CardContent } from "@/components/ui/card";
import { Key, Bug } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useDevMode } from "@/hooks/useDevMode";
import { Alert, AlertDescription } from "@/components/ui/alert";

const APIConfig = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, resetSettings } = useDevMode();
  const [provider, setProvider] = useState<'openai' | 'google'>(
    getSelectedProvider() as 'openai' | 'google' || 'openai'
  );
  
  const handleApiConfigured = () => {
    navigate('/analyze');
  };
  
  const handleProviderChange = (value: string) => {
    setProvider(value as 'openai' | 'google');
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">AI Provider Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Configure your AI provider to start analyzing requirements
          </p>
        </div>
        
        <Card className="border shadow-sm overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 p-6 border-b">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-2.5 rounded-full">
                <Key className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Provider Setup</h2>
                <p className="text-muted-foreground text-sm mt-0.5">
                  Select a provider and enter your API key
                </p>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-base font-medium flex items-center gap-2.5">
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 w-6 h-6 rounded-full inline-flex items-center justify-center text-sm font-bold">1</span>
                Select AI Provider
              </h3>
              
              <RadioGroup 
                value={provider}
                className="grid grid-cols-2 gap-4"
                onValueChange={handleProviderChange}
              >
                <div className={`flex items-center space-x-2 border p-4 rounded-lg cursor-pointer transition-all duration-200 ${provider === 'openai' ? 'border-red-300 bg-red-50/70 dark:bg-red-900/10 dark:border-red-800' : 'hover:border-red-200 hover:bg-red-50/50 dark:hover:bg-red-900/5 dark:hover:border-red-900'}`}>
                  <RadioGroupItem value="openai" id="openai" />
                  <Label htmlFor="openai" className="cursor-pointer text-sm">OpenAI</Label>
                </div>
                
                <div className={`flex items-center space-x-2 border p-4 rounded-lg cursor-pointer transition-all duration-200 ${provider === 'google' ? 'border-red-300 bg-red-50/70 dark:bg-red-900/10 dark:border-red-800' : 'hover:border-red-200 hover:bg-red-50/50 dark:hover:bg-red-900/5 dark:hover:border-red-900'}`}>
                  <RadioGroupItem value="google" id="google" />
                  <Label htmlFor="google" className="cursor-pointer text-sm">Google Gemini</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-base font-medium flex items-center gap-2.5">
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 w-6 h-6 rounded-full inline-flex items-center justify-center text-sm font-bold">2</span>
                Configure API Key
              </h3>
              
              <div className="bg-muted/5 rounded-lg border p-5">
                <APIKeyForm 
                  provider={provider}
                  onConfigured={handleApiConfigured} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm mt-6 animate-fade-in">
          <div className="bg-gradient-to-r from-orange-50 to-amber-100 dark:from-orange-950/20 dark:to-amber-900/20 p-6 border-b">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-full">
                <Bug className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Development Mode</h2>
                <p className="text-muted-foreground text-sm mt-0.5">
                  Testing and debugging features for development
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            <Alert className="bg-orange-50/50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900">
              <Bug className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <AlertDescription className="text-sm">
                Development mode features are for testing only. Do not use in production.
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dev-mode" className="text-base">Enable Development Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Activate testing features and auto-login
                </p>
              </div>
              <Switch
                id="dev-mode"
                checked={settings.enabled}
                onCheckedChange={(checked) => updateSettings({ enabled: checked })}
              />
            </div>

            {settings.enabled && (
              <div className="border-t pt-6 space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-login" className="text-base">Auto-Login on Page Load</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically sign in when visiting the login page
                    </p>
                  </div>
                  <Switch
                    id="auto-login"
                    checked={settings.autoLogin}
                    onCheckedChange={(checked) => updateSettings({ autoLogin: checked })}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-email">Test Email</Label>
                    <Input
                      id="test-email"
                      type="email"
                      placeholder="test@example.com"
                      value={settings.testEmail}
                      onChange={(e) => updateSettings({ testEmail: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-password">Test Password</Label>
                    <Input
                      id="test-password"
                      type="password"
                      placeholder="Enter test password"
                      value={settings.testPassword}
                      onChange={(e) => updateSettings({ testPassword: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Password is stored in browser localStorage for convenience
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default APIConfig;
