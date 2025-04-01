
import { RequestTemplate, SampleData } from '@/utils/supabaseService';

// These are fallback templates used when Supabase data can't be loaded
export const EXAMPLE_REQUESTS = {
  'e-commerce': 'We need an e-commerce platform that allows users to browse products, add them to a cart, and check out securely. The platform should have user accounts, order history, and product reviews.',
  'mobile-app': 'Our company needs a mobile app for internal communication. Users should be able to send messages, share files, and set up group chats. We also need push notifications and read receipts.',
  'crm': 'Our sales team needs a CRM system to track customer interactions. We need contact management, lead tracking, opportunity management, and reports on sales pipeline metrics.',
  'analytics': 'We need a dashboard to visualize our website analytics. It should show user traffic, conversion rates, and engagement metrics. We want to filter data by date ranges and export reports.',
  'utility': 'We need a system to monitor and manage our electric grid infrastructure. The platform should track power distribution, outages, and maintenance schedules. Users need to view real-time consumption data and manage customer service requests.'
};

// Fallback templates
export const REQUEST_TEMPLATES = [
  { id: 'blank', label: '-- Blank --' },
  { id: 'feature', label: 'New Feature Request' },
  { id: 'e-commerce', label: 'E-commerce Platform' },
  { id: 'mobile-app', label: 'Mobile Application' },
  { id: 'crm', label: 'CRM System' },
  { id: 'analytics', label: 'Analytics Dashboard' },
  { id: 'utility', label: 'Utility Management System' }
];

export const TEMPLATE_CONTENT = {
  'feature': 'As a [type of user], I need a [feature name] that allows me to [accomplish what]. This is important because [business reason].\n\nThe feature should include:\n- [Key functionality 1]\n- [Key functionality 2]\n- [Key functionality 3]',
  'e-commerce': EXAMPLE_REQUESTS['e-commerce'],
  'mobile-app': EXAMPLE_REQUESTS['mobile-app'],
  'crm': EXAMPLE_REQUESTS['crm'],
  'analytics': EXAMPLE_REQUESTS['analytics'],
  'utility': EXAMPLE_REQUESTS['utility'],
};

// Sample stakeholders for fallback templates
export const TEMPLATE_STAKEHOLDERS = {
  'feature': 'Product Manager\nDevelopment Team\nQA Team\nEnd Users',
  'e-commerce': 'Online Shoppers\nStore Administrators\nInventory Managers\nCustomer Support Team',
  'mobile-app': 'Field Workers\nTeam Managers\nHR Department\nIT Support',
  'crm': 'Sales Representatives\nSales Managers\nMarketing Team\nCustomer Support',
  'analytics': 'Marketing Analysts\nProduct Managers\nExecutive Team\nContent Creators',
  'utility': 'Grid Operators\nMaintenance Teams\nCustomer Service Reps\nRegulatory Compliance Officers'
};

// Sample systems for fallback templates
export const TEMPLATE_SYSTEMS = {
  'feature': 'Frontend Application\nBackend API\nDatabase\nIntegration Services',
  'e-commerce': 'Product Catalog System\nInventory Management\nPayment Processing\nOrder Fulfillment',
  'mobile-app': 'iOS Application\nAndroid Application\nBackend API\nPush Notification Service',
  'crm': 'Contact Management\nSales Pipeline\nEmail Marketing\nReporting Dashboard',
  'analytics': 'Data Collection API\nData Warehouse\nVisualization Engine\nExport Services',
  'utility': 'Smart Meter Network\nSCADA System\nCustomer Portal\nMaintenance Scheduling'
};

// Sample company context for fallback templates
export const TEMPLATE_COMPANY_CONTEXT = {
  'feature': 'Our company is focused on delivering high-quality software solutions to enterprise clients. This feature is part of our Q3 roadmap to improve user experience.',
  'e-commerce': 'Our retail business has been operating for 10 years with physical stores and now needs to expand online to reach more customers and compete with digital-native retailers.',
  'mobile-app': 'Our organization has 500+ field workers who need better communication tools while on client sites. Current process relies on emails and phone calls which causes delays.',
  'crm': 'Our sales team of 50 people currently uses spreadsheets to track leads and opportunities, leading to data inconsistencies and missed follow-ups.',
  'analytics': 'Our marketing team needs better insights into website performance to optimize campaigns and content strategy. Current tools are limited and don't provide actionable data.',
  'utility': 'Our utility company serves 500,000 customers across three states and is upgrading to smart grid infrastructure to improve reliability and reduce operational costs.'
};

// Fallback sample data
export const UTILITY_SAMPLE_DATA = {
  clientRequest: "We need a comprehensive dashboard to monitor our smart grid infrastructure. The system should display real-time power usage metrics, integrate with our IoT sensors, and help identify potential maintenance issues before they cause outages.",
  stakeholders: "Grid Operations Team\nMaintenance Crews\nCustomer Service Representatives\nRegulatory Compliance Officers\nEnergy Efficiency Specialists\nSenior Management",
  systems: "Oracle Utility Management\nSCADA Control Systems\nSmart Meter Network\nWeather Monitoring System\nGIS Mapping Platform\nCustomer Relationship Management (CRM) System",
  companyContext: "PowerGrid Solutions is a mid-sized utility company serving approximately 500,000 customers across three states. We're currently transitioning to a smart grid infrastructure and need better tools to manage the increased data flow and monitoring requirements. Regulatory compliance and outage prevention are top priorities."
};

// Convert Supabase templates to the format needed by the component
export function convertDbTemplatesToComponentFormat(templates: RequestTemplate[]) {
  return templates.map(template => ({
    id: template.template_id,
    label: template.label
  }));
}

// Create content mapping from templates for all fields
export function createTemplateContentMap(templates: RequestTemplate[]) {
  const contentMap: Record<string, string> = {};
  
  templates.forEach(template => {
    if (template.content) {
      contentMap[template.template_id] = template.content;
    }
  });
  
  return contentMap;
}

export function createTemplateStakeholdersMap(templates: RequestTemplate[]) {
  const stakeholdersMap: Record<string, string> = {};
  
  templates.forEach(template => {
    if (template.stakeholders) {
      stakeholdersMap[template.template_id] = template.stakeholders;
    }
  });
  
  return stakeholdersMap;
}

export function createTemplateSystemsMap(templates: RequestTemplate[]) {
  const systemsMap: Record<string, string> = {};
  
  templates.forEach(template => {
    if (template.systems) {
      systemsMap[template.template_id] = template.systems;
    }
  });
  
  return systemsMap;
}

export function createTemplateCompanyContextMap(templates: RequestTemplate[]) {
  const contextMap: Record<string, string> = {};
  
  templates.forEach(template => {
    if (template.company_context) {
      contextMap[template.template_id] = template.company_context;
    }
  });
  
  return contextMap;
}

// Convert sample data to the format used in the application
export function convertSampleDataToAppFormat(sample: SampleData) {
  return {
    clientRequest: sample.client_request,
    stakeholders: sample.stakeholders || '',
    systems: sample.systems || '',
    companyContext: sample.company_context || ''
  };
}
