
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
import { Settings, RefreshCw, Check } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DEFAULT_SYSTEM_PROMPT } from '@/utils/openAIService';
import { saveCustomPrompt, getCustomPrompt } from '@/utils/storageUtils';
import { toast } from "sonner";

const PromptConfig = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedPrompt = getCustomPrompt();
    setSystemPrompt(savedPrompt || DEFAULT_SYSTEM_PROMPT);
  }, [isOpen]);

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Validate that the prompt contains required elements
      if (!systemPrompt.includes('functionalRequirements') || 
          !systemPrompt.includes('nonFunctionalRequirements') || 
          !systemPrompt.includes('userStories')) {
        toast.error("Prompt must include required fields for the analyzer to work properly.");
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
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
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
