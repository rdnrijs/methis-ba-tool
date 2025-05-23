import { SampleData } from '@/utils/supabaseService';

// Convert sample data to the format used in the application
export function convertSampleDataToAppFormat(sample: SampleData) {
  console.log('Converting sample data to app format:', sample);
  
  // Ensure all fields are strings, even if null/undefined in database
  // Using the correct field mappings from database to frontend
  return {
    clientRequest: sample.client_request || '',
    stakeholders: sample.stakeholders || '',
    systems: sample.systems || '',
    companyContext: sample.processes_context || ''
  };
}
