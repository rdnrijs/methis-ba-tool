
import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from "sonner";
import { cn } from '@/lib/utils';

export interface UserStoryItem {
  story: string;
  description?: string;
}

interface UserStoryToggleProps {
  storyItem: UserStoryItem | string;
}

// Example descriptions for each user story pattern - these would normally come from the API
const USER_STORY_DESCRIPTIONS: Record<string, string> = {
  "Grid Operations": "Grid operations team members need real-time monitoring capabilities to ensure the grid operates within safe parameters and to quickly respond to any anomalies or issues. This includes tracking load balancing, voltage regulation, and overall system stability metrics.",
  
  "Maintenance Crew": "Maintenance crew members require timely alerts about potential issues to schedule preventative maintenance, minimize downtime, and efficiently allocate resources. This includes notifications about equipment wear, unusual behavior patterns, and scheduled service intervals.",
  
  "Customer Service": "Customer service representatives need access to historical usage data to answer customer inquiries accurately, provide personalized advice on energy usage patterns, and assist with billing inquiries or disputed charges.",
  
  "Regulatory Compliance": "Compliance officers must generate comprehensive reports that demonstrate adherence to industry regulations, environmental standards, and safety requirements. These reports need to be formatted according to regulatory specifications and include all required metrics.",
  
  "Senior Management": "Senior leaders need high-level visualizations of energy usage trends to inform strategic planning, capital investment decisions, and long-term business strategy. This includes identifying patterns that affect profitability, sustainability goals, and operational efficiency."
};

const UserStoryToggle: React.FC<UserStoryToggleProps> = ({ storyItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Handle both string and object formats for stories
  const storyText = typeof storyItem === 'string' ? storyItem : storyItem.story;
  const providedDescription = typeof storyItem === 'object' ? storyItem.description : undefined;
  
  // Determine which description to use based on keywords in the story
  const getDescription = () => {
    // If there's a provided description in the object, use that first
    if (providedDescription) return providedDescription;
    
    // Ensure story is a string before using string methods
    const storyString = String(storyText);
    
    // Fall back to matching keywords if no specific description is provided
    for (const [key, desc] of Object.entries(USER_STORY_DESCRIPTIONS)) {
      if (storyString.includes(key)) {
        return desc;
      }
    }
    
    // If no match, extract and expand from the user story itself
    const roleMatch = storyString.match(/As a ([^,]+)/i);
    const actionMatch = storyString.match(/I want to ([^,]+)/i);
    const benefitMatch = storyString.match(/so that ([^\.]+)/i);
    
    const role = roleMatch ? roleMatch[1].trim() : '';
    const action = actionMatch ? actionMatch[1].trim() : '';
    const benefit = benefitMatch ? benefitMatch[1].trim() : '';
    
    return `This user story represents the needs of ${role}. 
They need to ${action}, which will enable them to ${benefit}. 
Implementing this feature would improve their workflow efficiency and satisfaction.`;
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(storyText);
    toast.success("User story copied to clipboard");
  };
  
  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className="border-b last:border-b-0"
    >
      <div className="flex items-start py-3 group">
        <Check className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <CollapsibleTrigger className="flex justify-between items-center w-full text-left">
            <div className="text-sm">{storyText}</div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity mr-1"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              {isOpen ? 
                <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              }
            </div>
          </CollapsibleTrigger>
        </div>
      </div>
      
      <CollapsibleContent className="pl-7 pb-3">
        <div className={cn(
          "text-sm text-muted-foreground bg-muted/30 p-3 rounded-md",
          "border border-border/50"
        )}>
          {getDescription()}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default UserStoryToggle;
