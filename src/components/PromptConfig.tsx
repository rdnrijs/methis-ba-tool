
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Settings, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DEFAULT_SYSTEM_PROMPT, validateApiKey } from '@/utils/openAIService';
import { saveCustomPrompt, getCustomPrompt, getApiKey } from '@/utils/storageUtils';
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PromptConfig = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const savedPrompt = getCustomPrompt();
    setSystemPrompt(savedPrompt || DEFAULT_SYSTEM_PROMPT);
    setValidationError(null);
  }, [isOpen]);

  const validatePrompt = () => {
    // Validate that the prompt contains required elements
    if (!systemPrompt.includes('functionalRequirements') || 
        !systemPrompt.includes('nonFunctionalRequirements') || 
        !systemPrompt.includes('userStories')) {
      setValidationError("Prompt must include functionalRequirements, nonFunctionalRequirements, and userStories fields for the analyzer to work properly.");
      return false;
    }

    // Make sure it instructs to return JSON
    if (!systemPrompt.toLowerCase().includes('json')) {
      setValidationError("Prompt must instruct the model to return a JSON response.");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const testApiKey = async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setValidationError("No API key configured. Please set up your API key first.");
      return false;
    }

    setIsValidating(true);
    try {
      const isValid = await validateApiKey(apiKey);
      if (!isValid) {
        setValidationError("Invalid API key. Please check your OpenAI API key configuration.");
        return false;
      }
      return true;
    } catch (error) {
      setValidationError("Error validating API key. Please check your network connection and try again.");
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // First validate prompt format
      if (!validatePrompt()) {
        setIsSaving(false);
        return;
      }

      // Then validate API key
      const isApiKeyValid = await testApiKey();
      if (!isApiKeyValid) {
        setIsSaving(false);
        return;
      }

      saveCustomPrompt(systemPrompt);
      toast.success("Prompt configuration saved successfully!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to save prompt configuration.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
    setValidationError(null);
    toast.info("Prompt reset to default.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings size={16} />
          Configure Prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Customize OpenAI System Prompt</DialogTitle>
          <DialogDescription>
            Modify the instructions that guide OpenAI in analyzing client requests. 
            This determines how requirements are extracted and structured.
          </DialogDescription>
        </DialogHeader>
        
        {validationError && (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Validation Error</AlertTitle>
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4 my-4">
          <Label htmlFor="systemPrompt">System Prompt Instructions</Label>
          <Textarea
            id="systemPrompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
            placeholder="Enter custom prompt instructions..."
          />
          <p className="text-sm text-muted-foreground">
            Ensure the prompt includes instructions to return JSON with the expected fields: 
            functionalRequirements, nonFunctionalRequirements, userStories, etc.
          </p>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="gap-2"
          >
            <RefreshCw size={16} />
            Reset to Default
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isValidating}
            className="gap-2"
          >
            {isSaving || isValidating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                {isValidating ? "Validating..." : "Saving..."}
              </>
            ) : (
              <>
                <Check size={16} />
                Save Configuration
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromptConfig;
