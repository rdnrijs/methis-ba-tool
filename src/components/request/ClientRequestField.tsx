
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, CircleHelp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { estimateTokenCount } from '@/utils/openAIService';
import TemplateSelector from './TemplateSelector';

interface ClientRequestFieldProps {
  clientRequest: string;
  onChange: (value: string) => void;
  onLoadSample: () => void;
  isLoadingSample?: boolean;
}

const ClientRequestField = ({ 
  clientRequest, 
  onChange, 
  onLoadSample,
  isLoadingSample = false
}: ClientRequestFieldProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          <Label htmlFor="clientRequest" className="text-sm font-medium">Client Request</Label>
        </div>
        <div className="flex items-center gap-2">
          <TemplateSelector
            onLoadSample={onLoadSample}
            isLoadingSample={isLoadingSample}
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CircleHelp className="h-5 w-5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Describe what the client is requesting. 
                  Be as detailed as possible to get more accurate requirements.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Textarea
        id="clientRequest"
        placeholder="Enter a detailed description of what the client is requesting..."
        value={clientRequest}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px] resize-y"
      />
      <div className="text-xs text-muted-foreground text-right">
        {clientRequest.length} characters / ~{estimateTokenCount(clientRequest)} tokens
      </div>
    </div>
  );
};

export default ClientRequestField;
