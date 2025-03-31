
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Send, RefreshCw } from 'lucide-react';
import { toast } from "sonner";
import { estimateTokenCount } from '@/utils/openAIService';
import { cn } from '@/lib/utils';
import { 
  TEMPLATE_CONTENT, 
  UTILITY_SAMPLE_DATA, 
  createTemplateContentMap,
  convertSampleDataToAppFormat
} from './templates';
import TemplateSelector from './TemplateSelector';
import ClientRequestField from './ClientRequestField';
import ContextFields from './ContextFields';
import { getRequestTemplates, getSampleData } from '@/utils/supabaseService';

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
  const [template, setTemplate] = useState('blank');
  const [templateContentMap, setTemplateContentMap] = useState<Record<string, string>>(TEMPLATE_CONTENT);
  const [sampleData, setSampleData] = useState(UTILITY_SAMPLE_DATA);
  
  useEffect(() => {
    // Load templates from Supabase
    const loadTemplates = async () => {
      try {
        const dbTemplates = await getRequestTemplates();
        if (dbTemplates.length > 0) {
          // Create content mapping from the database templates
          setTemplateContentMap(createTemplateContentMap(dbTemplates));
        }
      } catch (error) {
        console.error('Error loading template content:', error);
      }
    };
    
    // Load sample data from Supabase
    const loadSampleData = async () => {
      try {
        const dbSampleData = await getSampleData('utility_sample');
        if (dbSampleData) {
          setSampleData(convertSampleDataToAppFormat(dbSampleData));
        }
      } catch (error) {
        console.error('Error loading sample data:', error);
      }
    };
    
    loadTemplates();
    loadSampleData();
  }, []);
  
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
  
  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    
    if (value === 'blank') {
      setClientRequest('');
      setStakeholders('');
      setSystems('');
      setCompanyContext('');
      return;
    }
    
    if (value in templateContentMap) {
      setClientRequest(templateContentMap[value]);
    }
  };
  
  const loadSampleData = () => {
    setClientRequest(sampleData.clientRequest);
    setStakeholders(sampleData.stakeholders);
    setSystems(sampleData.systems);
    setCompanyContext(sampleData.companyContext);
    toast("Utility sector sample data has been loaded");
  };
  
  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      <Card className="w-full glass-card animate-scale-in animate-once">
        <CardContent className="p-6">
          <div className="space-y-6">
            <TemplateSelector 
              template={template} 
              onTemplateChange={handleTemplateChange} 
            />
            
            <ClientRequestField 
              clientRequest={clientRequest} 
              onChange={setClientRequest}
              onLoadSample={loadSampleData}
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
