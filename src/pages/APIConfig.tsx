
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
      <div className="container max-w-3xl mx-auto py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold">AI Provider Configuration</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Configure your AI provider to start analyzing requirements
          </p>
        </div>
        
        <Card className="border-2 shadow-lg overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 p-8 border-b">
            <div className="flex items-center gap-5">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                <Key className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Provider Setup</h2>
                <p className="text-muted-foreground mt-1 text-base">
                  Select a provider and enter your API key
                </p>
              </div>
            </div>
          </div>
          
          <CardContent className="p-10 space-y-10">
            <div className="space-y-6">
              <h3 className="text-xl font-medium flex items-center gap-3">
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 w-7 h-7 rounded-full inline-flex items-center justify-center text-sm font-bold">1</span>
                Select AI Provider
              </h3>
              
              <RadioGroup 
                value={provider}
                className="grid grid-cols-2 gap-6"
                onValueChange={handleProviderChange}
              >
                <div className={`flex items-center space-x-3 border-2 p-6 rounded-xl cursor-pointer transition-all duration-200 ${provider === 'openai' ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800' : 'hover:border-red-200 hover:bg-red-50/50 dark:hover:bg-red-900/10 dark:hover:border-red-900'}`}>
                  <RadioGroupItem value="openai" id="openai" />
                  <Label htmlFor="openai" className="cursor-pointer font-medium">OpenAI</Label>
                </div>
                
                <div className={`flex items-center space-x-3 border-2 p-6 rounded-xl cursor-pointer transition-all duration-200 ${provider === 'google' ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800' : 'hover:border-red-200 hover:bg-red-50/50 dark:hover:bg-red-900/10 dark:hover:border-red-900'}`}>
                  <RadioGroupItem value="google" id="google" />
                  <Label htmlFor="google" className="cursor-pointer font-medium">Google Gemini</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="border-t pt-8 space-y-6">
              <h3 className="text-xl font-medium flex items-center gap-3 mt-2">
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 w-7 h-7 rounded-full inline-flex items-center justify-center text-sm font-bold">2</span>
                Configure API Key
              </h3>
              
              <div className="bg-muted/10 rounded-xl border p-6">
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
