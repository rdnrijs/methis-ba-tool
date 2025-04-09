
import { ModelCostsMap } from './types';

// Map to estimate costs for different models (in USD per 1K tokens)
export const modelCosts: ModelCostsMap = {
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4o-mini': { input: 0.0015, output: 0.006 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  'gemini-1.5-pro': { input: 0.0007, output: 0.0007 },
  'gemini-1.0-pro': { input: 0.0003, output: 0.0003 },
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
