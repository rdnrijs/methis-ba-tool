
import { getCustomPrompt } from '../storageUtils';
import { getDefaultSystemPrompt } from '../supabaseService';
import { RequirementAnalysisResult } from './types';

// Get system prompt with fallbacks
export const getSystemPrompt = async (): Promise<string> => {
  // First check for user-configured prompt in local storage
  const customPrompt = getCustomPrompt();
  if (customPrompt) {
    console.log('Using custom prompt from local storage');
    return customPrompt;
  }
  
  // Get default from Supabase - no fallback to hardcoded default
  try {
    const dbPrompt = await getDefaultSystemPrompt();
    if (dbPrompt) {
      console.log('Using default prompt from database');
      return dbPrompt;
    } else {
      console.warn('No default system prompt found in database');
      throw new Error('No system prompt available in database. Please configure a system prompt in the database.');
    }
  } catch (error) {
    console.error('Error loading system prompt from database:', error);
    throw error;
  }
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
