
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ConfidenceIndicatorProps {
  score: number;
}

const ConfidenceIndicator = ({ score }: ConfidenceIndicatorProps) => {
  const getColor = () => {
    if (score >= 0.8) return "bg-green-500";
    if (score >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const getMessage = () => {
    if (score >= 0.8) return "High confidence";
    if (score >= 0.6) return "Medium confidence";
    return "Low confidence";
  };
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{getMessage()}</span>
        <span className="text-sm text-muted-foreground">{Math.round(score * 100)}%</span>
      </div>
      <Progress value={score * 100} className={cn("h-2", getColor())} />
    </div>
  );
};

export default ConfidenceIndicator;
