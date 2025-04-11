
import { supabase } from '@/integrations/supabase/client';

export interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface SampleData {
  id: string;
  name: string;
  client_request: string;
  stakeholders: string | null;
  systems: string | null;
  company_context: string | null;
  created_at: string;
  updated_at: string;
}

export async function getDefaultSystemPrompt(): Promise<string | null> {
  console.log('Fetching default system prompt from database...');
  
  try {
    // First try to find a prompt with is_default = true
    const { data: defaultPrompt, error: defaultError } = await supabase
      .from('system_prompts')
      .select('content')
      .eq('is_default', true)
      .maybeSingle();
    
    if (!defaultError && defaultPrompt) {
      console.log('Found default system prompt by is_default flag');
      return defaultPrompt.content;
    }
    
    // If no default prompt by flag, try to find one by name
    const { data, error } = await supabase
      .from('system_prompts')
      .select('content')
      .eq('name', 'Default System Prompt')
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching default system prompt:', error);
      return null;
    }
    
    if (!data) {
      console.warn('No default system prompt found in database');
      return null;
    }
    
    console.log('Successfully loaded system prompt from database by name');
    return data.content;
  } catch (error) {
    console.error('Exception while fetching default system prompt:', error);
    return null;
  }
}

export async function getAllSystemPrompts(): Promise<SystemPrompt[]> {
  const { data, error } = await supabase
    .from('system_prompts')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching system prompts:', error);
    return [];
  }
  
  return data || [];
}

export async function getSampleData(name: string): Promise<SampleData | null> {
  console.log(`Fetching sample data with name: ${name}...`);
  
  try {
    const { data, error } = await supabase
      .from('sample_data')
      .select('*')
      .ilike('name', name) // Using case-insensitive comparison to handle different formats
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching sample data for ${name}:`, error);
      return null;
    }
    
    if (!data) {
      console.warn(`No sample data found with name: ${name}`);
      return null;
    }
    
    console.log(`Successfully loaded sample data for: ${name}`);
    return data;
  } catch (e) {
    console.error(`Exception while fetching sample data for ${name}:`, e);
    return null;
  }
}

export async function getAllSampleData(): Promise<SampleData[]> {
  const { data, error } = await supabase
    .from('sample_data')
    .select('*');
  
  if (error) {
    console.error('Error fetching all sample data:', error);
    return [];
  }
  
  return data || [];
}
