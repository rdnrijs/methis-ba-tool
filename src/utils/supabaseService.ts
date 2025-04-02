
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
  const { data, error } = await supabase
    .from('system_prompts')
    .select('content')
    .eq('is_default', true)
    .single();
  
  if (error) {
    console.error('Error fetching default system prompt:', error);
    return null;
  }
  
  return data?.content || null;
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
  const { data, error } = await supabase
    .from('sample_data')
    .select('*')
    .eq('name', name)
    .maybeSingle();
  
  if (error) {
    console.error(`Error fetching sample data for ${name}:`, error);
    return null;
  }
  
  return data;
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
