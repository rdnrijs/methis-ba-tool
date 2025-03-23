import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, 
  HelpCircle, 
  FileText, 
  ClipboardList, 
  Send, 
  RefreshCw,
  Users,
  Database,
  Building
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from "@/components/ui/use-toast";
import { estimateTokenCount } from '@/utils/openAIService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface RequestInputProps {
  onSubmit: (request: string, context: string) => void;
  isLoading: boolean;
}

const EXAMPLE_REQUESTS = {
  'e-commerce': 'We need an e-commerce platform that allows users to browse products, add them to a cart, and check out securely. The platform should have user accounts, order history, and product reviews.',
  'mobile-app': 'Our company needs a mobile app for internal communication. Users should be able to send messages, share files, and set up group chats. We also need push notifications and read receipts.',
  'crm': 'Our sales team needs a CRM system to track customer interactions. We need contact management, lead tracking, opportunity management, and reports on sales pipeline metrics.',
  'analytics': 'We need a dashboard to visualize our website analytics. It should show user traffic, conversion rates, and engagement metrics. We want to filter data by date ranges and export reports.'
};

const REQUEST_TEMPLATES = [
  { id: 'blank', label: '-- Blank --' },
  { id: 'feature', label: 'New Feature Request' },
  { id: 'e-commerce', label: 'E-commerce Platform' },
  { id: 'mobile-app', label: 'Mobile Application' },
  { id: 'crm', label: 'CRM System' },
  { id: 'analytics', label: 'Analytics Dashboard' }
];

const TEMPLATE_CONTENT = {
  'feature': 'As a [type of user], I need a [feature name] that allows me to [accomplish what]. This is important because [business reason].\n\nThe feature should include:\n- [Key functionality 1]\n- [Key functionality 2]\n- [Key functionality 3]',
  // Other templates use EXAMPLE_REQUESTS 
};

const RequestInput = ({ onSubmit, isLoading }: RequestInputProps) => {
  const [clientRequest, setClientRequest] = useState('');
  const [stakeholders, setStakeholders] = useState('');
  const [systems, setSystems] = useState('');
  const [companyContext, setCompanyContext] = useState('');
  const [tokenCount, setTokenCount] = useState(0);
  const [template, setTemplate] = useState('blank');
  const { toast } = useToast();
  
  useEffect(() => {
    // Estimate token count for all fields combined
    const allText = clientRequest + stakeholders + systems + companyContext;
    const total = estimateTokenCount(allText);
    setTokenCount(total);
  }, [clientRequest, stakeholders, systems, companyContext]);
  
  const handleSubmit = () => {
    if (!clientRequest.trim()) {
      toast({
        variant: "destructive",
        title: "Request required",
        description: "Please enter a client request to analyze"
      });
      return;
    }
    
    // Combine all context fields into a structured format
    const contextData = [
      stakeholders && `Stakeholders: ${stakeholders}`,
      systems && `Systems & Applications: ${systems}`,
      companyContext && `Company Context: ${companyContext}`
    ].filter(Boolean).join('\n\n');
    
    onSubmit(clientRequest, contextData);
  };
  
  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    
    if (value === 'blank') {
      setClientRequest('');
      setStakeholders('');
      setSystems('');
      setCompanyContext('');
      return;
    }
    
    if (value in TEMPLATE_CONTENT) {
      setClientRequest(TEMPLATE_CONTENT[value as keyof typeof TEMPLATE_CONTENT]);
    } else if (value in EXAMPLE_REQUESTS) {
      setClientRequest(EXAMPLE_REQUESTS[value as keyof typeof EXAMPLE_REQUESTS]);
    }
  };
  
  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      <Card className="w-full glass-card animate-scale-in animate-once">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                <Label htmlFor="template" className="text-sm font-medium">Template</Label>
              </div>
              <div className="w-full md:w-72">
                <Select value={template} onValueChange={handleTemplateChange}>
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {REQUEST_TEMPLATES.map((tpl) => (
                      <SelectItem key={tpl.id} value={tpl.id}>{tpl.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                <Label htmlFor="clientRequest" className="text-sm font-medium">Detailed Description of Client Request</Label>
              </div>
              <Textarea
                id="clientRequest"
                placeholder="Enter a detailed description of what the client is requesting..."
                value={clientRequest}
                onChange={(e) => setClientRequest(e.target.value)}
                className="min-h-[120px] resize-y"
              />
              <div className="text-xs text-muted-foreground text-right">
                {clientRequest.length} characters / ~{estimateTokenCount(clientRequest)} tokens
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  <Label htmlFor="stakeholders" className="text-sm font-medium">Stakeholders</Label>
                </div>
                <Textarea
                  id="stakeholders"
                  placeholder="Who are the stakeholders involved?"
                  value={stakeholders}
                  onChange={(e) => setStakeholders(e.target.value)}
                  className="min-h-[100px] resize-y"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {stakeholders.length} characters / ~{estimateTokenCount(stakeholders)} tokens
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-primary" />
                  <Label htmlFor="systems" className="text-sm font-medium">Systems & Applications</Label>
                </div>
                <Textarea
                  id="systems"
                  placeholder="What systems or applications are involved?"
                  value={systems}
                  onChange={(e) => setSystems(e.target.value)}
                  className="min-h-[100px] resize-y"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {systems.length} characters / ~{estimateTokenCount(systems)} tokens
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                <Label htmlFor="companyContext" className="text-sm font-medium">Company Context</Label>
              </div>
              <Textarea
                id="companyContext"
                placeholder="Provide context about the company and relevant processes..."
                value={companyContext}
                onChange={(e) => setCompanyContext(e.target.value)}
                className="min-h-[100px] resize-y"
              />
              <div className="text-xs text-muted-foreground text-right">
                {companyContext.length} characters / ~{estimateTokenCount(companyContext)} tokens
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-muted-foreground">
                Total: ~{tokenCount} tokens
              </div>
              <Button 
                onClick={handleSubmit}
                disabled={isLoading || !clientRequest.trim()}
                className={cn(
                  "transition-all duration-300",
                  isLoading ? "w-[120px]" : "w-[100px]"
                )}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestInput;
