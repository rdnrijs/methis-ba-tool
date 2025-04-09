
export interface RequirementAnalysisResult {
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  userStories: Array<string | UserStoryItem>;
  acceptanceCriteria: string[];
  assumptions: string[];
  followUpQuestions: string[];
  confidenceScore: number;
}

export interface UserStoryItem {
  role: string;
  want: string;
  benefit: string;
  story?: string; // Add the story property to match the component expectation
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

export interface ModelCost {
  input: number;
  output: number;
}

export type ModelCostsMap = Record<string, ModelCost>;
