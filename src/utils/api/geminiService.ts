
import { OpenAIResponse, TokenUsage } from './types';
import { estimateTokenCount } from './costUtils';
import { extractJsonFromResponse } from './promptUtils';

// Map UI model names to actual API model names for Google Gemini
export const getGeminiApiModelName = (modelName: string): string => {
  const modelMap: Record<string, string> = {
    'gemini-1.5-pro': 'models/gemini-1.5-pro', 
    'gemini-1.0-pro': 'models/gemini-1.0-pro'
  };
  
  return modelMap[modelName] || 'models/gemini-1.0-pro'; // Default to gemini-1.0-pro if not found
};

// Analyze with Google Gemini API
export const analyzeWithGemini = async (
  clientRequest: string,
  apiKey: string,
  systemPrompt: string,
  model: string = 'gemini-1.0-pro'
): Promise<OpenAIResponse> => {
  // Get the correct API model name
  const apiModelName = getGeminiApiModelName(model);
  
  // Base API URL for Gemini
  const baseUrl = "https://generativelanguage.googleapis.com/v1/";
  const apiUrl = `${baseUrl}${apiModelName}:generateContent`;
  
  try {
    console.log(`Calling Gemini API with model: ${apiModelName}`);
    
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemPrompt}\n\nClient Request: ${clientRequest}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to analyze requirements with Google Gemini');
    }

    const data = await response.json();
    
    // Extract content from Gemini response
    const content = data.candidates[0].content.parts[0].text;
    const result = extractJsonFromResponse(content);
    
    // Gemini doesn't provide token usage stats, so we estimate
    const inputTokens = estimateTokenCount(clientRequest + systemPrompt);
    const outputTokens = estimateTokenCount(content);
    
    const tokenUsage: TokenUsage = {
      promptTokens: inputTokens,
      completionTokens: outputTokens,
      totalTokens: inputTokens + outputTokens
    };

    return {
      result,
      tokenUsage
    };
  } catch (error) {
    console.error('Error analyzing requirements with Google Gemini:', error);
    throw error;
  }
};

// Validate Google API key by making a small test request
export const validateGoogleApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    // Use the models endpoint to validate the key
    const apiUrl = 'https://generativelanguage.googleapis.com/v1/models';
    
    console.log('Validating Google API key with URL:', apiUrl);
    
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Validation response error:', errorData);
    }
    
    return response.ok;
  } catch (error) {
    console.error('Error validating Google API key:', error);
    return false;
  }
};
