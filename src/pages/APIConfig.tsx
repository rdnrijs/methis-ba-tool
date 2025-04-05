
import Layout from '@/components/Layout';
import APIKeyForm from '@/components/APIKeyForm';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getSelectedProvider } from '@/utils/storageUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Key } from 'lucide-react';

const APIConfig = () => {
  const navigate = useNavigate();
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
      <div className="container max-w-2xl mx-auto py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">AI Provider Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Configure your AI provider to start analyzing requirements
          </p>
        </div>
        
        <Card className="border-2 shadow-md overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                <Key className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Provider Setup</h2>
                <p className="text-sm text-muted-foreground">
                  Select a provider and enter your API key
                </p>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 w-6 h-6 rounded-full inline-flex items-center justify-center text-sm font-bold">1</span>
                Select AI Provider
              </h3>
              
              <RadioGroup 
                value={provider}
                className="grid grid-cols-2 gap-4"
                onValueChange={handleProviderChange}
              >
                <div className={`flex items-center space-x-2 border-2 p-4 rounded-lg cursor-pointer transition-all duration-200 ${provider === 'openai' ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800' : 'hover:border-red-200 hover:bg-red-50/50 dark:hover:bg-red-900/10 dark:hover:border-red-900'}`}>
                  <RadioGroupItem value="openai" id="openai" />
                  <Label htmlFor="openai" className="cursor-pointer font-medium">OpenAI</Label>
                </div>
                
                <div className={`flex items-center space-x-2 border-2 p-4 rounded-lg cursor-pointer transition-all duration-200 ${provider === 'google' ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800' : 'hover:border-red-200 hover:bg-red-50/50 dark:hover:bg-red-900/10 dark:hover:border-red-900'}`}>
                  <RadioGroupItem value="google" id="google" />
                  <Label htmlFor="google" className="cursor-pointer font-medium">Google Gemini</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 w-6 h-6 rounded-full inline-flex items-center justify-center text-sm font-bold">2</span>
                Configure API Key
              </h3>
              
              <div className="bg-muted/20 rounded-lg border overflow-hidden">
                <APIKeyForm 
                  provider={provider}
                  onConfigured={handleApiConfigured} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default APIConfig;
