
import { FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { REQUEST_TEMPLATES } from './templates';

interface TemplateSelectorProps {
  template: string;
  onTemplateChange: (value: string) => void;
}

const TemplateSelector = ({ template, onTemplateChange }: TemplateSelectorProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div className="flex items-center">
        <FileText className="h-5 w-5 mr-2 text-primary" />
        <Label htmlFor="template" className="text-sm font-medium">Template</Label>
      </div>
      <div className="w-full md:w-72">
        <Select value={template} onValueChange={onTemplateChange}>
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
  );
};

export default TemplateSelector;
