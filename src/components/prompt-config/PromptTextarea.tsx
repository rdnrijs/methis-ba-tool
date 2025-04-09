
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RefreshCw } from 'lucide-react';

interface PromptTextareaProps {
  systemPrompt: string;
  isLoading: boolean;
  onChange: (value: string) => void;
}

const PromptTextarea = ({ systemPrompt, isLoading, onChange }: PromptTextareaProps) => {
  return (
    <div className="space-y-4 my-4">
      <Label htmlFor="systemPrompt">System Prompt Instructions</Label>
      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center bg-muted/20">
          <RefreshCw className="h-6 w-6 animate-spin opacity-50" />
        </div>
      ) : (
        <Textarea
          id="systemPrompt"
          value={systemPrompt}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[400px] font-mono text-sm"
          placeholder="Enter custom prompt instructions..."
        />
      )}
      <p className="text-sm text-muted-foreground">
        Ensure the prompt includes instructions to return JSON with the expected fields: 
        functionalRequirements, nonFunctionalRequirements, userStories, etc.
      </p>
    </div>
  );
};

export default PromptTextarea;
