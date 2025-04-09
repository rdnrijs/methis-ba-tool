import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { UserStoryItem } from '@/utils/api/types';

interface UserStoryToggleProps {
  storyItem: string | UserStoryItem;
  isExpanded?: boolean;
}

export interface UserStoryItem {
  id: string;
  title: string;
  description: string;
  story?: string; // Make story optional to support both formats
  persona?: string;
  goal?: string;
  reason?: string;
  acceptanceCriteria: string[];
}

const UserStoryToggle = ({ storyItem, isExpanded = false }: UserStoryToggleProps) => {
  const [expanded, setExpanded] = useState(isExpanded);

  // Format the user story string based on the format
  const formatStory = (story: string | UserStoryItem): JSX.Element => {
    if (typeof story === 'string') {
      // For string format, try to extract parts if it's in "As a X, I want Y, so that Z" format
      const asAMatch = story.match(/As a ([^,]+), I want ([^,]+), so that (.+)/i);
      
      if (asAMatch) {
        const [, role, want, benefit] = asAMatch;
        return (
          <div>
            <p><span className="font-semibold">As a</span> {role},</p>
            <p><span className="font-semibold">I want</span> {want},</p>
            <p><span className="font-semibold">so that</span> {benefit}</p>
          </div>
        );
      }
      
      // If it doesn't match the format, just return the string
      return <p>{story}</p>;
    } else {
      // For object format with role, want, benefit
      const { role, want, benefit, story: storyContent } = story;
      return (
        <div>
          <p><span className="font-semibold">As a</span> {role},</p>
          <p><span className="font-semibold">I want</span> {want},</p>
          <p><span className="font-semibold">so that</span> {benefit}</p>
          {storyContent && (
            <div className="mt-2 pt-2 border-t border-border/30">
              <p className="text-muted-foreground">{storyContent}</p>
            </div>
          )}
        </div>
      );
    }
  };

  // Create a summarized title for the story
  const createTitle = (story: string | UserStoryItem): string => {
    if (typeof story === 'string') {
      // Try to extract the "want" part from the story string
      const asAMatch = story.match(/As a [^,]+, I want ([^,]+),/i);
      return asAMatch ? asAMatch[1] : story.substring(0, 60) + (story.length > 60 ? '...' : '');
    } else {
      // Use the "want" field from the object
      return story.want;
    }
  };

  const handleAccordionChange = (value: string) => {
    setExpanded(value === "item-1");
  };

  return (
    <Accordion 
      type="single" 
      value={expanded ? "item-1" : ""} 
      onValueChange={handleAccordionChange} 
      className="border-b-0"
    >
      <AccordionItem value="item-1" className="border-0 py-2">
        <AccordionTrigger className="py-1 text-sm font-medium hover:no-underline">
          {createTitle(storyItem)}
        </AccordionTrigger>
        <AccordionContent className="text-sm pt-2 pb-1">
          {formatStory(storyItem)}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default UserStoryToggle;
