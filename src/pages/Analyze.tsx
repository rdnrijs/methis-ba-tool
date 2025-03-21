import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import APIKeyForm from '@/components/APIKeyForm';
import RequestInput from '@/components/RequestInput';
import RequirementResults from '@/components/RequirementResults';
import PromptConfig from '@/components/PromptConfig';
import { analyzeRequirements, RequirementAnalysisResult, TokenUsage } from '@/utils/openAIService';
import { getApiKey } from '@/utils/storageUtils';
import { toast } from "sonner";

const Analyze = () => {
  const [isConfigured, setIsConfigured] = useState(!!getApiKey());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<RequirementAnalysisResult | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [currentRequest, setCurrentRequest] = useState('');
  const navigate = useNavigate();
  
  const handleConfigure = () => {
    setIsConfigured(true);
  };
  
  const handleAnalyzeRequest = async (clientRequest: string, context: string) => {
    setIsAnalyzing(true);
    setCurrentRequest(clientRequest);
    
    try {
      const response = await analyzeRequirements(clientRequest, context);
      setAnalysisResult(response.result);
      setTokenUsage(response.tokenUsage);
    } catch (error) {
      console.error('Error analyzing request:', error);
      
      if (error instanceof Error && error.message.includes('API key')) {
        toast.error("API key error. Please reconfigure your API key.");
        setIsConfigured(false);
      } else {
        toast.error("Error analyzing request. Please try again.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const resetAnalysis = () => {
    setAnalysisResult(null);
    setTokenUsage(null);
    setCurrentRequest('');
  };
  
  return (
    <Layout>
      <div className="container py-12 space-y-12">
        {!isConfigured && (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-medium text-center mb-8">API Configuration</h1>
            <APIKeyForm onConfigured={handleConfigure} />
          </div>
        )}
        
        {isConfigured && !analysisResult && (
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-medium">Analyze Client Requirements</h1>
              <PromptConfig />
            </div>
            <p className="text-center text-muted-foreground mb-8">
              Enter a client request to automatically decompose it into structured requirements
            </p>
            <RequestInput 
              onSubmit={handleAnalyzeRequest}
              isLoading={isAnalyzing}
            />
          </div>
        )}
        
        {isConfigured && analysisResult && tokenUsage && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-medium">Requirements Analysis</h1>
              <div className="flex gap-4">
                <PromptConfig />
                <button 
                  onClick={resetAnalysis}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Analyze another request
                </button>
              </div>
            </div>
            <RequirementResults 
              result={analysisResult}
              tokenUsage={tokenUsage}
              clientRequest={currentRequest}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Analyze;
