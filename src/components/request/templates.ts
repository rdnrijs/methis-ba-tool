export const EXAMPLE_REQUESTS = {
  'e-commerce': 'We need an e-commerce platform that allows users to browse products, add them to a cart, and check out securely. The platform should have user accounts, order history, and product reviews.',
  'mobile-app': 'Our company needs a mobile app for internal communication. Users should be able to send messages, share files, and set up group chats. We also need push notifications and read receipts.',
  'crm': 'Our sales team needs a CRM system to track customer interactions. We need contact management, lead tracking, opportunity management, and reports on sales pipeline metrics.',
  'analytics': 'We need a dashboard to visualize our website analytics. It should show user traffic, conversion rates, and engagement metrics. We want to filter data by date ranges and export reports.'
};

export const REQUEST_TEMPLATES = [
  { id: 'blank', label: '-- Blank --' },
  { id: 'feature', label: 'New Feature Request' },
  { id: 'e-commerce', label: 'E-commerce Platform' },
  { id: 'mobile-app', label: 'Mobile Application' },
  { id: 'crm', label: 'CRM System' },
  { id: 'analytics', label: 'Analytics Dashboard' }
];

export const TEMPLATE_CONTENT = {
  'feature': 'As a [type of user], I need a [feature name] that allows me to [accomplish what]. This is important because [business reason].\n\nThe feature should include:\n- [Key functionality 1]\n- [Key functionality 2]\n- [Key functionality 3]',
  'e-commerce': EXAMPLE_REQUESTS['e-commerce'],
  'mobile-app': EXAMPLE_REQUESTS['mobile-app'],
  'crm': EXAMPLE_REQUESTS['crm'],
  'analytics': EXAMPLE_REQUESTS['analytics'],
};
