
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
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default form submission
    console.log('Analyze button clicked');
    onClick();
  };

  return (
    <div className="flex items-center justify-between pt-2">
      <div className="text-sm text-muted-foreground">
        Total: ~{tokenCount} tokens
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
