import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { estimateTokenCount } from '@/utils/openAIService';

interface ClientRequestFieldProps {
  clientRequest: string;
  onChange: (value: string) => void;
  onLoadSample?: () => void;
  isLoadingSample?: boolean;
  showButtons?: boolean;
}

const ClientRequestField = ({ 
  clientRequest, 
  onChange, 
  onLoadSample, 
  isLoadingSample,
  showButtons = true 
}: ClientRequestFieldProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-primary" />
          <Label htmlFor="clientRequest" className="text-sm font-medium">Client Request</Label>
        </div>
        {showButtons && onLoadSample && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLoadSample}
              disabled={isLoadingSample}
            >
              {isLoadingSample ? 'Loading...' : 'Load Sample'}
            </Button>
          </div>
        )}
      </div>
      <textarea
        id="clientRequest"
        placeholder="What is the client's request?"
        value={clientRequest}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div className="text-xs text-muted-foreground text-right">
        {clientRequest.length} characters / ~{estimateTokenCount(clientRequest)} tokens
      </div>
    </div>
  );
};

export default ClientRequestField;
