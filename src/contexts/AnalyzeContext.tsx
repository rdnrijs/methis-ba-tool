
import { createContext, useContext, useState, ReactNode } from 'react';
import { RequirementAnalysisResult, TokenUsage } from '@/utils/api/types';

interface AnalyzeContextType {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  result: RequirementAnalysisResult | null;
  setResult: (result: RequirementAnalysisResult | null) => void;
  tokenUsage: TokenUsage | null;
  setTokenUsage: (tokenUsage: TokenUsage | null) => void;
  clientRequest: string;
  setClientRequest: (clientRequest: string) => void;
  stakeholders: string;
  setStakeholders: (stakeholders: string) => void;
  systems: string;
  setSystems: (systems: string) => void;
  companyContext: string;
  setCompanyContext: (companyContext: string) => void;
  showApiConfig: boolean;
  setShowApiConfig: (showApiConfig: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AnalyzeContext = createContext<AnalyzeContextType | undefined>(undefined);

export const AnalyzeProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RequirementAnalysisResult | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [clientRequest, setClientRequest] = useState('');
  const [stakeholders, setStakeholders] = useState('');
  const [systems, setSystems] = useState('');
  const [companyContext, setCompanyContext] = useState('');
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = {
    isLoading,
    setIsLoading,
    result,
    setResult,
    tokenUsage,
    setTokenUsage,
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
    setError,
  };

  return <AnalyzeContext.Provider value={value}>{children}</AnalyzeContext.Provider>;
};

export const useAnalyze = () => {
  const context = useContext(AnalyzeContext);
  if (context === undefined) {
    throw new Error('useAnalyze must be used within an AnalyzeProvider');
  }
  return context;
};
