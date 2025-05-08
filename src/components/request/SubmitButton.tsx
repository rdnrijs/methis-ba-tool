import { Button } from '@/components/ui/button';
import { Send, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getModelLimits } from '@/config/modelConfig';

interface SubmitButtonProps {
  isLoading: boolean;
  isDisabled: boolean;
  onClick: () => void;
  tokenCount: number;
}

const SubmitButton = ({ isLoading, isDisabled, onClick, tokenCount }: SubmitButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default form submission
    console.log('Analyze button clicked');
    onClick();
  };

  // For now, assume GPT-4.1 as the default model
  const { safeInputTokens, maxContextTokens, safeInputBuffer } = getModelLimits('gpt-4.1');
  const percentUsed = Math.round((tokenCount / safeInputTokens) * 100);

  return (
    <div className="flex flex-col gap-1 items-end pt-2 w-full">
      <div className="text-sm text-muted-foreground w-full text-left">
        Total: ~{tokenCount} / {safeInputTokens} tokens used ({percentUsed}%)
        <div className="w-full h-2 bg-muted rounded mt-1">
          <div
            className="h-2 bg-primary rounded"
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          (Model context window: {maxContextTokens} tokens. {safeInputBuffer} reserved for output.)
        </div>
        {tokenCount > safeInputTokens && (
          <div className="text-xs text-destructive mt-1">
            Warning: Input exceeds safe context window! Please shorten your input.
          </div>
        )}
      </div>
      <Button 
        onClick={handleClick}
        disabled={isLoading || isDisabled}
        className={cn(
          "transition-all duration-300",
          isLoading ? "w-[120px]" : "w-[100px]"
        )}
      >
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Analyze
          </>
        )}
      </Button>
    </div>
  );
};

export default SubmitButton;
