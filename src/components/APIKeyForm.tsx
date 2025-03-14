
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Key, AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { storeApiKey, getApiKey, storeSelectedModel, getSelectedModel } from '@/utils/storageUtils';
import { validateApiKey, estimateCost } from '@/utils/openAIService';
import { toast } from "sonner";
import InfoCard from './ui/InfoCard';

interface APIKeyFormProps {
  onConfigured: () => void;
}

const APIKeyForm = ({ onConfigured }: APIKeyFormProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [rememberKey, setRememberKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState(getSelectedModel());
  const [estimatedCost, setEstimatedCost] = useState(0);
  
  // Check if an API key is already stored
  useEffect(() => {
    const storedKey = getApiKey();
    if (storedKey) {
      setApiKey(storedKey);
      setIsValidated(true);
    }
    
    // Set default model
    setSelectedModel(getSelectedModel());
  }, []);
  
  // Update cost estimation when model changes
  useEffect(() => {
    // Estimate based on average usage (1000 input, 500 output tokens)
    setEstimatedCost(estimateCost(1000, 500, selectedModel));
  }, [selectedModel]);
  
  const handleValidateKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }
    
    setIsValidating(true);
    
    try {
      const isValid = await validateApiKey(apiKey);
      
      if (isValid) {
        setIsValidated(true);
        storeApiKey(apiKey, rememberKey);
        storeSelectedModel(selectedModel);
        toast.success('API key validated successfully');
      } else {
        toast.error('Invalid API key. Please check and try again.');
      }
    } catch (error) {
      toast.error('Error validating API key');
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleContinue = () => {
    if (isValidated) {
      storeApiKey(apiKey, rememberKey);
      storeSelectedModel(selectedModel);
      onConfigured();
    } else {
      toast.error('Please validate your API key first');
    }
  };
  
  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    storeSelectedModel(value);
  };
  
  return (
    <div className="max-w-md w-full mx-auto">
      <InfoCard 
        title="API Configuration" 
        description="Configure your OpenAI API key to start analyzing requirements"
        icon={<Key className="h-6 w-6 text-primary" />}
        glassmorphism 
        animateIn
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setIsValidated(false);
                }}
                placeholder="sk-..."
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never sent to our servers
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">OpenAI Model</Label>
            <Select value={selectedModel} onValueChange={handleModelChange}>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o (Most capable)</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini (Balanced)</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Economical)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Estimated cost: ${estimatedCost.toFixed(4)} per analysis
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="remember"
              checked={rememberKey}
              onCheckedChange={setRememberKey}
            />
            <Label htmlFor="remember" className="cursor-pointer">Remember for 30 days</Label>
          </div>

          {rememberKey && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Storing your API key on this device is convenient but less secure. Only use on trusted devices.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={handleValidateKey}
              variant="outline"
              disabled={isValidating || !apiKey.trim()}
              className="flex-1"
            >
              {isValidating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isValidated ? (
                <Check className="mr-2 h-4 w-4" />
              ) : null}
              Validate Key
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!isValidated}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      </InfoCard>
    </div>
  );
};

export default APIKeyForm;
