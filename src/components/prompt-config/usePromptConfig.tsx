
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { saveCustomPrompt, getCustomPrompt, getApiKey } from '@/utils/storageUtils';
import { validateApiKey } from '@/utils/api/openaiService';
import { getDefaultSystemPrompt } from '@/utils/supabaseService';

export const usePromptConfig = (isOpen: boolean) => {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState('');

  useEffect(() => {
    const loadPrompt = async () => {
      if (!isOpen) return;
      
      setIsLoading(true);
      
      // First check if there's a custom prompt in local storage
      const savedPrompt = getCustomPrompt();
      
      if (savedPrompt) {
        setSystemPrompt(savedPrompt);
        setIsLoading(false);
        
        // Load the original database prompt in the background
        try {
          const defaultPrompt = await getDefaultSystemPrompt();
          if (defaultPrompt) {
            setOriginalPrompt(defaultPrompt);
          } else {
            toast.error("No default system prompt found in database");
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error loading default system prompt:', error);
          toast.error("Failed to load system prompt from database");
        }
        
        setIsLoading(false);
        return;
      }
      
      // If not, try to load the default prompt from Supabase
      try {
        const defaultPrompt = await getDefaultSystemPrompt();
        if (defaultPrompt) {
          setSystemPrompt(defaultPrompt);
          setOriginalPrompt(defaultPrompt);
        } else {
          // Show error if database has no prompts
          toast.error("No default system prompt found in database");
        }
      } catch (error) {
        console.error('Error loading default system prompt:', error);
        toast.error("Failed to load system prompt from database");
      } finally {
        setIsLoading(false);
      }
      
      setValidationError(null);
    };
    
    loadPrompt();
  }, [isOpen]);

  const validatePrompt = () => {
    // Validate that the prompt contains required elements
    if (!systemPrompt.includes('functionalRequirements') || 
        !systemPrompt.includes('nonFunctionalRequirements') || 
        !systemPrompt.includes('userStories')) {
      setValidationError("Prompt must include functionalRequirements, nonFunctionalRequirements, and userStories fields for the analyzer to work properly.");
      return false;
    }

    // Make sure it instructs to return JSON
    if (!systemPrompt.toLowerCase().includes('json')) {
      setValidationError("Prompt must instruct the model to return a JSON response.");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const testApiKey = async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setValidationError("No API key configured. Please set up your API key first.");
      return false;
    }

    setIsValidating(true);
    try {
      const isValid = await validateApiKey(apiKey);
      if (!isValid) {
        setValidationError("Invalid API key. Please check your OpenAI API key configuration.");
        return false;
      }
      return true;
    } catch (error) {
      setValidationError("Error validating API key. Please check your network connection and try again.");
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // First validate prompt format
      if (!validatePrompt()) {
        setIsSaving(false);
        return;
      }

      // Then validate API key
      const isApiKeyValid = await testApiKey();
      if (!isApiKeyValid) {
        setIsSaving(false);
        return;
      }

      saveCustomPrompt(systemPrompt);
      toast.success("Prompt configuration saved successfully!");
      return true;
    } catch (error) {
      toast.error("Failed to save prompt configuration.");
      console.error(error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      if (originalPrompt) {
        setSystemPrompt(originalPrompt);
        toast.info("Prompt reset to database original.");
      } else {
        // Reload the database prompt
        const defaultPrompt = await getDefaultSystemPrompt();
        if (defaultPrompt) {
          setSystemPrompt(defaultPrompt);
          setOriginalPrompt(defaultPrompt);
          toast.info("Prompt reset to database default.");
        } else {
          toast.error("No default system prompt found in database");
        }
      }
    } catch (error) {
      console.error('Error resetting to default prompt:', error);
      toast.error("Failed to reset prompt from database");
    } finally {
      setValidationError(null);
      setIsLoading(false);
    }
  };

  return {
    systemPrompt,
    setSystemPrompt,
    isSaving,
    isValidating,
    validationError,
    isLoading,
    handleSave,
    handleReset,
  };
};
