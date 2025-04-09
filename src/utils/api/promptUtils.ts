import { getCustomPrompt } from '../storageUtils';
import { getDefaultSystemPrompt } from '../supabaseService';
import { RequirementAnalysisResult } from './types';

// Default system prompt - This is now only a fallback if database and custom storage both fail
export const DEFAULT_SYSTEM_PROMPT = `As a senior business analyst, your role is to analyze client requirements and transform them into well-structured outputs. When a client provides a request, analyze it to extract the following components:

1. A concise summary (max 2 sentences)
2. Clear functional requirements (what the system should do)
3. Non-functional requirements (quality attributes)
4. Comprehensive user stories in "As a [persona], I want [goal], so that [reason]" format
5. Business rules and constraints
6. Key stakeholders involved
7. Recommended acceptance criteria for testing
8. Next steps in the project lifecycle

Return your analysis in JSON format with the following structure:
{
  "summary": "string",
  "functionalRequirements": ["string"],
  "nonFunctionalRequirements": ["string"],
  "userStories": [
    {
      "id": "string",
      "title": "string",
      "persona": "string",
      "goal": "string",
      "reason": "string",
      "acceptanceCriteria": ["string"]
    }
  ],
  "businessRules": ["string"],
  "stakeholders": ["string"],
  "acceptanceCriteria": ["string"],
  "nextSteps": ["string"]
}

Your analysis should be thorough, comprehensive, and tailored to the specific client request.`;

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
    } else {
      console.warn('No default system prompt found in database');
    }
  } catch (error) {
    console.error('Error loading system prompt from database:', error);
  }
  
  // Fall back to hardcoded default
  return DEFAULT_SYSTEM_PROMPT;
};

// Helper function to clean the response and extract JSON
export const extractJsonFromResponse = (content: string): any => {
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
