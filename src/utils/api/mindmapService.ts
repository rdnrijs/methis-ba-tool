import { UserStoryItem } from './types';
import { getSystemPromptById } from '../supabaseService';
import { getApiKey, getSelectedModel, getGoogleApiKey, getSelectedProvider } from '../storageUtils';
import { logLLMInput } from '../loggingService';

export interface MindmapResponse {
  mindmapSyntax: string;
  error?: string;
}

/**
 * Generate a mindmap visualization from user stories using a specific system prompt
 */
export const generateMindmapForUserStories = async (
  userStories: Array<string | UserStoryItem>,
  promptId: string = '4f813505-74e7-42bc-8c79-f296c3a1ef76'
): Promise<MindmapResponse> => {
  try {
    // Get the mindmap system prompt from the database
    const prompt = await getSystemPromptById(promptId);
    
    if (!prompt || !prompt.content) {
      console.error(`Failed to retrieve mindmap prompt with ID: ${promptId}`);
      return {
        mindmapSyntax: getMermaidFallbackSyntax(userStories),
        error: 'Failed to retrieve mindmap prompt'
      };
    }
    
    // Use the appropriate API key based on the selected provider
    const provider = getSelectedProvider();
    const apiKey = provider === 'google' ? getGoogleApiKey() : getApiKey();
    
    if (!apiKey) {
      console.error('API key not found for mindmap generation');
      return {
        mindmapSyntax: getMermaidFallbackSyntax(userStories),
        error: `${provider} API key not found`
      };
    }
    
    const model = getSelectedModel();
    
    // Prepare the user stories data for the API
    const userStoriesData = JSON.stringify(userStories, null, 2);
    
    // Call the appropriate API
    if (provider === 'google') {
      return await generateWithGemini(userStoriesData, apiKey, prompt.content, model);
    } else {
      return await generateWithOpenAI(userStoriesData, apiKey, prompt.content, model);
    }
  } catch (error) {
    console.error('Error generating mindmap:', error);
    return {
      mindmapSyntax: getMermaidFallbackSyntax(userStories),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Generate mindmap using OpenAI
 */
const generateWithOpenAI = async (
  userStoriesData: string,
  apiKey: string,
  systemPrompt: string,
  model: string = 'gpt-4-turbo-preview'
): Promise<MindmapResponse> => {
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
          { role: 'user', content: userStoriesData }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error for mindmap generation:', errorData);
      throw new Error(errorData.error?.message || 'Failed to generate mindmap with OpenAI');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract Mermaid syntax from the response
    const mermaidSyntax = extractMermaidSyntax(content);
    
    // Log the interaction
    logLLMInput({
      timestamp: new Date().toISOString(),
      systemPrompt,
      userInput: userStoriesData,
      model,
      response: content,
      tokenUsage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      }
    });

    return {
      mindmapSyntax: mermaidSyntax
    };
  } catch (error) {
    console.error('Error generating mindmap with OpenAI:', error);
    throw error;
  }
};

/**
 * Generate mindmap using Google's Gemini
 */
const generateWithGemini = async (
  userStoriesData: string,
  apiKey: string,
  systemPrompt: string,
  model: string = 'gemini-pro'
): Promise<MindmapResponse> => {
  try {
    // For Gemini, combine system prompt with user data
    const prompt = `${systemPrompt}\n\nUser Stories:\n${userStoriesData}`;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error for mindmap generation:', errorData);
      throw new Error(errorData.error?.message || 'Failed to generate mindmap with Gemini');
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    // Extract Mermaid syntax from the response
    const mermaidSyntax = extractMermaidSyntax(content);
    
    // Log the interaction (no token usage info for Gemini)
    logLLMInput({
      timestamp: new Date().toISOString(),
      systemPrompt,
      userInput: userStoriesData,
      model,
      response: content,
      tokenUsage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      }
    });

    return {
      mindmapSyntax: mermaidSyntax
    };
  } catch (error) {
    console.error('Error generating mindmap with Gemini:', error);
    throw error;
  }
};

/**
 * Extract Mermaid syntax from API response
 */
const extractMermaidSyntax = (content: string): string => {
  // Look for Mermaid syntax inside markdown code blocks
  const mermaidRegex = /```(?:mermaid)?\s*(mindmap[\s\S]*?)```/i;
  const match = content.match(mermaidRegex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // If no markdown code block found, but content starts with "mindmap"
  if (content.trim().startsWith('mindmap')) {
    return content.trim();
  }
  
  // Return the whole content as a fallback
  return content;
};

/**
 * Generate a simple fallback Mermaid mindmap syntax if API call fails
 */
const getMermaidFallbackSyntax = (userStories: Array<string | UserStoryItem>): string => {
  let syntax = 'mindmap\n  root((User Stories))';
  
  // Group stories by role
  const storiesByRole: Record<string, Array<string | UserStoryItem>> = {};
  
  userStories.forEach(story => {
    let role = 'Other';
    let storyText = '';
    
    if (typeof story === 'string') {
      const roleMatch = story.match(/As a ([^,]+)/i);
      role = roleMatch && roleMatch[1] ? roleMatch[1].trim() : 'Other';
      
      const goalMatch = story.match(/I want ([^,]+)/i);
      storyText = goalMatch && goalMatch[1] ? goalMatch[1].trim() : story.substring(0, 40);
    } else {
      role = story.persona || 'Other';
      storyText = story.goal || story.story || story.title || 'No description';
    }
    
    if (!storiesByRole[role]) {
      storiesByRole[role] = [];
    }
    
    storiesByRole[role].push(storyText);
  });
  
  // Add each role and its stories to the mindmap
  Object.entries(storiesByRole).forEach(([role, stories]) => {
    syntax += `\n    ${role}`;
    
    stories.forEach(story => {
      let storyText = typeof story === 'string' ? story : 
        (story.goal || story.story || story.title || 'No description');
        
      // Limit length to prevent overflow
      if (storyText.length > 40) {
        storyText = storyText.substring(0, 37) + '...';
      }
      
      // Escape special characters
      storyText = storyText.replace(/[\\]/g, '\\\\')
                          .replace(/[\"]/g, '\\\"')
                          .replace(/[\(]/g, '\\(')
                          .replace(/[\)]/g, '\\)')
                          .replace(/[\[]/g, '\\[')
                          .replace(/[\]]/g, '\\]');
      
      syntax += `\n      ${storyText}`;
    });
  });
  
  return syntax;
}; 