import { Users, Database, Building } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { estimateTokenCount } from '@/utils/openAIService';

interface ContextFieldsProps {
  stakeholders: string;
  systems: string;
  companyContext: string;
  onStakeholdersChange: (value: string) => void;
  onSystemsChange: (value: string) => void;
  onCompanyContextChange: (value: string) => void;
}

const ContextFields = ({ 
  stakeholders, 
  systems, 
  companyContext,
  onStakeholdersChange,
  onSystemsChange,
  onCompanyContextChange
}: ContextFieldsProps) => {
  // Function to format text for display
  const formatDisplayText = (text: string) => {
    return text.replace(/\\n/g, '\n');
  };
  
  // Function to handle text input changes
  const handleTextChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setter(e.target.value);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            <Label htmlFor="stakeholders" className="text-sm font-medium">Stakeholders</Label>
          </div>
          <Textarea
            id="stakeholders"
            placeholder="Who are the stakeholders involved?"
            value={formatDisplayText(stakeholders)}
            onChange={handleTextChange(onStakeholdersChange)}
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
            value={formatDisplayText(systems)}
            onChange={handleTextChange(onSystemsChange)}
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
          <Label htmlFor="companyContext" className="text-sm font-medium">Context (e.g. business processes)</Label>
        </div>
        <Textarea
          id="companyContext"
          placeholder="Provide context about the company and relevant processes..."
          value={formatDisplayText(companyContext)}
          onChange={handleTextChange(onCompanyContextChange)}
          className="min-h-[100px] resize-y"
        />
        <div className="text-xs text-muted-foreground text-right">
          {companyContext.length} characters / ~{estimateTokenCount(companyContext)} tokens
        </div>
      </div>
    </>
  );
};

export default ContextFields;
