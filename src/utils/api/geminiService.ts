import { OpenAIResponse, TokenUsage } from './types';
import { estimateTokenCount } from './costUtils';
import { extractJsonFromResponse } from './promptUtils';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logLLMInput } from '../loggingService';

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
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = getGeminiApiModelName(model);
    const geminiModel = genAI.getGenerativeModel({ model: modelName });

    const prompt = `${systemPrompt}\n\nUser Request: ${clientRequest}`;
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    const jsonResult = extractJsonFromResponse(content);

    // Estimate token usage since Gemini doesn't provide it directly
    const promptTokens = Math.ceil(prompt.length / 4);
    const completionTokens = Math.ceil(content.length / 4);
    const totalTokens = promptTokens + completionTokens;

    // Properly structure token usage
    const tokenUsage: TokenUsage = {
      promptTokens,
      completionTokens,
      totalTokens
    };

    console.log('Gemini estimated token usage:', tokenUsage);

    // Log the interaction with complete response
    logLLMInput({
      timestamp: new Date().toISOString(),
      systemPrompt,
      userInput: clientRequest,
      model: modelName,
      response: content,
      tokenUsage
    });

    return {
      result: jsonResult,
      tokenUsage
    };
  } catch (error) {
    console.error('Error analyzing requirements with Gemini:', error);
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
