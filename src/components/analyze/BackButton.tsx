
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  onClick: () => void;
}

const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <div className="mb-6">
      <Button 
        onClick={onClick} 
        className="px-4 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors"
      >
        ← Back to Input
      </Button>
    </div>
  );
};

export default BackButton;
