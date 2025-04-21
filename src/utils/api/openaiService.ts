import { OpenAIResponse, TokenUsage } from './types';
import { extractJsonFromResponse } from './promptUtils';
import { logLLMInput } from '../loggingService';

// Analyze with OpenAI API
export const analyzeWithOpenAI = async (
  clientRequest: string,
  apiKey: string,
  systemPrompt: string,
  model: string = 'gpt-4-turbo-preview'
): Promise<OpenAIResponse> => {
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
          { role: 'user', content: clientRequest }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to analyze requirements with OpenAI');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const result = extractJsonFromResponse(content);

    // Convert OpenAI's snake_case to our camelCase
    const tokenUsage: TokenUsage = {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens
    };

    // Log the interaction with complete response
    logLLMInput({
      timestamp: new Date().toISOString(),
      systemPrompt,
      userInput: clientRequest,
      model,
      response: content,
      tokenUsage
    });

    console.log('OpenAI token usage:', tokenUsage);

    return {
      result,
      tokenUsage
    };
  } catch (error) {
    console.error('Error analyzing requirements with OpenAI:', error);
    throw error;
  }
};

// Validate OpenAI API key by making a small test request
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error validating OpenAI API key:', error);
    return false;
  }
};
