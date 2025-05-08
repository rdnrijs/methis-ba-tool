import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Users,
  Database,
  Building,
  Paperclip,
  ShieldCheck
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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';

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
  storedResult?: any;
  onContinueResult?: () => void;
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
  initialData,
  storedResult,
  onContinueResult
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
  // NIS2 checklist state structure
  // const [nis2Checklist, setNis2Checklist] = useState({
  //   riskManagement: '',
  //   incidentResponse: '',
  //   businessContinuity: '',
  //   supplyChain: '',
  //   securityTesting: '',
  //   encryption: '',
  //   accessControl: '',
  //   authentication: '',
  //   vulnerabilityManagement: '',
  //   reportingPotential: '',
  // });
  const [nis2Checked, setNis2Checked] = useState(false);
  const [nis2DialogOpen, setNis2DialogOpen] = useState(false);
  const [nis2Checklist, setNis2Checklist] = useState({
    riskManagement: '',
    incidentResponse: '',
    businessContinuity: '',
    supplyChain: '',
    securityTesting: '',
    encryption: '',
    accessControl: '',
    authentication: '',
    vulnerabilityManagement: '',
    reportingPotential: '',
  });

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
    // Estimate token count for all fields combined, including attachments and NIS2 checklist if enabled
    let allText = clientRequest + stakeholders + systems + companyContext + clientContext + attachmentsText;
    if (nis2Checked) {
      allText += Object.values(nis2Checklist).join(' ');
    }
    const total = estimateTokenCount(allText);
    setTokenCount(total);
  }, [clientRequest, stakeholders, systems, companyContext, clientContext, attachmentsText, nis2Checked, nis2Checklist]);

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
    // Helper to split by newlines and trim
    const splitToArray = (str: string) =>
      str
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

    // Build attachments array with filename and content
    const attachmentsArray = attachments.map((a, idx) => ({
      name: a.file.name,
      // If you have per-file content, use it here. Otherwise, fallback to all attachmentsText for now.
      content: attachmentsText // TODO: Replace with per-file content if available
    }));

    const jsonInput: any = {
      descriptionRequest: splitToArray(clientRequest),
      stakeholders: splitToArray(stakeholders),
      systemsApplications: splitToArray(systems),
      processesContext: splitToArray(companyContext),
      companyContext: splitToArray(clientContext),
      attachments: attachmentsArray,
    };

    if (nis2Checked) {
      jsonInput.nis2 = [
        {
          riskmanagement: nis2Checklist.riskManagement,
          incidentresponse: nis2Checklist.incidentResponse,
          businesscontinuity: nis2Checklist.businessContinuity,
          supplychain: nis2Checklist.supplyChain,
          securitytesting: nis2Checklist.securityTesting,
          encryptioncryptography: nis2Checklist.encryption,
          accesscontrolassetmanagement: nis2Checklist.accessControl,
          authentication: nis2Checklist.authentication,
          vulnerabilitymanagement: nis2Checklist.vulnerabilityManagement,
          reportingpotential: nis2Checklist.reportingPotential,
        },
      ];
    }

    onSubmit(
      clientRequest,
      JSON.stringify(jsonInput, null, 2),
      stakeholders,
      systems,
      companyContext,
      clientContext
    );
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
    <div className="space-y-4 w-full max-w-6xl mx-auto">
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
            {/* Two-column grid for Client Request and Business Processes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <ClientRequestField 
                  clientRequest={clientRequest}
                  onChange={setClientRequest}
                  showButtons={false}
                />
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
                  className="min-h-[200px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {companyContext.length} characters / ~{estimateTokenCount(companyContext)} tokens
                </div>
              </div>
            </div>
            {/* Stakeholders & Systems/Applications grid remains below */}
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
            {/* NIS2 Compliance Toggle and Dialog - now in a bordered card */}
            <div className="space-y-2 border border-input rounded-md p-4 mt-6">
              <div className="flex items-center mb-4">
                <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                <Label className="text-sm font-medium">Check for</Label>
              </div>
              <div className="flex items-center gap-4">
                <Switch id="nis2-toggle" checked={nis2Checked} onCheckedChange={setNis2Checked} />
                <Label htmlFor="nis2-toggle" className="text-sm font-medium cursor-pointer">NIS2 compliance</Label>
                <button
                  type="button"
                  className={
                    nis2Checked
                      ? 'text-muted-foreground underline text-xs hover:text-primary transition-colors'
                      : 'text-muted-foreground underline text-xs opacity-50 cursor-not-allowed'
                  }
                  disabled={!nis2Checked}
                  onClick={() => setNis2DialogOpen(true)}
                >
                  Open NIS2 checklist
                </button>
              </div>
            </div>
            <Dialog open={nis2DialogOpen} onOpenChange={(open) => {
              setNis2DialogOpen(open);
            }}>
              <DialogContent className="p-0 bg-background rounded-lg shadow-xl max-w-xl">
                <div className="w-full h-full bg-background rounded-lg">
                  <div className="border-b px-6 pt-6 pb-4 rounded-t-lg">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-semibold">NIS2 Checklist</DialogTitle>
                    </DialogHeader>
                  </div>
                  <form className="px-6 py-4 space-y-6 max-h-[80vh] overflow-y-auto">
                    <div className="space-y-2">
                      <Label className="font-medium text-base">Risk Management</Label>
                      <textarea className="min-h-[80px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="How are new cyber risks due to this change assessed? Are policy updates necessary? [127(a)]" value={nis2Checklist.riskManagement} onChange={e => setNis2Checklist(c => ({ ...c, riskManagement: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium text-base">Incident Response</Label>
                      <textarea className="min-h-[80px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Should incident response plans be updated to cover this new process/system? [127(b)]" value={nis2Checklist.incidentResponse} onChange={e => setNis2Checklist(c => ({ ...c, incidentResponse: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium text-base">Business Continuity</Label>
                      <textarea className="min-h-[80px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="What continuity and recovery requirements exist for this process/system in case of an incident? Are backup and recovery procedures needed? [127(c)]" value={nis2Checklist.businessContinuity} onChange={e => setNis2Checklist(c => ({ ...c, businessContinuity: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium text-base">Supply Chain</Label>
                      <textarea className="min-h-[80px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Has the security of involved suppliers been assessed? Are specific security requirements included in contracts? Are there vulnerabilities or practices by suppliers posing risks? [127(d), 42, 124(3)]" value={nis2Checklist.supplyChain} onChange={e => setNis2Checklist(c => ({ ...c, supplyChain: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium text-base">Security Testing</Label>
                      <textarea className="min-h-[80px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="How is the solution's security tested? Are specific tests (e.g., penetration tests) necessary? [127(e), 43]" value={nis2Checklist.securityTesting} onChange={e => setNis2Checklist(c => ({ ...c, securityTesting: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium text-base">Encryption / Cryptography</Label>
                      <textarea className="min-h-[80px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Should data processed or communicated by this process be encrypted? [127(f)]" value={nis2Checklist.encryption} onChange={e => setNis2Checklist(c => ({ ...c, encryption: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium text-base">Access Control & Asset Management</Label>
                      <textarea className="min-h-[80px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="What access controls are necessary for users and administrators of this system? How are assets managed? [127(g)]" value={nis2Checklist.accessControl} onChange={e => setNis2Checklist(c => ({ ...c, accessControl: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium text-base">Authentication</Label>
                      <textarea className="min-h-[80px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Is multi-factor authentication required for accessing this system/process? [127(h)]" value={nis2Checklist.authentication} onChange={e => setNis2Checklist(c => ({ ...c, authentication: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium text-base">Vulnerability Management</Label>
                      <textarea className="min-h-[80px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="How are vulnerabilities in the software/hardware identified and resolved?" value={nis2Checklist.vulnerabilityManagement} onChange={e => setNis2Checklist(c => ({ ...c, vulnerabilityManagement: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium text-base">Reporting Potential</Label>
                      <textarea className="min-h-[80px] resize-y w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Could an incident with this process/system lead to serious disruption or significant damage (significant incident)? [49, 128(3)]" value={nis2Checklist.reportingPotential} onChange={e => setNis2Checklist(c => ({ ...c, reportingPotential: e.target.value }))} />
                    </div>
                    <DialogFooter className="pt-2">
                      <DialogClose asChild>
                        <button
                          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-base font-medium"
                          onClick={() => setNis2DialogOpen(false)}
                        >
                          Save
                        </button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
            
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
