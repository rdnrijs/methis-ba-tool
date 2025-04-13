
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import RequestInput from '@/components/request/RequestInput';
import RequirementResults from '@/components/RequirementResults';
import APIKeyForm from '@/components/APIKeyForm';
import { getSelectedProvider } from '@/utils/storageUtils';
import { useSampleData } from '@/hooks/useSampleData';
import { useAnalyzeRequirements } from '@/hooks/useAnalyzeRequirements';
import { AnalyzeProvider, useAnalyze } from '@/contexts/AnalyzeContext';
import ErrorDisplay from '@/components/analyze/ErrorDisplay';
import BackButton from '@/components/analyze/BackButton';
import PromptConfig from '@/components/PromptConfig';

// Create a component that contains the main Analyze page content
const AnalyzeContent = () => {
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
    showApiConfig,
    setShowApiConfig,
    error,
    setError
  } = useAnalyze();

  const {
    handleSubmit: submitAnalysis,
    checkApiKey,
    handleConfigureApiClick,
  } = useAnalyzeRequirements();

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
  };

  // Use the sample data hook
  const { isLoadingSample, loadSampleData } = useSampleData(handleSampleDataLoaded);

  const handleSubmit = async (request: string, context: string, stakeholdersData: string, systemsData: string, companyContextData: string) => {
    setClientRequest(request);
    setStakeholders(stakeholdersData);
    setSystems(systemsData);
    setCompanyContext(companyContextData);
    
    try {
      console.log('Submitting request:', request);
      await submitAnalysis(request, context, stakeholdersData, systemsData, companyContextData);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  const handleApiConfigured = () => {
    setShowApiConfig(false);
  };

  return (
    <div className="py-8">
      <div className="flex justify-end mb-4 max-w-3xl mx-auto">
        <PromptConfig />
      </div>
      
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
            <ErrorDisplay 
              error={error} 
              onConfigureApiClick={handleConfigureApiClick} 
            />
          )}
        </>
      ) : (
        <>
          <BackButton onClick={() => setResult(null)} />
          <RequirementResults 
            result={result} 
            tokenUsage={tokenUsage!} 
            clientRequest={clientRequest} 
            stakeholders={stakeholders} 
            systems={systems} 
            companyContext={companyContext} 
          />
        </>
      )}
    </div>
  );
};

// The main Analyze component that wraps the content with the context provider
const Analyze = () => {
  return (
    <Layout>
      <AnalyzeProvider>
        <AnalyzeContent />
      </AnalyzeProvider>
    </Layout>
  );
};

export default Analyze;
