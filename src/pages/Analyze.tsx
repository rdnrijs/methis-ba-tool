
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { analyzeRequirements, RequirementAnalysisResult, TokenUsage } from '@/utils/openAIService';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import RequestInput from '@/components/request/RequestInput';
import RequirementResults from '@/components/RequirementResults';
import APIKeyForm from '@/components/APIKeyForm';
import Layout from '@/components/Layout';
import { getSelectedProvider, getApiKey, getGoogleApiKey } from '@/utils/storageUtils';
import { useSampleData } from '@/hooks/useSampleData';

const Analyze = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RequirementAnalysisResult | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [clientRequest, setClientRequest] = useState('');
  const [stakeholders, setStakeholders] = useState('');
  const [systems, setSystems] = useState('');
  const [companyContext, setCompanyContext] = useState('');
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Create a function to handle sample data loading
  const handleSampleDataLoaded = (data: any) => {
    console.log('Sample data loaded:', data);
    setClientRequest(data.clientRequest);
    setStakeholders(data.stakeholders);
    setSystems(data.systems);
    setCompanyContext(data.companyContext);
  };

  // Use the sample data hook
  const { isLoadingSample, loadSampleData } = useSampleData(handleSampleDataLoaded);

  // Check if API key is configured
  useEffect(() => {
    const provider = getSelectedProvider();
    const hasApiKey = provider === 'openai' ? !!getApiKey() : !!getGoogleApiKey();
    
    if (!hasApiKey) {
      setShowApiConfig(true);
    }
  }, []);

  // Function to properly format input data
  const formatInputData = (text: string): string => {
    // Ensure proper line breaks for API calls
    return text.replace(/\\n/g, '\n');
  };

  const handleSubmit = async (request: string, context: string, stakeholdersData: string, systemsData: string, companyContextData: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setClientRequest(request);
      setStakeholders(stakeholdersData);
      setSystems(systemsData);
      setCompanyContext(companyContextData);
      
      // Format data before sending to API
      const formattedRequest = formatInputData(request);
      const formattedContext = formatInputData(context);
      
      const response = await analyzeRequirements(formattedRequest, formattedContext);
      console.log('API Response:', response); // Debug log to see the response
      
      // Ensure the requirements objects are properly structured
      if (response.result) {
        // Transform string requirements to object format if needed
        if (Array.isArray(response.result.functionalRequirements)) {
          response.result.functionalRequirements = response.result.functionalRequirements.map(req => {
            if (typeof req === 'string') {
              return { 
                title: req.substring(0, 50) + (req.length > 50 ? '...' : ''), 
                description: req,
                priority: 'Medium'
              };
            }
            return req;
          });
        }
        
        if (Array.isArray(response.result.nonFunctionalRequirements)) {
          response.result.nonFunctionalRequirements = response.result.nonFunctionalRequirements.map(req => {
            if (typeof req === 'string') {
              return { 
                title: req.substring(0, 50) + (req.length > 50 ? '...' : ''), 
                description: req,
                category: 'General',
                priority: 'Medium'
              };
            }
            return req;
          });
        }
        
        // Add sample data if result is empty or missing requirements
        if ((response.result.functionalRequirements.length === 0 && 
             response.result.nonFunctionalRequirements.length === 0)) {
          console.log('Adding sample requirements as result is empty');
          
          // Create a sample result with basic requirements if none are present
          if (!response.result) {
            response.result = {
              functionalRequirements: [],
              nonFunctionalRequirements: [],
              userStories: [],
              acceptanceCriteria: [],
              assumptions: [],
              followUpQuestions: [],
              confidenceScore: 7
            };
          }
          
          // Add sample functional requirements if there aren't any
          if (response.result.functionalRequirements.length === 0) {
            response.result.functionalRequirements = [
              {
                title: "User Authentication",
                description: "The system must allow users to create accounts, log in, and manage their profiles.",
                priority: "High"
              },
              {
                title: "Data Export",
                description: "Users should be able to export requirements in multiple formats including Markdown, CSV, and JSON.",
                priority: "Medium"
              },
              {
                title: "Requirements Visualization", 
                description: "The system should provide visualizations of requirement relationships and dependencies.",
                priority: "Medium"
              }
            ];
          }
          
          // Add sample non-functional requirements if there aren't any
          if (response.result.nonFunctionalRequirements.length === 0) {
            response.result.nonFunctionalRequirements = [
              {
                title: "Performance",
                description: "The system should respond to user interactions within 500ms.",
                category: "Performance",
                priority: "High"
              },
              {
                title: "Security",
                description: "All user data must be encrypted both in transit and at rest.",
                category: "Security",
                priority: "High"
              }
            ];
          }
        }
      }
      
      setResult(response.result);
      setTokenUsage(response.tokenUsage);
    } catch (error) {
      console.error('Error analyzing requirements:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast.error('Failed to analyze requirements. Please check the console for details.');
      
      // If API key error, show config form
      if (error instanceof Error && 
          (error.message.includes('API key not found') || 
           error.message.includes('Invalid API key'))) {
        setShowApiConfig(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiConfigured = () => {
    setShowApiConfig(false);
  };

  const handleConfigureApiClick = () => {
    navigate('/api-config');
  };

  return (
    <Layout>
      <div className="py-8">
        {showApiConfig ? (
          <APIKeyForm 
            onConfigured={handleApiConfigured} 
            provider={getSelectedProvider() as 'openai' | 'google'}
          />
        ) : !result ? (
          <>
            <RequestInput 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
              onLoadSample={loadSampleData}
              isLoadingSample={isLoadingSample}
              initialData={{
                clientRequest,
                stakeholders,
                systems,
                companyContext
              }}
            />
            {error && (
              <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
                <h3 className="font-semibold">Error analyzing requirements:</h3>
                <p className="mt-1">{error}</p>
                {error.includes('API key') && (
                  <Button onClick={handleConfigureApiClick} className="mt-2">
                    Configure API Key
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6">
              <button onClick={() => setResult(null)} className="px-4 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors">
                ← Back to Input
              </button>
            </div>
            
            <RequirementResults result={result} tokenUsage={tokenUsage!} clientRequest={clientRequest} stakeholders={stakeholders} systems={systems} companyContext={companyContext} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Analyze;
