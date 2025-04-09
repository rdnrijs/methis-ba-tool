
import { 
  getApiKey, 
  getSelectedModel, 
  getGoogleApiKey, 
  getSelectedProvider 
} from './storageUtils';

import { OpenAIResponse } from './api/types';
import { estimateCost, estimateTokenCount, modelCosts } from './api/costUtils';
import { getSystemPrompt } from './api/promptUtils';
import { analyzeWithOpenAI, validateApiKey } from './api/openaiService';
import { analyzeWithGemini, validateGoogleApiKey } from './api/geminiService';

// Re-export all needed types and functions
export type { RequirementAnalysisResult, TokenUsage, OpenAIResponse } from './api/types';

// Re-export utility functions
export { estimateCost, estimateTokenCount, modelCosts };

// Main analyze function that delegates to the appropriate service
export const analyzeRequirements = async (clientRequest: string, additionalContext?: string): Promise<OpenAIResponse> => {
  const provider = getSelectedProvider();
  let fullPrompt = clientRequest;
  
  if (additionalContext && additionalContext.trim() !== '') {
    fullPrompt += `\n\nAdditional Context:\n${additionalContext}`;
  }
  
  const systemPrompt = await getSystemPrompt();
  
  if (provider === 'google') {
    const apiKey = getGoogleApiKey();
    if (!apiKey) {
      throw new Error('Google API key not found. Please configure your Google API key first.');
    }
    
    const model = getSelectedModel();
    // For Google Gemini, we combine system prompt with user message
    return analyzeWithGemini(fullPrompt, apiKey, systemPrompt, model);
  } else {
    // Default to OpenAI
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('API key not found. Please configure your OpenAI API key first.');
    }
    
    const model = getSelectedModel();
    return analyzeWithOpenAI(fullPrompt, apiKey, systemPrompt, model);
  }
};

// Re-export validation functions
export { validateApiKey, validateGoogleApiKey };
