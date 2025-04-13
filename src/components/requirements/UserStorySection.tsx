
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, AlertTriangle } from 'lucide-react';
import UserStoryToggle from '../UserStoryToggle';
import { UserStoryItem } from '@/utils/api/types';

interface UserStorySectionProps {
  userStories: Array<string | UserStoryItem>;
}

const UserStorySection = ({ userStories }: UserStorySectionProps) => {
  const isEmpty = !userStories || userStories.length === 0;

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
        {isEmpty ? (
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
            {userStories.map((story, index) => (
              <UserStoryToggle key={index} storyItem={story} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserStorySection;
