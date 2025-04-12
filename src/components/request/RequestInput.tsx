
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Users,
  Database,
  Building
} from 'lucide-react';
import { estimateTokenCount } from '@/utils/openAIService';
import { cn } from '@/lib/utils';
import ClientRequestField from './ClientRequestField';
import SubmitButton from './SubmitButton';

interface RequestInputProps {
  onSubmit: (request: string, context: string, stakeholders: string, systems: string, companyContext: string) => void;
  isLoading: boolean;
  onLoadSample: () => void;
  isLoadingSample: boolean;
  initialData?: {
    clientRequest: string;
    stakeholders: string;
    systems: string;
    companyContext: string;
  };
}

const REQUEST_TEMPLATES = [
  { id: 'blank', label: '-- Blank --' },
  { id: 'feature', label: 'New Feature Request' },
  { id: 'e-commerce', label: 'E-commerce Platform' },
  { id: 'mobile-app', label: 'Mobile Application' },
  { id: 'crm', label: 'CRM System' },
  { id: 'analytics', label: 'Analytics Dashboard' }
];

const RequestInput = ({ 
  onSubmit, 
  isLoading, 
  onLoadSample, 
  isLoadingSample,
  initialData 
}: RequestInputProps) => {
  const [clientRequest, setClientRequest] = useState(initialData?.clientRequest || '');
  const [stakeholders, setStakeholders] = useState(initialData?.stakeholders || '');
  const [systems, setSystems] = useState(initialData?.systems || '');
  const [companyContext, setCompanyContext] = useState(initialData?.companyContext || '');
  const [tokenCount, setTokenCount] = useState(0);
  const [template, setTemplate] = useState('blank');
  
  // Update local state when initialData changes
  useEffect(() => {
    if (initialData) {
      setClientRequest(initialData.clientRequest || '');
      setStakeholders(initialData.stakeholders || '');
      setSystems(initialData.systems || '');
      setCompanyContext(initialData.companyContext || '');
    }
  }, [initialData]);
  
  useEffect(() => {
    // Estimate token count for all fields combined
    const allText = clientRequest + stakeholders + systems + companyContext;
    const total = estimateTokenCount(allText);
    setTokenCount(total);
  }, [clientRequest, stakeholders, systems, companyContext]);
  
  const handleSubmit = () => {
    if (!clientRequest.trim()) {
      return;
    }
    
    // Combine all context fields into a structured format
    const contextData = [
      stakeholders && `Stakeholders: ${stakeholders}`,
      systems && `Systems & Applications: ${systems}`,
      companyContext && `Company Context: ${companyContext}`
    ].filter(Boolean).join('\n\n');
    
    onSubmit(clientRequest, contextData, stakeholders, systems, companyContext);
  };
  
  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      <Card className="w-full glass-card animate-scale-in animate-once">
        <CardContent className="p-6">
          <div className="space-y-6">
            <ClientRequestField 
              clientRequest={clientRequest}
              onChange={setClientRequest}
              onLoadSample={onLoadSample}
              isLoadingSample={isLoadingSample}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  <Label htmlFor="stakeholders" className="text-sm font-medium">Stakeholders</Label>
                </div>
                <textarea
                  id="stakeholders"
                  placeholder="Who are the stakeholders involved?"
                  value={stakeholders}
                  onChange={(e) => setStakeholders(e.target.value)}
                  className="min-h-[100px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {stakeholders.length} characters / ~{estimateTokenCount(stakeholders)} tokens
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-primary" />
                  <Label htmlFor="systems" className="text-sm font-medium">Systems & Applications</Label>
                </div>
                <textarea
                  id="systems"
                  placeholder="What systems or applications are involved?"
                  value={systems}
                  onChange={(e) => setSystems(e.target.value)}
                  className="min-h-[100px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {systems.length} characters / ~{estimateTokenCount(systems)} tokens
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                <Label htmlFor="companyContext" className="text-sm font-medium">Company Context</Label>
              </div>
              <textarea
                id="companyContext"
                placeholder="Provide context about the company and relevant processes..."
                value={companyContext}
                onChange={(e) => setCompanyContext(e.target.value)}
                className="min-h-[100px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="text-xs text-muted-foreground text-right">
                {companyContext.length} characters / ~{estimateTokenCount(companyContext)} tokens
              </div>
            </div>
            
            <SubmitButton 
              isLoading={isLoading}
              isDisabled={!clientRequest.trim()}
              onClick={handleSubmit}
              tokenCount={tokenCount}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestInput;
