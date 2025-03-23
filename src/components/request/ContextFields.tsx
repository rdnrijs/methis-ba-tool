
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
            value={stakeholders}
            onChange={(e) => onStakeholdersChange(e.target.value)}
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
            onChange={(e) => onSystemsChange(e.target.value)}
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
          onChange={(e) => onCompanyContextChange(e.target.value)}
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
