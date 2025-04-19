import { useEffect, useState } from 'react';
import { PageTitle } from '@/components/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { getLLMLogs, clearLLMLogs } from '@/utils/loggingService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Layout from '@/components/Layout';

interface LLMLog {
  timestamp: string;
  systemPrompt: string;
  userInput: string;
  model: string;
  response: string;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface CollapsibleSectionProps {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

const CollapsibleSection = ({ title, content, defaultOpen = true }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-md">
      <button 
        className="w-full flex justify-between items-center p-2 text-xs font-medium text-muted-foreground bg-background hover:bg-muted/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          {isOpen ? 
            <ChevronUp className="h-3 w-3 mr-2 text-primary" /> : 
            <ChevronDown className="h-3 w-3 mr-2 text-primary" />
          }
          {title}
        </span>
      </button>
      {isOpen && (
        <pre className="text-xs bg-muted/20 p-3 rounded-b-md overflow-x-auto whitespace-pre-wrap">
          {content}
        </pre>
      )}
    </div>
  );
};

const TokenUsageSection = ({ tokenUsage, defaultOpen = true }: { tokenUsage: LLMLog['tokenUsage'], defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-md">
      <button 
        className="w-full flex justify-between items-center p-2 text-xs font-medium text-muted-foreground bg-background hover:bg-muted/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          {isOpen ? 
            <ChevronUp className="h-3 w-3 mr-2 text-primary" /> : 
            <ChevronDown className="h-3 w-3 mr-2 text-primary" />
          }
          Token Usage
        </span>
      </button>
      {isOpen && (
        <div className="bg-muted/20 p-3 rounded-b-md">
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Prompt:</span>{' '}
              {tokenUsage.promptTokens}
            </div>
            <div>
              <span className="text-muted-foreground">Completion:</span>{' '}
              {tokenUsage.completionTokens}
            </div>
            <div>
              <span className="text-muted-foreground">Total:</span>{' '}
              {tokenUsage.totalTokens}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LogsPage = () => {
  const [logs, setLogs] = useState<LLMLog[]>([]);

  useEffect(() => {
    setLogs(getLLMLogs());
  }, []);

  const handleClearLogs = () => {
    clearLLMLogs();
    setLogs([]);
    toast.success('Logs cleared successfully');
  };

  const handleExportLogs = () => {
    const jsonString = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `llm-logs-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Logs exported successfully');
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <PageTitle 
            title="LLM Input Logs" 
            subtitle="View logs of system prompts and user inputs sent to the LLM" 
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportLogs}
              disabled={logs.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearLogs}
              disabled={logs.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Logs
            </Button>
          </div>
        </div>
        
        {logs.length === 0 ? (
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground text-center">
                No logs available. Logs will appear here when you make requests.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {logs.map((log, index) => (
              <Card key={log.timestamp} className="overflow-hidden">
                <CardHeader className="py-3 px-4 bg-muted/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Request #{logs.length - index}
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                      </span>
                      <span className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded">
                        {log.model}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                  <CollapsibleSection 
                    title="System Prompt" 
                    content={log.systemPrompt} 
                    defaultOpen={false}
                  />
                  
                  <CollapsibleSection 
                    title="User Input" 
                    content={log.userInput} 
                    defaultOpen={true}
                  />
                  
                  <CollapsibleSection 
                    title="Response" 
                    content={log.response} 
                    defaultOpen={false}
                  />
                  
                  <TokenUsageSection 
                    tokenUsage={log.tokenUsage} 
                    defaultOpen={false}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LogsPage; 