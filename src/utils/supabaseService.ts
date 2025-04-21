import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';

export type Tables = Database['public']['Tables']
export type SystemPrompt = Tables['system_prompts']['Row']
export type SampleData = Tables['sample_data']['Row']
export type Client = Tables['client']['Row']

export async function getAllClients(): Promise<Client[]> {
  console.log('Fetching all clients...');
  
  try {
    const { data, error } = await supabase
      .from('client')
      .select('*')
      .order('client_name');
    
    if (error) {
      // Check if the error is because the table doesn't exist
      if (error.code === '42P01') {
        console.warn('Clients table does not exist yet');
        return [];
      }
      console.error('Error fetching clients:', error);
      throw error;
    }
    
    return data || [];
  } catch (e) {
    console.error('Exception while fetching clients:', e);
    throw e;
  }
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
    // First try with the exact name
    const { data, error } = await supabase
      .from('sample_data')
      .select('*')
      .eq('name', name)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching sample data for ${name}:`, error);
      return null;
    }
    
    if (data) {
      console.log(`Successfully loaded sample data for: ${name}`);
      return data;
    }
    
    // Try with different casing
    const { data: caseData, error: caseError } = await supabase
      .from('sample_data')
      .select('*')
      .ilike('name', name)
      .maybeSingle();
    
    if (!caseError && caseData) {
      console.log(`Found sample data with case-insensitive match for: ${name}`);
      return caseData;
    }
    
    // If no match, try a less strict comparison
    const { data: fuzzyData, error: fuzzyError } = await supabase
      .from('sample_data')
      .select('*')
      .ilike('name', `%${name}%`)
      .maybeSingle();
    
    if (fuzzyError) {
      console.error(`Error in fuzzy search for ${name}:`, fuzzyError);
      return null;
    }
    
    if (!fuzzyData) {
      console.warn(`No sample data found with name similar to: ${name}`);
      return null;
    }
    
    console.log(`Found sample data with fuzzy match for: ${name}`);
    return fuzzyData;
  } catch (e) {
    console.error(`Exception while fetching sample data for ${name}:`, e);
    return null;
  }
}

export async function getSampleDataById(id: string): Promise<SampleData | null> {
  console.log(`Fetching sample data with ID: ${id}...`);
  
  try {
    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('Current auth status:', sessionData.session ? 'Authenticated' : 'Not authenticated');
    
    if (!sessionData.session) {
      console.warn('User is not authenticated when trying to fetch sample data');
    }
    
    const { data, error } = await supabase
      .from('sample_data')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching sample data with ID ${id}:`, error);
      
      // Check specifically for auth/permission related errors
      if (error.code === 'PGRST301' || error.message.includes('permission denied')) {
        console.error('This appears to be an authorization error. Check RLS policies on the sample_data table.');
      }
      
      return null;
    }
    
    if (!data) {
      console.warn(`No sample data found with ID: ${id}`);
      return null;
    }
    
    console.log(`Successfully loaded sample data with ID: ${id}`);
    return data;
  } catch (e) {
    console.error(`Exception while fetching sample data with ID ${id}:`, e);
    return null;
  }
}

export async function getAllSampleData(): Promise<SampleData[]> {
  console.log('Fetching all sample data...');
  
  try {
    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('Current auth status:', sessionData.session ? 'Authenticated' : 'Not authenticated');
    
    if (!sessionData.session) {
      console.warn('User is not authenticated when trying to fetch all sample data');
    }
    
    const { data, error } = await supabase
      .from('sample_data')
      .select('*');
  
    if (error) {
      console.error('Error fetching all sample data:', error);
      
      // Check specifically for auth/permission related errors
      if (error.code === 'PGRST301' || error.message.includes('permission denied')) {
        console.error('This appears to be an authorization error. Check RLS policies on the sample_data table.');
      }
      
      return [];
    }
    
    console.log(`Found ${data?.length || 0} sample data records`);
    return data || [];
  } catch (e) {
    console.error('Exception while fetching all sample data:', e);
    return [];
  }
}

export async function getSystemPromptById(id: string): Promise<SystemPrompt | null> {
  console.log(`Fetching system prompt with ID: ${id}...`);
  
  try {
    const { data, error } = await supabase
      .from('system_prompts')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching system prompt with ID ${id}:`, error);
      return null;
    }
    
    if (!data) {
      console.warn(`No system prompt found with ID: ${id}`);
      return null;
    }
    
    console.log(`Successfully loaded system prompt with ID: ${id}`);
    return data;
  } catch (e) {
    console.error(`Exception while fetching system prompt with ID ${id}:`, e);
    return null;
  }
}
