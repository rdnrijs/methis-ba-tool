
import Layout from '@/components/Layout';
import APIKeyForm from '@/components/APIKeyForm';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getSelectedProvider } from '@/utils/storageUtils';

const APIConfig = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState<'openai' | 'google'>(getSelectedProvider() as 'openai' | 'google');
  
  const handleApiConfigured = () => {
    navigate('/analyze');
  };
  
  const handleProviderChange = (value: string) => {
    setProvider(value as 'openai' | 'google');
  };
  
  return (
    <Layout>
      <div className="container max-w-2xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">AI Provider Configuration</h1>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select AI Provider</h2>
            
            <RadioGroup 
              defaultValue={provider} 
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
          
          <div className="p-4 border rounded-lg">
            <APIKeyForm 
              provider={provider}
              onConfigured={handleApiConfigured} 
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default APIConfig;
