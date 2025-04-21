import { GitBranch, GitCommitHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RequirementItem from './RequirementItem';
import { Requirement, AcceptanceCriteria } from '@/utils/api/types';

interface RequirementsSectionProps {
  requirements: Requirement[];
  title: string;
  description: string;
  icon: 'functional' | 'nonfunctional';
  acceptanceCriteria?: AcceptanceCriteria[]; // Updated to use the correct type
}

const RequirementsSection = ({ 
  requirements, 
  title, 
  description, 
  icon,
  acceptanceCriteria = []
}: RequirementsSectionProps) => {
  const IconComponent = icon === 'functional' ? GitBranch : GitCommitHorizontal;
  
  // Debug logging to help troubleshoot
  console.log(`Rendering ${title} with ${requirements.length} requirements`, requirements);
  
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="flex items-center">
            <IconComponent className="h-5 w-5 mr-2 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {requirements && requirements.length > 0 ? (
            requirements.map((req, index) => (
              <RequirementItem 
                key={index} 
                requirement={req} 
              />
            ))
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              No requirements found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequirementsSection;
