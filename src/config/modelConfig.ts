export const MODEL_CONFIG = {
  'gpt-4.1': {
    maxContextTokens: 128000,
    safeInputBuffer: 4000, // tokens reserved for output
  },
  'gpt-3.5-turbo': {
    maxContextTokens: 16000,
    safeInputBuffer: 1000,
  },
};

export function getModelLimits(model: keyof typeof MODEL_CONFIG) {
  const config = MODEL_CONFIG[model];
  return {
    ...config,
    safeInputTokens: config.maxContextTokens - config.safeInputBuffer,
  };
} 