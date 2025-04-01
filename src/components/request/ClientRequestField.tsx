
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileText, FlaskConical } from 'lucide-react';
import { estimateTokenCount } from '@/utils/openAIService';

interface ClientRequestFieldProps {
  clientRequest: string;
  onChange: (value: string) => void;
  onLoadSample?: () => void;
}

const ClientRequestField = ({ 
  clientRequest, 
  onChange, 
  onLoadSample 
}: ClientRequestFieldProps) => {
  // Function to format text for display
  const formatDisplayText = (text: string) => {
    return text.replace(/\\n/g, '\n');
  };
  
  // Function to handle text input changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          <Label htmlFor="clientRequest" className="text-sm font-medium">Detailed Description of Client Request</Label>
        </div>
        
        {onLoadSample && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex items-center gap-1"
            onClick={onLoadSample}
          >
            <FlaskConical className="h-3.5 w-3.5" />
            Load Sample
          </Button>
        )}
      </div>
      
      <Textarea
        id="clientRequest"
        placeholder="Enter a detailed description of what the client is requesting..."
        value={formatDisplayText(clientRequest)}
        onChange={handleTextChange}
        className="min-h-[120px] resize-y"
      />
      
      <div className="text-xs text-muted-foreground text-right">
        {clientRequest.length} characters / ~{estimateTokenCount(clientRequest)} tokens
      </div>
    </div>
  );
};

export default ClientRequestField;
