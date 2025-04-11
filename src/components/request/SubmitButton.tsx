
import { Button } from '@/components/ui/button';
import { Send, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmitButtonProps {
  isLoading: boolean;
  isDisabled: boolean;
  onClick: () => void;
  tokenCount: number;
}

const SubmitButton = ({ isLoading, isDisabled, onClick, tokenCount }: SubmitButtonProps) => {
  return (
    <div className="flex items-center justify-between pt-2">
      <div className="text-sm text-muted-foreground">
        Total: ~{tokenCount} tokens
      </div>
      <Button 
        onClick={onClick}
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
