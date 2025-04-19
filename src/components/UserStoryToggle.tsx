import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { UserStoryItem } from '@/utils/api/types';

interface UserStoryToggleProps {
  storyItem: UserStoryItem;
  isExpanded?: boolean;
}

const UserStoryToggle = ({ storyItem, isExpanded = false }: UserStoryToggleProps) => {
  const [expanded, setExpanded] = useState(isExpanded);

  // Format the user story string based on the format
  const formatStory = (item: UserStoryItem): JSX.Element => {
    const asAMatch = item.story.match(/As a ([^,]+), I want ([^,]+), so that (.+)/i);
    
    if (asAMatch) {
      const [, role, want, benefit] = asAMatch;
      return (
        <div>
          {item.description && (
            <div className="mt-2 text-muted-foreground text-sm">
              <p>{item.description}</p>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div>
        {item.description && (
          <div className="mt-2 text-muted-foreground text-sm">
            <p>{item.description}</p>
          </div>
        )}
      </div>
    );
  };

  // Create a formatted title for the story
  const createTitle = (item: UserStoryItem): JSX.Element => {
    const asAMatch = item.story.match(/As a ([^,]+), I want ([^,]+), so that (.+)/i);
    
    if (asAMatch) {
      const [, role, want, benefit] = asAMatch;
      return (
        <span>
          As a <span className="text-primary">{role}</span>, I want {want}, so that {benefit}
        </span>
      );
    }
    
    return <span>{item.story}</span>;
  };

  return (
    <div className="flex items-start py-2 group">
      <Check className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
      <div className="flex-grow">
        <div 
          className={`text-sm cursor-pointer hover:text-primary transition-colors ${expanded ? 'text-primary' : ''}`}
          onClick={() => setExpanded(!expanded)}
        >
          {createTitle(storyItem)}
        </div>
        {expanded && formatStory(storyItem)}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0"
        onClick={() => {
          navigator.clipboard.writeText(storyItem.story);
          toast.success("Copied to clipboard");
        }}
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default UserStoryToggle;
