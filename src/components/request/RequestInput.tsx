import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Users,
  Database,
  Building,
  Paperclip
} from 'lucide-react';
import { estimateTokenCount } from '@/utils/openAIService';
import { cn } from '@/lib/utils';
import ClientRequestField from './ClientRequestField';
import SubmitButton from './SubmitButton';
import ClientSelector from './ClientSelector';
import { Client } from '@/utils/supabaseService';
import TemplateSelector from './TemplateSelector';
import PromptConfig from '@/components/PromptConfig';
import { FileAttachment, FileAttachment as FileAttachmentType } from '@/components/ui/file-attachment';
import { storeAttachment, getAttachment, deleteAttachment, extractTextFromAttachments } from '@/utils/fileStorageUtils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { getAllSampleData, getSampleDataById } from '@/utils/supabaseService';

interface RequestInputProps {
  onSubmit: (request: string, context: string, stakeholders: string, systems: string, companyContext: string, clientContext: string) => void;
  isLoading: boolean;
  onLoadSample: () => void;
  isLoadingSample: boolean;
  initialData?: {
    clientRequest: string;
    stakeholders: string;
    systems: string;
    companyContext: string;
    clientContext: string;
  };
}

const REQUEST_TEMPLATES = [
  { id: 'blank', label: '-- Blank --' },
  { id: 'feature', label: 'New Feature Request' },
  { id: 'e-commerce', label: 'E-commerce Platform' },
  { id: 'mobile-app', label: 'Mobile Application' },
  { id: 'crm', label: 'CRM System' },
  { id: 'analytics', label: 'Analytics Dashboard' }
];

const RequestInput = ({ 
  onSubmit, 
  isLoading, 
  onLoadSample, 
  isLoadingSample,
  initialData 
}: RequestInputProps) => {
  const [clientRequest, setClientRequest] = useState(initialData?.clientRequest || '');
  const [stakeholders, setStakeholders] = useState(initialData?.stakeholders || '');
  const [systems, setSystems] = useState(initialData?.systems || '');
  const [companyContext, setCompanyContext] = useState(initialData?.companyContext || '');
  const [clientContext, setClientContext] = useState(initialData?.clientContext || '');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [tokenCount, setTokenCount] = useState(0);
  const [template, setTemplate] = useState('blank');
  const [attachments, setAttachments] = useState<FileAttachmentType[]>([]);
  const [sampleDropdownOpen, setSampleDropdownOpen] = useState(false);
  const [sampleOptions, setSampleOptions] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);

  // Load attachments from IndexedDB on mount
  useEffect(() => {
    (async () => {
      // For demo: load all attachments (could be filtered by session/user)
      // You may want to implement getAllAttachments utility for bulk load
      setAttachments([]); // Placeholder: implement getAllAttachments if needed
    })();
  }, []);

  // Add new attachments and persist
  const handleAttach = async (newAttachments: FileAttachmentType[]) => {
    setAttachments(newAttachments);
    // Persist each new attachment
    for (const att of newAttachments) {
      await storeAttachment(att);
    }
  };

  // Remove attachment and update storage
  const handleRemove = async (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    await deleteAttachment(id);
  };

  // Extract text from all attachments for token counting and prompt
  const [attachmentsText, setAttachmentsText] = useState('');
  useEffect(() => {
    (async () => {
      const text = await extractTextFromAttachments(attachments);
      setAttachmentsText(text);
    })();
  }, [attachments]);

  useEffect(() => {
    // Estimate token count for all fields combined, including attachments
    const allText = clientRequest + stakeholders + systems + companyContext + clientContext + attachmentsText;
    const total = estimateTokenCount(allText);
    setTokenCount(total);
  }, [clientRequest, stakeholders, systems, companyContext, clientContext, attachmentsText]);

  // Update local state when initialData changes
  useEffect(() => {
    if (initialData) {
      setClientRequest(initialData.clientRequest || '');
      setStakeholders(initialData.stakeholders || '');
      setSystems(initialData.systems || '');
      setCompanyContext(initialData.companyContext || '');
      setClientContext(initialData.clientContext || '');
    }
  }, [initialData]);
  
  const handleClientSelect = (client: Client | null) => {
    setSelectedClient(client);
    if (client) {
      setClientContext(client.client_context || '');
    }
  };
  
  const handleSubmit = async () => {
    if (!clientRequest.trim()) {
      return;
    }
    // Combine all context fields into a structured format, including attachments
    const contextData = [
      stakeholders && `Stakeholders: ${stakeholders}`,
      systems && `Systems & Applications: ${systems}`,
      clientContext && `Client Context: ${clientContext}`,
      companyContext && `Business Process Context: ${companyContext}`,
      attachmentsText && `\n\n--- Attachments ---\n${attachmentsText}`
    ].filter(Boolean).join('\n\n');
    onSubmit(clientRequest, contextData, stakeholders, systems, companyContext, clientContext);
  };

  // Fetch all samples when dropdown is opened
  const handleOpenChange = async (open: boolean) => {
    setSampleDropdownOpen(open);
    if (open && sampleOptions.length === 0) {
      setIsLoadingSamples(true);
      const samples = await getAllSampleData();
      setSampleOptions(samples.map(s => ({ id: s.id, name: s.name })));
      setIsLoadingSamples(false);
    }
  };

  // Load a sample by ID and update form fields
  const handleSampleSelect = async (id: string) => {
    setSampleDropdownOpen(false);
    const sample = await getSampleDataById(id);
    if (sample) {
      setClientRequest(sample.client_request || '');
      setStakeholders(sample.stakeholders || '');
      setSystems(sample.systems || '');
      setCompanyContext(sample.processes_context || '');
      // setClientContext(sample.clientContext || ''); // clientContext removed
    }
  };

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      <Card className="w-full glass-card animate-scale-in animate-once">
        <CardHeader className="pb-0">
          <div className="flex justify-end gap-2">
            <DropdownMenu open={sampleDropdownOpen} onOpenChange={handleOpenChange}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isLoadingSamples}>
                  {isLoadingSamples ? 'Loading...' : 'Load Sample'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sampleOptions.length === 0 && (
                  <DropdownMenuItem disabled>No samples found</DropdownMenuItem>
                )}
                {sampleOptions.map((sample) => (
                  <DropdownMenuItem key={sample.id} onSelect={() => handleSampleSelect(sample.id)}>
                    {sample.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <PromptConfig />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <ClientSelector onClientSelect={handleClientSelect} />
            
            {/* Client request as a standalone section */}
            <div className="space-y-1">
              <ClientRequestField 
                clientRequest={clientRequest}
                onChange={setClientRequest}
                showButtons={false}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  <Label htmlFor="stakeholders" className="text-sm font-medium">Stakeholders</Label>
                </div>
                <textarea
                  id="stakeholders"
                  placeholder="Who are the stakeholders involved?"
                  value={stakeholders}
                  onChange={(e) => setStakeholders(e.target.value)}
                  className="min-h-[100px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                <textarea
                  id="systems"
                  placeholder="What systems or applications are involved?"
                  value={systems}
                  onChange={(e) => setSystems(e.target.value)}
                  className="min-h-[100px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {systems.length} characters / ~{estimateTokenCount(systems)} tokens
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                <Label htmlFor="companyContext" className="text-sm font-medium">Business Processes</Label>
              </div>
              <textarea
                id="companyContext"
                placeholder="Describe relevant business processes, workflows, or operations..."
                value={companyContext}
                onChange={(e) => setCompanyContext(e.target.value)}
                className="min-h-[100px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="text-xs text-muted-foreground text-right">
                {companyContext.length} characters / ~{estimateTokenCount(companyContext)} tokens
              </div>
            </div>
            
            {/* Attachments section moved to the bottom */}
            <div className="space-y-2 border border-input rounded-md p-4">
              <div className="flex items-center mb-2">
                <Paperclip className="h-5 w-5 mr-2 text-primary" />
                <Label className="text-sm font-medium">Attachments</Label>
              </div>
              <FileAttachment 
                attachments={attachments}
                onAttach={handleAttach}
                onRemove={handleRemove}
                maxSize={10}
                maxFiles={5}
                accept=".txt,.pdf,.docx,.pptx,.md,.json,.csv"
              />
              {attachments.length > 0 && (
                <div className="text-xs text-muted-foreground text-right mt-1">
                  ~{estimateTokenCount(attachmentsText)} tokens from attachments
                </div>
              )}
            </div>
            
            <SubmitButton 
              isLoading={isLoading}
              isDisabled={!clientRequest.trim()}
              onClick={handleSubmit}
              tokenCount={tokenCount}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestInput;
