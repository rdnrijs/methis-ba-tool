
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ValidationAlert from './prompt-config/ValidationAlert';
import PromptTextarea from './prompt-config/PromptTextarea';
import PromptDialogFooter from './prompt-config/PromptDialogFooter';
import { usePromptConfig } from './prompt-config/usePromptConfig';

const PromptConfig = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    systemPrompt,
    setSystemPrompt,
    isSaving,
    isValidating,
    validationError,
    isLoading,
    handleSave,
    handleReset,
  } = usePromptConfig(isOpen);

  const onSave = async () => {
    const success = await handleSave();
    if (success) {
      setIsOpen(false);
    }
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
        
        <ValidationAlert validationError={validationError} />
        
        <PromptTextarea 
          systemPrompt={systemPrompt}
          isLoading={isLoading}
          onChange={setSystemPrompt}
        />
        
        <PromptDialogFooter 
          onReset={handleReset}
          onSave={onSave}
          isSaving={isSaving}
          isValidating={isValidating}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PromptConfig;
