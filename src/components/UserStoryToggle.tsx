import { useState, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { UserStoryItem } from '@/utils/api/types';

interface UserStoryToggleProps {
  storyItem: string | UserStoryItem;
  isExpanded?: boolean;
}

const UserStoryToggle = ({ storyItem, isExpanded = false }: UserStoryToggleProps) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [hasError, setHasError] = useState(false);
  
  // Log the story item for debugging on component mount
  useEffect(() => {
    try {
      console.log('UserStoryToggle rendered with:', storyItem);
      
      // Validate the storyItem
      if (typeof storyItem !== 'string' && typeof storyItem !== 'object') {
        console.error('Invalid storyItem type:', typeof storyItem);
        setHasError(true);
      } else if (storyItem === null) {
        console.error('storyItem is null');
        setHasError(true);
      }
    } catch (error) {
      console.error('Error in UserStoryToggle:', error);
      setHasError(true);
    }
  }, [storyItem]);
  
  // Check if storyItem is a string or an object
  const isStringStory = typeof storyItem === 'string';
  
  // Safely get story text for regex matching
  const getSafeStoryText = (): string => {
    try {
      if (isStringStory) {
        return storyItem as string || '';
      }
      
      const story = storyItem as UserStoryItem;
      return (story?.story || story?.title || '').toString();
    } catch (error) {
      console.error('Error getting safe story text:', error);
      return '';
    }
  };
  
  // Parse testcases into an array regardless of original format
  const getTestCasesArray = (story: UserStoryItem): string[] => {
    try {
      if (!story.testcases) return [];
      
      // If testcases is already an array, return it
      if (Array.isArray(story.testcases)) {
        return story.testcases;
      }
      
      // If it's a string, try to split it by line breaks or bullet points
      const testCasesStr = story.testcases as string;
      
      // Check if the string has bullet points or numbered lists
      if (testCasesStr.match(/[-*•]\s+|\d+\.\s+/)) {
        // Split by common bullet point patterns
        return testCasesStr
          .split(/\n+/)
          .map(line => line.replace(/^[-*•]\s+|\d+\.\s+/, '').trim())
          .filter(item => item.length > 0);
      }
      
      // If no clear bullet points, just split by line
      return testCasesStr
        .split(/\n+/)
        .map(line => line.trim())
        .filter(item => item.length > 0);
    } catch (error) {
      console.error('Error parsing testcases:', error);
      return [];
    }
  };
  
  // Format the user story string based on the format
  const formatStory = (item: string | UserStoryItem): JSX.Element => {
    try {
      if (isStringStory) {
        // For string stories, no additional content is needed
        return <div></div>;
      }
      
      const story = item as UserStoryItem;
      
      if (story?.description) {
        return (
          <div>
            <div className="mt-2 text-muted-foreground text-sm">
              <p>{story.description}</p>
            </div>
            
            {/* Display test cases if available */}
            {story.testcases && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-1">Test Cases:</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {getTestCasesArray(story).map((testCase, idx) => (
                    <li key={idx}>{testCase}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {story.acceptanceCriteria && Array.isArray(story.acceptanceCriteria) && story.acceptanceCriteria.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-1">Acceptance Criteria:</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {story.acceptanceCriteria.map((criterion, idx) => (
                    <li key={idx}>{criterion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      }
    } catch (error) {
      console.error('Error in formatStory:', error);
    }
    
    return <div></div>;
  };

  // Create a formatted title for the story
  const createTitle = (item: string | UserStoryItem): JSX.Element => {
    try {
      const storyText = getSafeStoryText();
      
      // If it's a simple string, just display it directly
      if (isStringStory) {
        return <span>{storyText}</span>;
      }
      
      // Try to parse "As a X, I want Y, so that Z" format
      const asAMatch = storyText.match(/As a ([^,]+), I want ([^,]+), so that (.+)/i);
      
      if (asAMatch) {
        const [, role, want, benefit] = asAMatch;
        return (
          <span>
            As a <span className="text-primary">{role}</span>, I want {want}, so that {benefit}
          </span>
        );
      }
      
      return <span>{storyText}</span>;
    } catch (error) {
      console.error('Error in createTitle:', error);
      return <span>Error displaying story</span>;
    }
  };

  // Get the text to copy
  const getTextToCopy = (): string => {
    try {
      if (isStringStory) {
        return storyItem as string || '';
      }
      
      const story = storyItem as UserStoryItem;
      return (story?.story || story?.title || '').toString();
    } catch (error) {
      console.error('Error in getTextToCopy:', error);
      return '';
    }
  };

  // If there's an error, show a fallback
  if (hasError) {
    return (
      <div className="flex items-start py-2 group text-red-500">
        <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <div className="flex-grow">
          <div className="text-sm">Error displaying user story</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start py-2 group">
      <Check className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
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
          navigator.clipboard.writeText(getTextToCopy());
          toast.success("Copied to clipboard");
        }}
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default UserStoryToggle;
