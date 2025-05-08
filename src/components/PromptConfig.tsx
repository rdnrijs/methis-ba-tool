import { useState, useEffect } from 'react';
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
import { toast } from "sonner";

const LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'french', label: 'French' },
  { value: 'dutch', label: 'Dutch' },
];

const LANGUAGE_INSTRUCTION = {
  english: '  Even if the user message is in french or dutch, always respond in English.',
  french: '  Even if the user message is in English, always respond in French.',
  dutch: 'Antwoord in het Nederlands.',
};

const LANGUAGE_STORAGE_KEY = 'methis_selected_language';

const PROMPT_OPTIONS = [
  { key: 'default', label: 'Default' },
  { key: 'process', label: 'Process Redesign' },
  { key: 'journey', label: 'Customer Journey' },
];

function detectLanguageFromPrompt(prompt: string) {
  if (/Répondez en français\./.test(prompt)) return 'french';
  if (/Antwoord in het Nederlands\./.test(prompt)) return 'dutch';
  if (/Respond in English\./.test(prompt)) return 'english';
  return 'english';
}

const PromptConfig = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPromptKey, setSelectedPromptKey] = useState('default');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'english';
  });
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

  // Sync dropdown with systemPrompt when dialog opens or prompt changes
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored) {
        setSelectedLanguage(stored);
      } else {
        setSelectedLanguage(detectLanguageFromPrompt(systemPrompt));
      }
    }
  }, [isOpen]);

  // Persist language selection to localStorage
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    // Do NOT modify the systemPrompt here; language instruction will be appended at submission time only.
  };

  const onSave = async () => {
    if (!systemPrompt.trim()) {
      toast.error("System prompt cannot be empty");
      return;
    }
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
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Configure the output</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Modify the language output and instructions that guide OpenAI in analyzing client requests. This determines how the output will be structured.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 mb-1">
          {PROMPT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              className={`px-4 py-1 rounded-full font-medium transition-colors text-sm ${selectedPromptKey === opt.key ? 'bg-primary text-white shadow' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
              onClick={() => {
                setSelectedPromptKey(opt.key);
                setShowComingSoon(opt.key !== 'default');
              }}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="border-b mb-4" />

        {showComingSoon && (
          <div className="mb-4 p-3 bg-muted text-muted-foreground rounded text-center font-medium">
            Coming soon
          </div>
        )}

        {/* Prompt Section */}
        <div className="mb-4">
          {selectedPromptKey === 'default' && (
            <PromptTextarea
              systemPrompt={systemPrompt}
              isLoading={isLoading}
              onChange={setSystemPrompt}
            />
          )}
        </div>

        {/* Output Language */}
        <div className="mb-6">
          <label htmlFor="output-language" className="block text-lg font-bold mb-1">Output Language</label>
          <select
            id="output-language"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="border rounded px-2 py-1 w-full max-w-xs"
          >
            {LANGUAGE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="text-xs text-muted-foreground mt-1">
            The output will be generated in the selected language. The system prompt will include an instruction to respond in this language.
          </div>
        </div>

        <div className="border-t pt-4 flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="sm:w-auto w-full"
            disabled={isLoading || isSaving}
          >
            Reset to Default
          </Button>
          <Button
            variant="default"
            onClick={onSave}
            className="sm:w-auto w-full"
            disabled={isLoading || isSaving}
          >
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromptConfig;
