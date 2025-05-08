import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { RequirementAnalysisResult, TokenUsage } from '@/utils/api/types';

// Storage keys
const STORAGE_KEYS = {
  RESULT: 'methis_analysis_result',
  TOKEN_USAGE: 'methis_token_usage',
  CLIENT_REQUEST: 'methis_client_request',
  STAKEHOLDERS: 'methis_stakeholders',
  SYSTEMS: 'methis_systems',
  COMPANY_CONTEXT: 'methis_company_context',
  CLIENT_CONTEXT: 'methis_client_context',
  RECENT_RESULTS: 'methis_recent_results',
};

// Add a type for recent result entries
export interface RecentAnalysisEntry {
  result: RequirementAnalysisResult;
  title: string;
  created: number;
}

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
  clientContext: string;
  setClientContext: (clientContext: string) => void;
  showApiConfig: boolean;
  setShowApiConfig: (showApiConfig: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  clearStoredData: () => void;
  resetCurrentAnalysis: () => void;
  setShowInput?: (show: boolean) => void;
  recentResults: RecentAnalysisEntry[];
  activateResult: (index: number) => void;
  activateLatestResult: () => void;
  removeResult: (index: number) => void;
}

export const AnalyzeContext = createContext<AnalyzeContextType | undefined>(undefined);

// Helper function to safely parse JSON from localStorage
const getStoredItem = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedItem = localStorage.getItem(key);
    return storedItem ? JSON.parse(storedItem) : defaultValue;
  } catch (error) {
    console.error(`Error parsing stored item for key ${key}:`, error);
    return defaultValue;
  }
};

// Validate token usage data to ensure it has all required fields
const validateTokenUsage = (data: any): TokenUsage => {
  if (!data) return { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  
  const promptTokens = isNaN(Number(data.promptTokens)) ? 0 : Number(data.promptTokens);
  const completionTokens = isNaN(Number(data.completionTokens)) ? 0 : Number(data.completionTokens);
  let totalTokens = isNaN(Number(data.totalTokens)) ? 0 : Number(data.totalTokens);
  
  // Recalculate total if it's 0 but we have other values
  if (totalTokens === 0 && (promptTokens > 0 || completionTokens > 0)) {
    totalTokens = promptTokens + completionTokens;
  }
  
  return { promptTokens, completionTokens, totalTokens };
};

export const AnalyzeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage if available
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RequirementAnalysisResult | null>(
    getStoredItem(STORAGE_KEYS.RESULT, null)
  );
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(
    validateTokenUsage(getStoredItem(STORAGE_KEYS.TOKEN_USAGE, null))
  );
  const [clientRequest, setClientRequest] = useState(
    getStoredItem(STORAGE_KEYS.CLIENT_REQUEST, '')
  );
  const [stakeholders, setStakeholders] = useState(
    getStoredItem(STORAGE_KEYS.STAKEHOLDERS, '')
  );
  const [systems, setSystems] = useState(
    getStoredItem(STORAGE_KEYS.SYSTEMS, '')
  );
  const [companyContext, setCompanyContext] = useState(
    getStoredItem(STORAGE_KEYS.COMPANY_CONTEXT, '')
  );
  const [clientContext, setClientContext] = useState(
    getStoredItem(STORAGE_KEYS.CLIENT_CONTEXT, '')
  );
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(true);
  const [recentResults, setRecentResults] = useState<RecentAnalysisEntry[]>(
    getStoredItem(STORAGE_KEYS.RECENT_RESULTS, [])
  );

  // Update localStorage when state changes
  useEffect(() => {
    // Only add to recentResults if result is not null, is a non-empty object, and clientRequest is non-empty
    if (
      result &&
      Object.keys(result).length > 0 &&
      clientRequest && clientRequest.trim().length > 0
    ) {
      localStorage.setItem(STORAGE_KEYS.RESULT, JSON.stringify(result));
      setRecentResults(prev => {
        const entry: RecentAnalysisEntry = {
          result,
          title: clientRequest,
          created: Date.now(),
        };
        // Dedupe by result JSON
        const updated = [entry, ...prev.filter(r => JSON.stringify(r.result) !== JSON.stringify(result))].slice(0, 3);
        localStorage.setItem(STORAGE_KEYS.RECENT_RESULTS, JSON.stringify(updated));
        return updated;
      });
    } else if (result === null) {
      localStorage.removeItem(STORAGE_KEYS.RESULT);
    }
  }, [result]);

  useEffect(() => {
    if (tokenUsage) {
      const validatedTokenUsage = validateTokenUsage(tokenUsage);
      localStorage.setItem(STORAGE_KEYS.TOKEN_USAGE, JSON.stringify(validatedTokenUsage));
      
      // Update state if we had to modify the values
      if (
        tokenUsage.promptTokens !== validatedTokenUsage.promptTokens ||
        tokenUsage.completionTokens !== validatedTokenUsage.completionTokens ||
        tokenUsage.totalTokens !== validatedTokenUsage.totalTokens
      ) {
        setTokenUsage(validatedTokenUsage);
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN_USAGE);
    }
  }, [tokenUsage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENT_REQUEST, JSON.stringify(clientRequest));
  }, [clientRequest]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAKEHOLDERS, JSON.stringify(stakeholders));
  }, [stakeholders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SYSTEMS, JSON.stringify(systems));
  }, [systems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANY_CONTEXT, JSON.stringify(companyContext));
  }, [companyContext]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENT_CONTEXT, JSON.stringify(clientContext));
  }, [clientContext]);

  // Function to clear all stored data
  const clearStoredData = () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    setResult(null);
    setTokenUsage(null);
    setClientRequest('');
    setStakeholders('');
    setSystems('');
    setCompanyContext('');
    setClientContext('');
  };

  // Function to clear only the current analysis, not the history
  const resetCurrentAnalysis = () => {
    setResult(null);
    setTokenUsage(null);
    setClientRequest('');
    setStakeholders('');
    setSystems('');
    setCompanyContext('');
    setClientContext('');
    // Do NOT clear recentResults or its localStorage
    localStorage.removeItem(STORAGE_KEYS.RESULT);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_USAGE);
    localStorage.removeItem(STORAGE_KEYS.CLIENT_REQUEST);
    localStorage.removeItem(STORAGE_KEYS.STAKEHOLDERS);
    localStorage.removeItem(STORAGE_KEYS.SYSTEMS);
    localStorage.removeItem(STORAGE_KEYS.COMPANY_CONTEXT);
    localStorage.removeItem(STORAGE_KEYS.CLIENT_CONTEXT);
  };

  const activateResult = (index: number) => {
    const selected = recentResults[index];
    if (selected) {
      setResult(selected.result);
      if (typeof setShowInput === 'function') setShowInput(false);
    }
  };

  const activateLatestResult = () => {
    if (recentResults.length > 0) {
      activateResult(0);
    }
  };

  const removeResult = (index: number) => {
    setRecentResults(prev => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem(STORAGE_KEYS.RECENT_RESULTS, JSON.stringify(updated));
      return updated;
    });
  };

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
    clientContext,
    setClientContext,
    showApiConfig,
    setShowApiConfig,
    error,
    setError,
    clearStoredData,
    resetCurrentAnalysis,
    setShowInput,
    recentResults,
    activateResult,
    activateLatestResult,
    removeResult,
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
