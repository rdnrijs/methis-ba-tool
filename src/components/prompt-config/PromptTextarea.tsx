import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface PromptTextareaProps {
  systemPrompt: string;
  isLoading: boolean;
  onChange: (value: string) => void;
}

const PromptTextarea = ({ systemPrompt, isLoading, onChange }: PromptTextareaProps) => {
  const isEmpty = !systemPrompt && !isLoading;
  
  return (
    <div className="space-y-4 my-4">
      <Label htmlFor="systemPrompt" className="text-lg font-bold">
        System Prompt Instructions
      </Label>
      {isLoading ? (
        <div className="h-[200px] flex items-center justify-center bg-muted/20">
          <RefreshCw className="h-6 w-6 animate-spin opacity-50" />
        </div>
      ) : isEmpty ? (
        <div className="h-[400px] flex flex-col items-center justify-center bg-destructive/10 rounded-md">
          <AlertTriangle className="h-8 w-8 text-destructive mb-4" />
          <p className="text-destructive font-medium">No system prompt found in database</p>
          <p className="text-muted-foreground text-sm mt-2">Please add a default prompt in the database</p>
        </div>
      ) : (
        <Textarea
          id="systemPrompt"
          value={systemPrompt}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[150px] font-mono text-sm"
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
