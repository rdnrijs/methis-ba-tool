
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Key, AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { 
  storeApiKey, 
  getApiKey, 
  storeSelectedModel, 
  getSelectedModel,
  storeSelectedProvider,
  getSelectedProvider,
  storeGoogleApiKey,
  getGoogleApiKey
} from '@/utils/storageUtils';
import { validateApiKey, validateGoogleApiKey, estimateCost } from '@/utils/openAIService';
import { toast } from "sonner";
import InfoCard from './ui/InfoCard';

interface APIKeyFormProps {
  onConfigured: () => void;
  provider: 'openai' | 'google';
}

const APIKeyForm = ({
  onConfigured,
  provider
}: APIKeyFormProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [rememberKey, setRememberKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState(getSelectedModel());
  const [estimatedCost, setEstimatedCost] = useState(0);

  // Check if an API key is already stored
  useEffect(() => {
    let storedKey;
    if (provider === 'openai') {
      storedKey = getApiKey();
      setSelectedModel(getSelectedModel());
    } else {
      storedKey = getGoogleApiKey();
      setSelectedModel('gemini-pro'); // Default Gemini model
    }
    
    if (storedKey) {
      setApiKey(storedKey);
      setIsValidated(true);
    }
  }, [provider]);

  // Update cost estimation when model changes
  useEffect(() => {
    if (provider === 'openai') {
      // Estimate based on average usage (1000 input, 500 output tokens)
      setEstimatedCost(estimateCost(1000, 500, selectedModel));
    } else {
      // Google pricing is different, approximately estimate
      setEstimatedCost(0.0005); // Simplified estimate
    }
  }, [selectedModel, provider]);

  const handleValidateKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }
    setIsValidating(true);
    try {
      let isValid;
      
      if (provider === 'openai') {
        isValid = await validateApiKey(apiKey);
      } else {
        isValid = await validateGoogleApiKey(apiKey);
      }
      
      if (isValid) {
        setIsValidated(true);
        if (provider === 'openai') {
          storeApiKey(apiKey, rememberKey);
          storeSelectedModel(selectedModel);
        } else {
          storeGoogleApiKey(apiKey, rememberKey);
        }
        storeSelectedProvider(provider);
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
      if (provider === 'openai') {
        storeApiKey(apiKey, rememberKey);
        storeSelectedModel(selectedModel);
      } else {
        storeGoogleApiKey(apiKey, rememberKey);
      }
      storeSelectedProvider(provider);
      onConfigured();
    } else {
      toast.error('Please validate your API key first');
    }
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    if (provider === 'openai') {
      storeSelectedModel(value);
    }
  };

  const renderModelSelector = () => {
    if (provider === 'openai') {
      return (
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
      );
    } else {
      return (
        <Select value={selectedModel} onValueChange={handleModelChange}>
          <SelectTrigger id="model">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
            <SelectItem value="gemini-flash">Gemini 2.0 Flash</SelectItem>
            <SelectItem value="gemini-ultra">Gemini Ultra</SelectItem>
          </SelectContent>
        </Select>
      );
    }
  };

  const getAPIKeyLabel = () => {
    return provider === 'openai' ? 'OpenAI API Key' : 'Google API Key';
  };
  
  const getModelLabel = () => {
    return provider === 'openai' ? 'OpenAI Model' : 'Google Gemini Model';
  };
  
  const getHelpText = () => {
    return provider === 'openai' 
      ? 'Get your API key from OpenAI dashboard' 
      : 'Get your API key from Google AI Studio';
  };

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-red-100 p-2 mx-0 rounded-full px-8px my-0 px-[8px] py-0">
          <Key className="h-5 w-5 text-red-600 my-[20px]" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{provider === 'openai' ? 'OpenAI' : 'Google Gemini'} Configuration</h2>
          <p className="text-muted-foreground">Configure your {provider === 'openai' ? 'OpenAI' : 'Google Gemini'} API key to start </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="apiKey">{getAPIKeyLabel()}</Label>
          <div className="relative">
            <Input 
              id="apiKey" 
              type={showKey ? 'text' : 'password'} 
              value={apiKey} 
              onChange={e => {
                setApiKey(e.target.value);
                setIsValidated(false);
              }} 
              placeholder={provider === 'openai' ? 'sk-...' : 'AI_...'}
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
            {getHelpText()}
          </p>
          <p className="text-xs text-muted-foreground">
            Your API key is stored locally and never sent to our servers
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">{getModelLabel()}</Label>
          {renderModelSelector()}
          <p className="text-xs text-muted-foreground">
            Estimated cost: ${estimatedCost.toFixed(4)} per analysis
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="remember" checked={rememberKey} onCheckedChange={setRememberKey} />
          <Label htmlFor="remember" className="cursor-pointer">Remember for 30 days</Label>
        </div>

        <div className="flex space-x-3 pt-2">
          <Button onClick={handleValidateKey} variant="outline" disabled={isValidating || !apiKey.trim()} className="flex-1">
            {isValidating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isValidated ? <Check className="mr-2 h-4 w-4" /> : null}
            Validate Key
          </Button>
          <Button onClick={handleContinue} disabled={!isValidated} className="flex-1 bg-red-300 hover:bg-red-400 text-black">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default APIKeyForm;
