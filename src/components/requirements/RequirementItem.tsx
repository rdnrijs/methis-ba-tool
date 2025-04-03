
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

interface RequirementItemProps {
  text: string;
}

const RequirementItem = ({ text }: RequirementItemProps) => {
  return (
    <div className="flex items-start py-2 group">
      <Check className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
      <div className="text-sm">{text}</div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0"
        onClick={() => {
          navigator.clipboard.writeText(text);
          toast.success("Copied to clipboard");
        }}
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default RequirementItem;
