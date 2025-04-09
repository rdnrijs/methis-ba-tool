
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import UserStoryToggle from '../UserStoryToggle';
import { UserStoryItem } from '@/utils/api/types';

interface UserStorySectionProps {
  userStories: Array<string | UserStoryItem>;
}

const UserStorySection = ({ userStories }: UserStorySectionProps) => {
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
        <div className="space-y-0 divide-y">
          {userStories.map((story, index) => (
            <UserStoryToggle key={index} storyItem={story} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStorySection;
