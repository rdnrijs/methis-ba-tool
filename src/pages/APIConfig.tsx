
import Layout from '@/components/Layout';
import APIKeyForm from '@/components/APIKeyForm';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getSelectedProvider } from '@/utils/storageUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">AI Provider Configuration</CardTitle>
            <CardDescription>
              Select your preferred AI provider and enter your API key to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select AI Provider</h3>
              
              <RadioGroup 
                value={provider}
                className="grid grid-cols-2 gap-4"
                onValueChange={handleProviderChange}
              >
                <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="openai" id="openai" />
                  <Label htmlFor="openai" className="cursor-pointer font-medium">OpenAI</Label>
                </div>
                
                <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="google" id="google" />
                  <Label htmlFor="google" className="cursor-pointer font-medium">Google Gemini</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Enter API Key</h3>
              <div className="p-4 border rounded-lg bg-muted/20">
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
