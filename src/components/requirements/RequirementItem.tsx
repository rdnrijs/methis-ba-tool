import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Requirement } from '@/utils/api/types';

interface RequirementItemProps {
  requirement: Requirement | string;
}

const RequirementItem = ({ requirement }: RequirementItemProps) => {
  // Check if requirement is a string or an object
  const isStringRequirement = typeof requirement === 'string';
  const text = isStringRequirement ? requirement : requirement.description;
  const priority = !isStringRequirement && requirement.priority ? requirement.priority.toLowerCase() : '';
  const title = !isStringRequirement && requirement.title ? requirement.title : '';
  
  // Handle empty or undefined text gracefully
  if (!text || text.trim() === '') {
    console.log('Empty requirement text received in RequirementItem');
    return (
      <div className="flex items-start py-2 group">
        <Check className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground italic">No details provided</div>
      </div>
    );
  }
  
  // Get color and background color based on priority
  const getPriorityStyle = () => {
    switch (priority) {
      case 'must':
        return {
          bgColor: 'bg-red-500',
          textColor: 'text-white',
          label: 'Must'
        };
      case 'should':
        return {
          bgColor: 'bg-blue-500',
          textColor: 'text-white',
          label: 'Should'
        };
      case 'could':
        return {
          bgColor: 'bg-green-500',
          textColor: 'text-white',
          label: 'Could'
        };
      case 'high':
        return {
          bgColor: 'bg-red-500',
          textColor: 'text-white',
          label: 'Must' // Map 'high' to 'must'
        };
      case 'medium':
        return {
          bgColor: 'bg-blue-500',
          textColor: 'text-white',
          label: 'Should' // Map 'medium' to 'should'
        };
      case 'low':
        return {
          bgColor: 'bg-green-500',
          textColor: 'text-white',
          label: 'Could' // Map 'low' to 'could'
        };
      default:
        return null;
    }
  };
  
  const priorityStyle = getPriorityStyle();

  // Parse the requirement ID and title if present in the format "FR XX - Must: Title"
  const parseRequirementFormat = () => {
    if (title) return { id: '', title: title };
    
    const idMatch = text.match(/^([A-Z]{2}\s\d+\s-\s[A-Za-z]+:)(.+)$/);
    if (idMatch) {
      return { 
        id: idMatch[1].trim(),
        title: idMatch[2].trim()
      };
    }
    
    return { id: '', title: text };
  };
  
  const { id, title: parsedTitle } = parseRequirementFormat();
  
  // Get the full text without duplicating the header
  const getFullDisplayText = () => {
    // If we have an ID prefix and it's at the start of the text, display the text as is
    if (id && text.startsWith(id)) {
      return text;
    }
    
    // If we have a title object property and it differs from description
    if (!isStringRequirement && title && text !== title) {
      return text;
    }
    
    return text;
  };

  return (
    <div className="flex items-start py-4 group border-b">
      <Check className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
      
      <div className="flex-grow">
        <div className="text-sm">
          {getFullDisplayText()}
        </div>
      </div>
      
      <div className="flex items-center gap-2 ml-4">
        {priorityStyle && (
          <div className={`${priorityStyle.bgColor} ${priorityStyle.textColor} text-xs font-medium px-2.5 py-0.5 rounded flex items-center min-w-16 justify-center`}>
            {priorityStyle.label}
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          onClick={() => {
            navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard");
          }}
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default RequirementItem;
