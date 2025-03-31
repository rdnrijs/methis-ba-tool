import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { analyzeRequirements, RequirementAnalysisResult, TokenUsage } from '@/utils/openAIService';
import { toast } from "sonner";
import RequestInput from '@/components/request/RequestInput';
import RequirementResults from '@/components/RequirementResults';
import APIKeyForm from '@/components/APIKeyForm';
import Layout from '@/components/Layout';
const Analyze = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RequirementAnalysisResult | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [clientRequest, setClientRequest] = useState('');
  const [stakeholders, setStakeholders] = useState('');
  const [systems, setSystems] = useState('');
  const [companyContext, setCompanyContext] = useState('');
  const [showApiConfig, setShowApiConfig] = useState(false);
  const handleSubmit = async (request: string, context: string, stakeholdersData: string, systemsData: string, companyContextData: string) => {
    try {
      setIsLoading(true);
      setClientRequest(request);
      setStakeholders(stakeholdersData);
      setSystems(systemsData);
      setCompanyContext(companyContextData);
      const response = await analyzeRequirements(request, context);
      setResult(response.result);
      setTokenUsage(response.tokenUsage);
    } catch (error) {
      console.error('Error analyzing requirements:', error);
      toast.error('Failed to analyze requirements. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleApiConfigured = () => {
    setShowApiConfig(false);
  };
  return <Layout fullWidth>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          
        </div>
        
        {showApiConfig ? <APIKeyForm onConfigured={handleApiConfigured} /> : !result ? <RequestInput onSubmit={handleSubmit} isLoading={isLoading} /> : <>
            <div className="mb-6">
              <button onClick={() => setResult(null)} className="px-4 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors">
                ← Back to Input
              </button>
            </div>
            
            <RequirementResults result={result} tokenUsage={tokenUsage!} clientRequest={clientRequest} stakeholders={stakeholders} systems={systems} companyContext={companyContext} />
          </>}
      </div>
    </Layout>;
};
export default Analyze;