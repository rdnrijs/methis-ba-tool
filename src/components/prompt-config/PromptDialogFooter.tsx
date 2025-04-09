
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { RefreshCw, Check } from 'lucide-react';

interface PromptDialogFooterProps {
  onReset: () => void;
  onSave: () => void;
  isSaving: boolean;
  isValidating: boolean;
  isLoading: boolean;
}

const PromptDialogFooter = ({
  onReset,
  onSave,
  isSaving,
  isValidating,
  isLoading
}: PromptDialogFooterProps) => {
  return (
    <DialogFooter className="flex justify-between sm:justify-between">
      <Button 
        variant="outline" 
        onClick={onReset}
        className="gap-2"
        disabled={isLoading}
      >
        <RefreshCw size={16} />
        Reset to Database Default
      </Button>
      <Button 
        onClick={onSave} 
        disabled={isSaving || isValidating || isLoading}
        className="gap-2"
      >
        {isSaving || isValidating || isLoading ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            {isLoading ? "Loading..." : isValidating ? "Validating..." : "Saving..."}
          </>
        ) : (
          <>
            <Check size={16} />
            Save Configuration
          </>
        )}
      </Button>
    </DialogFooter>
  );
};

export default PromptDialogFooter;
