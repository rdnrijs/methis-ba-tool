
import { OpenAIResponse, TokenUsage } from './types';
import { extractJsonFromResponse } from './promptUtils';

// Analyze with OpenAI API
export const analyzeWithOpenAI = async (
  fullPrompt: string,
  apiKey: string,
  systemPrompt: string,
  model: string
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
    
    const tokenUsage: TokenUsage = {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens
    };

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
