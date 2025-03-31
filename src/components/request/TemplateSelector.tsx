
import { useState, useEffect } from 'react';
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
import { getRequestTemplates, RequestTemplate } from '@/utils/supabaseService';
import { convertDbTemplatesToComponentFormat } from './templates';

interface TemplateSelectorProps {
  template: string;
  onTemplateChange: (value: string) => void;
}

const TemplateSelector = ({ template, onTemplateChange }: TemplateSelectorProps) => {
  const [templates, setTemplates] = useState(REQUEST_TEMPLATES);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const dbTemplates = await getRequestTemplates();
        if (dbTemplates.length > 0) {
          setTemplates(convertDbTemplatesToComponentFormat(dbTemplates));
        }
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTemplates();
  }, []);
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div className="flex items-center">
        <FileText className="h-5 w-5 mr-2 text-primary" />
        <Label htmlFor="template" className="text-sm font-medium">Template</Label>
      </div>
      <div className="w-full md:w-72">
        <Select value={template} onValueChange={onTemplateChange} disabled={isLoading}>
          <SelectTrigger id="template">
            <SelectValue placeholder={isLoading ? "Loading templates..." : "Select a template"} />
          </SelectTrigger>
          <SelectContent>
            {templates.map((tpl) => (
              <SelectItem key={tpl.id} value={tpl.id}>{tpl.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TemplateSelector;
