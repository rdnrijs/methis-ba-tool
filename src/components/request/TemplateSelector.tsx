
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface TemplateSelectorProps {
  onLoadSample: () => void;
  isLoadingSample: boolean;
}

const TemplateSelector = ({ 
  onLoadSample,
  isLoadingSample
}: TemplateSelectorProps) => {
  return (
    <div className="flex justify-end">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLoadSample}
              disabled={isLoadingSample}
            >
              {isLoadingSample ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load Sample'
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Load sample data from database</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default TemplateSelector;
