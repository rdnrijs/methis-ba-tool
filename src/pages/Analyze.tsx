import { useState, useEffect, useContext } from 'react';
import Layout from '@/components/Layout';
import RequestInput from '@/components/request/RequestInput';
import RequirementResults from '@/components/RequirementResults';
import APIKeyForm from '@/components/APIKeyForm';
import { getSelectedProvider } from '@/utils/storageUtils';
import { useSampleData } from '@/hooks/useSampleData';
import { useAnalyzeRequirements } from '@/hooks/useAnalyzeRequirements';
import { useAnalyze } from '@/contexts/AnalyzeContext';
import ErrorDisplay from '@/components/analyze/ErrorDisplay';
import BackButton from '@/components/analyze/BackButton';
import PromptConfig from '@/components/PromptConfig';
import { AnalyzeContext } from '@/contexts/AnalyzeContext';

const Analyze = () => {
  const {
    isLoading,
    result,
    setResult,
    tokenUsage,
    clientRequest,
    setClientRequest,
    stakeholders,
    setStakeholders,
    systems,
    setSystems,
    companyContext,
    setCompanyContext,
    clientContext,
    setClientContext,
    showApiConfig,
    setShowApiConfig,
    error,
    setError,
    clearStoredData,
    setShowInput: contextSetShowInput
  } = useAnalyze();
  const analyzeContext = useContext(AnalyzeContext);

  const {
    handleSubmit: submitAnalysis,
    checkApiKey,
    handleConfigureApiClick,
  } = useAnalyzeRequirements();

  const [showInput, setShowInput] = useState(!result);

  // Sync local showInput with context so Ribbon can control it
  useEffect(() => {
    if (analyzeContext && typeof analyzeContext.setShowInput === 'function') {
      analyzeContext.setShowInput(showInput);
    }
  }, [showInput, analyzeContext]);

  // Check if API key is configured
  useEffect(() => {
    if (!checkApiKey()) {
      setShowApiConfig(true);
    }
  }, []);

  // Create a function to handle sample data loading
  const handleSampleDataLoaded = (data: any) => {
    console.log('Sample data loaded:', data);
    setClientRequest(data.clientRequest);
    setStakeholders(data.stakeholders);
    setSystems(data.systems);
    setCompanyContext(data.companyContext);
    setClientContext(data.clientContext || '');
  };

  // Use the sample data hook
  const { isLoadingSample, loadSampleData } = useSampleData(handleSampleDataLoaded);

  const handleSubmit = async (
    request: string, 
    context: string, 
    stakeholdersData: string, 
    systemsData: string, 
    companyContextData: string, 
    clientContextData: string
  ) => {
    setClientRequest(request);
    setStakeholders(stakeholdersData);
    setSystems(systemsData);
    setCompanyContext(companyContextData);
    setClientContext(clientContextData);
    
    try {
      console.log('Submitting request:', request);
      await submitAnalysis(request, context, stakeholdersData, systemsData, companyContextData, clientContextData);
      setShowInput(false);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  const handleApiConfigured = () => {
    setShowApiConfig(false);
  };

  // Handle navigation back to the input form without clearing stored data
  const handleBackClick = () => {
    setShowInput(true);
  };

  // Handle clearing all stored data and returning to the input form
  const handleClearAndBackClick = () => {
    clearStoredData();
    setShowInput(true);
  };

  return (
    <Layout>
      <div className="py-8">
        {showApiConfig ? (
          <APIKeyForm 
            onConfigured={handleApiConfigured} 
            provider={getSelectedProvider() as 'openai' | 'google'}
          />
        ) : showInput ? (
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
                companyContext,
                clientContext
              }}
              storedResult={result}
              onContinueResult={() => setShowInput(false)}
            />
            {error && (
              <ErrorDisplay 
                error={error} 
                onConfigureApiClick={handleConfigureApiClick} 
              />
            )}
          </>
        ) : result && Object.keys(result).length > 0 ? (
          <RequirementResults 
            result={result} 
            tokenUsage={tokenUsage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 }} 
            clientRequest={clientRequest} 
            stakeholders={stakeholders} 
            systems={systems} 
            companyContext={companyContext}
            clientContext={clientContext}
            onBackClick={handleBackClick}
            onClearClick={handleClearAndBackClick}
            onConfigureClick={() => setShowApiConfig(true)}
          />
        ) : null}
      </div>
    </Layout>
  );
};

export default Analyze;
