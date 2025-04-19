import { useState, useEffect } from 'react';
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
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  const handleApiConfigured = () => {
    setShowApiConfig(false);
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
                companyContext,
                clientContext
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
          <RequirementResults 
            result={result} 
            tokenUsage={tokenUsage!} 
            clientRequest={clientRequest} 
            stakeholders={stakeholders} 
            systems={systems} 
            companyContext={companyContext}
            clientContext={clientContext}
            onBackClick={() => setResult(null)}
            onConfigureClick={() => setShowApiConfig(true)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Analyze;
