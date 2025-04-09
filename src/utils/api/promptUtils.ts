
import { getCustomPrompt } from '../storageUtils';
import { getDefaultSystemPrompt } from '../supabaseService';

// Default system prompt - This is now only a fallback if database and custom storage both fail
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
