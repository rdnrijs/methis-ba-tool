
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from "sonner";
import { estimateTokenCount } from '@/utils/openAIService';
import { cn } from '@/lib/utils';
import ClientRequestField from './ClientRequestField';
import ContextFields from './ContextFields';
import PromptConfig from '@/components/PromptConfig';
import TemplateSelector from './TemplateSelector';
import SubmitButton from './SubmitButton';
import { useSampleData } from '@/hooks/useSampleData';

interface RequestInputProps {
  onSubmit: (request: string, context: string, stakeholders: string, systems: string, companyContext: string) => void;
  isLoading: boolean;
}

const RequestInput = ({ onSubmit, isLoading }: RequestInputProps) => {
  const [clientRequest, setClientRequest] = useState('');
  const [stakeholders, setStakeholders] = useState('');
  const [systems, setSystems] = useState('');
  const [companyContext, setCompanyContext] = useState('');
  const [tokenCount, setTokenCount] = useState(0);
  
  // Use the custom hook for sample data loading
  const { isLoadingSample, loadSampleData } = useSampleData(({ clientRequest, stakeholders, systems, companyContext }) => {
    setClientRequest(clientRequest);
    setStakeholders(stakeholders);
    setSystems(systems);
    setCompanyContext(companyContext);
  });
  
  useEffect(() => {
    // Estimate token count for all fields combined
    const allText = clientRequest + stakeholders + systems + companyContext;
    const total = estimateTokenCount(allText);
    setTokenCount(total);
  }, [clientRequest, stakeholders, systems, companyContext]);
  
  const handleSubmit = () => {
    if (!clientRequest.trim()) {
      toast("Please enter a client request to analyze");
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
      <div className="flex justify-end">
        <PromptConfig />
      </div>
      
      <Card className="w-full glass-card animate-scale-in animate-once">
        <CardContent className="p-6">
          <div className="space-y-6">
            <ClientRequestField 
              clientRequest={clientRequest} 
              onChange={setClientRequest}
              onLoadSample={loadSampleData}
              isLoadingSample={isLoadingSample}
            />
            
            <ContextFields 
              stakeholders={stakeholders}
              systems={systems}
              companyContext={companyContext}
              onStakeholdersChange={setStakeholders}
              onSystemsChange={setSystems}
              onCompanyContextChange={setCompanyContext}
            />
            
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
