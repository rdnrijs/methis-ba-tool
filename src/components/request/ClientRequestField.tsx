
import { FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { estimateTokenCount } from '@/utils/openAIService';

interface ClientRequestFieldProps {
  clientRequest: string;
  onChange: (value: string) => void;
}

const ClientRequestField = ({ clientRequest, onChange }: ClientRequestFieldProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center">
        <FileText className="h-5 w-5 mr-2 text-primary" />
        <Label htmlFor="clientRequest" className="text-sm font-medium">Detailed Description of Client Request</Label>
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
