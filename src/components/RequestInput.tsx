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
  RefreshCw 
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
  const [request, setRequest] = useState('');
  const [context, setContext] = useState('');
  const [showContext, setShowContext] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const [template, setTemplate] = useState('blank');
  const { toast } = useToast();
  
  useEffect(() => {
    // Estimate token count whenever request or context changes
    const total = estimateTokenCount(request + context);
    setTokenCount(total);
  }, [request, context]);
  
  const handleSubmit = () => {
    if (!request.trim()) {
      toast({
        variant: "destructive",
        title: "Request required",
        description: "Please enter a client request to analyze"
      });
      return;
    }
    
    onSubmit(request, context);
  };
  
  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    
    if (value === 'blank') {
      setRequest('');
      return;
    }
    
    if (value in TEMPLATE_CONTENT) {
      setRequest(TEMPLATE_CONTENT[value as keyof typeof TEMPLATE_CONTENT]);
    } else if (value in EXAMPLE_REQUESTS) {
      setRequest(EXAMPLE_REQUESTS[value as keyof typeof EXAMPLE_REQUESTS]);
    }
  };
  
  const handleLoadExample = (exampleId: string) => {
    if (exampleId in EXAMPLE_REQUESTS) {
      setRequest(EXAMPLE_REQUESTS[exampleId as keyof typeof EXAMPLE_REQUESTS]);
      setTemplate(exampleId);
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
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  <Label htmlFor="request" className="text-sm font-medium">Client Request</Label>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => handleLoadExample('e-commerce')}
                      >
                        <HelpCircle className="h-3.5 w-3.5 mr-1" />
                        Example
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-80">
                      <p className="text-xs">
                        Click to load an example request to see how the analyzer works.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                id="request"
                placeholder="Enter the client's request or requirements here..."
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                className="min-h-[200px] resize-y"
              />
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>
                  {request.length} characters / ~{estimateTokenCount(request)} tokens
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => setShowContext(!showContext)}
                >
                  {showContext ? 'Hide Context' : 'Add Context'}
                </Button>
              </div>
            </div>
            
            {showContext && (
              <div className="space-y-2 animate-fade-in animate-once pt-2">
                <div className="flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2 text-primary" />
                  <Label htmlFor="context" className="text-sm font-medium">Additional Context (Optional)</Label>
                </div>
                <Textarea
                  id="context"
                  placeholder="Add any additional context, documentation links, or background information..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="min-h-[100px] resize-y"
                />
                <div className="text-xs text-muted-foreground">
                  {context.length} characters / ~{estimateTokenCount(context)} tokens
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-muted-foreground">
                Total: ~{tokenCount} tokens
              </div>
              <Button 
                onClick={handleSubmit}
                disabled={isLoading || !request.trim()}
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
