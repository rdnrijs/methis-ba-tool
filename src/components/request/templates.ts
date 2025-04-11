
import { SampleData } from '@/utils/supabaseService';

// Convert sample data to the format used in the application
export function convertSampleDataToAppFormat(sample: SampleData) {
  return {
    clientRequest: sample.client_request,
    stakeholders: sample.stakeholders || '',
    systems: sample.systems || '',
    companyContext: sample.company_context || ''
  };
}
