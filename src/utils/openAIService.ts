
import { getApiKey, getSelectedModel, getCustomPrompt } from './storageUtils';
import { getDefaultSystemPrompt } from './supabaseService';

export interface RequirementAnalysisResult {
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  userStories: string[];
  acceptanceCriteria: string[];
  assumptions: string[];
  followUpQuestions: string[];
  confidenceScore: number;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface OpenAIResponse {
  result: RequirementAnalysisResult;
  tokenUsage: TokenUsage;
}

// Map to estimate costs for different models (in USD per 1K tokens)
const modelCosts = {
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4o-mini': { input: 0.0015, output: 0.006 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
};

// Helper to estimate token count from text
export const estimateTokenCount = (text: string): number => {
  // Rough approximation: ~4 chars = 1 token
  return Math.ceil(text.length / 4);
};

// Estimate cost based on tokens and model
export const estimateCost = (inputTokens: number, outputTokens: number, model = 'gpt-4o'): number => {
  const modelRate = modelCosts[model as keyof typeof modelCosts] || modelCosts['gpt-4o'];
  
  const inputCost = (inputTokens / 1000) * modelRate.input;
  const outputCost = (outputTokens / 1000) * modelRate.output;
  
  return inputCost + outputCost;
};

// Default system prompt
export const DEFAULT_SYSTEM_PROMPT = `You are an expert business analyst specializing in requirements analysis. 
Your task is to analyze client requests and break them down into structured requirements.
Analyze the client request provided and return a JSON response with the following structure:

{
  "functionalRequirements": ["Requirement 1", "Requirement 2", ...],
  "nonFunctionalRequirements": ["Requirement 1", "Requirement 2", ...],
  "userStories": ["As a [role], I want [feature] so that [benefit]", ...],
  "acceptanceCriteria": ["Criteria 1", "Criteria 2", ...],
  "assumptions": ["Assumption 1", "Assumption 2", ...],
  "followUpQuestions": ["Question 1?", "Question 2?", ...],
  "confidenceScore": 0.85 // A number between 0 and 1 representing your confidence in the completeness of the analysis
}

Keep each requirement clear, concise, and focused on a single capability.
Include at least 3 follow-up questions if you need more information to improve the analysis.
Assign a confidence score based on how complete and clear the client request is.
IMPORTANT: Return ONLY the JSON object, with no additional text, markdown formatting, or code blocks.`;

// Get system prompt with fallbacks
export const getSystemPrompt = async (): Promise<string> => {
  // First check for user-configured prompt in local storage
  const customPrompt = getCustomPrompt();
  if (customPrompt) {
    return customPrompt;
  }
  
  // Then try to get default from Supabase
  try {
    const dbPrompt = await getDefaultSystemPrompt();
    if (dbPrompt) {
      return dbPrompt;
    }
  } catch (error) {
    console.error('Error loading system prompt from database:', error);
  }
  
  // Fall back to hardcoded default
  return DEFAULT_SYSTEM_PROMPT;
};

// Helper function to clean the response and extract JSON
const extractJsonFromResponse = (content: string): any => {
  // Try to parse directly first
  try {
    return JSON.parse(content);
  } catch (e) {
    // If direct parsing fails, try to extract JSON from markdown code blocks
    const jsonRegex = /```(?:json)?\s*({[\s\S]*?})\s*```/;
    const match = content.match(jsonRegex);
    
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (jsonError) {
        throw new Error(`Failed to parse JSON from response: ${jsonError.message}`);
      }
    }
    
    // If no code blocks, look for any JSON-like structure
    const possibleJsonRegex = /{[\s\S]*?}/;
    const jsonMatch = content.match(possibleJsonRegex);
    
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (jsonError) {
        throw new Error(`Failed to parse JSON structure from response: ${jsonError.message}`);
      }
    }
    
    throw new Error("No valid JSON found in the response");
  }
};

export const analyzeRequirements = async (clientRequest: string, additionalContext?: string): Promise<OpenAIResponse> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API key not found. Please configure your OpenAI API key first.');
  }
  
  const model = getSelectedModel();
  const systemPrompt = await getSystemPrompt();
  
  let fullPrompt = clientRequest;
  if (additionalContext && additionalContext.trim() !== '') {
    fullPrompt += `\n\nAdditional Context:\n${additionalContext}`;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: fullPrompt }
        ],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to analyze requirements');
    }

    const data = await response.json();
    
    // Extract and parse the JSON content, handling markdown formatting if present
    const content = data.choices[0].message.content;
    const result = extractJsonFromResponse(content);
    
    const tokenUsage = {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens
    };

    return {
      result,
      tokenUsage
    };
  } catch (error) {
    console.error('Error analyzing requirements:', error);
    throw error;
  }
};

// Validate API key by making a small test request
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
};
