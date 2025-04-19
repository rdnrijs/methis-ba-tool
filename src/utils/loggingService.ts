// For now, we'll store logs in localStorage
const STORAGE_KEY = 'llm_logs';

interface LLMLog {
  timestamp: string;
  systemPrompt: string;
  userInput: string;
  model: string;
  response: string;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export const logLLMInput = (logData: {
  timestamp: string;
  systemPrompt: string;
  userInput: string;
  model: string;
  response: string;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}) => {
  // Get existing logs
  const existingLogs = getLLMLogs();
  
  // Add new log to the beginning
  existingLogs.unshift(logData);
  
  // Store logs
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingLogs));
  
  return logData;
};

export const getLLMLogs = (): LLMLog[] => {
  const logsString = localStorage.getItem(STORAGE_KEY);
  if (!logsString) return [];
  
  try {
    return JSON.parse(logsString);
  } catch (error) {
    console.error('Error parsing logs:', error);
    return [];
  }
};

export const clearLLMLogs = () => {
  localStorage.removeItem(STORAGE_KEY);
}; 