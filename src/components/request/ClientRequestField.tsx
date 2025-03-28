
import { FileText, Zap } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { estimateTokenCount } from '@/utils/openAIService';
import { UTILITY_SAMPLE_DATA } from './templates';

interface ClientRequestFieldProps {
  clientRequest: string;
  onChange: (value: string) => void;
  onLoadSample: () => void;
}

const ClientRequestField = ({ clientRequest, onChange, onLoadSample }: ClientRequestFieldProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          <Label htmlFor="clientRequest" className="text-sm font-medium">Detailed Description of Client Request</Label>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onLoadSample}
          className="h-8 gap-1"
        >
          <Zap className="h-4 w-4" />
          <span className="hidden sm:inline">Load Utility Sample</span>
          <span className="inline sm:hidden">Sample</span>
        </Button>
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
