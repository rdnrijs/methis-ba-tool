import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, AlertTriangle } from 'lucide-react';
import UserStoryToggle from '../UserStoryToggle';
import { UserStoryItem } from '@/utils/api/types';

interface UserStorySectionProps {
  userStories: Array<string | UserStoryItem>;
}

const UserStorySection = ({ userStories }: UserStorySectionProps) => {
  const [hasError, setHasError] = useState(false);
  const [safeUserStories, setSafeUserStories] = useState<Array<string | UserStoryItem>>([]);
  
  // Validate userStories on component mount
  useEffect(() => {
    try {
      console.log('UserStorySection received userStories:', userStories);
      
      // Validate the userStories array
      if (!userStories) {
        console.error('userStories is undefined or null');
        setHasError(true);
        setSafeUserStories([]);
        return;
      }
      
      if (!Array.isArray(userStories)) {
        console.error('userStories is not an array:', typeof userStories);
        setHasError(true);
        setSafeUserStories([]);
        return;
      }
      
      // Filter out any invalid items
      const validStories = userStories.filter(story => 
        story !== null && 
        story !== undefined && 
        (typeof story === 'string' || typeof story === 'object')
      );
      
      setSafeUserStories(validStories);
      setHasError(validStories.length === 0 && userStories.length > 0);
      console.log('Validated stories:', validStories);
    } catch (error) {
      console.error('Error in UserStorySection:', error);
      setHasError(true);
      setSafeUserStories([]);
    }
  }, [userStories]);
  
  const isEmpty = !safeUserStories || safeUserStories.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2 text-primary" />
          User Stories
        </CardTitle>
        <CardDescription>
          Requirements from the user's perspective
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasError ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Error displaying user stories</p>
              <p className="text-xs text-muted-foreground">
                There was an issue processing the user stories data. Try regenerating the requirements.
              </p>
            </div>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <AlertTriangle className="h-12 w-12 text-muted-foreground/50" />
            <div className="space-y-1">
              <p className="text-sm font-medium">No user stories available</p>
              <p className="text-xs text-muted-foreground">
                Try providing more user-centered requirements to generate user stories.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-0 divide-y">
            {safeUserStories.map((story, index) => (
              <UserStoryToggle 
                key={index} 
                storyItem={story} 
                isExpanded={index === 0} // First story is expanded by default
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserStorySection;
