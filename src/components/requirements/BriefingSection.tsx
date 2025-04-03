
import { FileText, Users, Database, Building, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ConfidenceIndicator from './ConfidenceIndicator';
import { formatDisplayText } from './DisplayUtils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';

interface BriefingSectionProps {
  clientRequest: string;
  stakeholders?: string;
  systems?: string;
  companyContext?: string;
  assumptions: string[];
  confidenceScore: number;
}

const BriefingSection = ({
  clientRequest,
  stakeholders,
  systems,
  companyContext,
  assumptions,
  confidenceScore
}: BriefingSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Management Briefing
        </CardTitle>
        <CardDescription>
          Concise summary of the client request and analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Client Request</h3>
            <p className="text-sm whitespace-pre-wrap">{formatDisplayText(clientRequest)}</p>
          </div>
          
          {(stakeholders || systems) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stakeholders && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Stakeholders
                  </h3>
                  <div className="text-sm whitespace-pre-wrap">
                    {formatDisplayText(stakeholders)}
                  </div>
                </div>
              )}
              
              {systems && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Database className="h-5 w-5 mr-2 text-primary" />
                    Systems & Applications
                  </h3>
                  <div className="text-sm whitespace-pre-wrap">
                    {formatDisplayText(systems)}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {companyContext && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                Company Context
              </h3>
              <div className="text-sm whitespace-pre-wrap">
                {formatDisplayText(companyContext)}
              </div>
            </div>
          )}
          
          <div className="p-4 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Assumptions Made</h3>
            {assumptions.length > 0 ? (
              <div className="space-y-0">
                {assumptions.map((assumption, index) => (
                  <div key={index} className="py-2 flex items-start group">
                    <Check className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">{assumption}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(assumption);
                        toast.success("Copied to clipboard");
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm">No assumptions were made during the analysis.</p>
            )}
          </div>
          
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                <path d="M12 2a9 9 0 1 0 9 9"></path>
                <path d="M12 12v-9"></path>
                <path d="M7 10.5 c1 1 3 1 4-1"></path>
                <path d="M15.5 8.5 c-1-0.5-2 1-2 2"></path>
              </svg>
              <span className="font-medium">Analysis Confidence</span>
            </div>
            <div className="w-1/3">
              <ConfidenceIndicator score={confidenceScore} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BriefingSection;
