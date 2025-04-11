
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Send, RefreshCw } from 'lucide-react';
import { toast } from "sonner";
import { estimateTokenCount } from '@/utils/openAIService';
import { cn } from '@/lib/utils';
import { convertSampleDataToAppFormat } from './templates';
import ClientRequestField from './ClientRequestField';
import ContextFields from './ContextFields';
import { getSampleData } from '@/utils/supabaseService';
import PromptConfig from '@/components/PromptConfig';

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
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  
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
  
  const loadSampleData = async () => {
    setIsLoadingSample(true);
    try {
      const dbSampleData = await getSampleData('utility_sample');
      if (dbSampleData) {
        const formattedData = convertSampleDataToAppFormat(dbSampleData);
        setClientRequest(formattedData.clientRequest);
        setStakeholders(formattedData.stakeholders);
        setSystems(formattedData.systems);
        setCompanyContext(formattedData.companyContext);
        toast("Utility sector sample data has been loaded");
      } else {
        toast.error("Sample data not found. Please check database configuration.");
        console.error("Sample data 'utility_sample' not found in database.");
      }
    } catch (error) {
      console.error('Error loading sample data:', error);
      toast.error("Failed to load sample data. See console for details.");
    } finally {
      setIsLoadingSample(false);
    }
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
            
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-muted-foreground">
                Total: ~{tokenCount} tokens
              </div>
              <Button 
                onClick={handleSubmit}
                disabled={isLoading || !clientRequest.trim()}
                className={cn(
                  "transition-all duration-300",
                  isLoading ? "w-[120px]" : "w-[100px]"
                )}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestInput;
