export interface RequirementAnalysisResult {
  functionalRequirements: Requirement[];
  nonFunctionalRequirements: Requirement[];
  userStories: Array<string | UserStoryItem>;
  acceptanceCriteria: AcceptanceCriteria[];
  assumptions: string[];
  followUpQuestions: string[];
  confidenceScore: number;
}

export interface Requirement {
  title: string;
  description: string;
  priority?: string;
  dependencies?: string[];
  category?: string;
}

export interface AcceptanceCriteria {
  title: string;
  description: string;
  relatedRequirements?: string[];
}

export interface UserStoryItem {
  id: string;
  title: string;
  description: string;
  story?: string;
  persona?: string;
  goal?: string;
  reason?: string;
  acceptanceCriteria: string[];
  testcases?: string | string[];
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
