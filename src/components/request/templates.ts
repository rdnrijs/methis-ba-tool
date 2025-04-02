
import { SampleData } from '@/utils/supabaseService';

// Fallback sample data
export const UTILITY_SAMPLE_DATA = {
  clientRequest: "We need a comprehensive dashboard to monitor our smart grid infrastructure. The system should display real-time power usage metrics, integrate with our IoT sensors, and help identify potential maintenance issues before they cause outages.",
  stakeholders: "Grid Operations Team\nMaintenance Crews\nCustomer Service Representatives\nRegulatory Compliance Officers\nEnergy Efficiency Specialists\nSenior Management",
  systems: "Oracle Utility Management\nSCADA Control Systems\nSmart Meter Network\nWeather Monitoring System\nGIS Mapping Platform\nCustomer Relationship Management (CRM) System",
  companyContext: "PowerGrid Solutions is a mid-sized utility company serving approximately 500,000 customers across three states. We're currently transitioning to a smart grid infrastructure and need better tools to manage the increased data flow and monitoring requirements. Regulatory compliance and outage prevention are top priorities."
};

// Convert sample data to the format used in the application
export function convertSampleDataToAppFormat(sample: SampleData) {
  return {
    clientRequest: sample.client_request,
    stakeholders: sample.stakeholders || '',
    systems: sample.systems || '',
    companyContext: sample.company_context || ''
  };
}
