
import { GitBranch, GitCommitHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RequirementItem from './RequirementItem';
import RequirementRelationshipVisualizer from './RequirementRelationshipVisualizer';

interface RequirementsSectionProps {
  requirements: string[];
  title: string;
  description: string;
  icon: 'functional' | 'nonfunctional';
  acceptanceCriteria?: string[]; // Added to pass to the visualizer
}

const RequirementsSection = ({ 
  requirements, 
  title, 
  description, 
  icon,
  acceptanceCriteria = []
}: RequirementsSectionProps) => {
  const IconComponent = icon === 'functional' ? GitBranch : GitCommitHorizontal;
  
  // Only show the visualizer for functional requirements
  const showVisualizer = icon === 'functional' && acceptanceCriteria.length > 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <IconComponent className="h-5 w-5 mr-2 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </div>
        
        {showVisualizer && (
          <div className="hidden sm:block">
            <RequirementRelationshipVisualizer 
              functionalRequirements={requirements}
              acceptanceCriteria={acceptanceCriteria}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-1 divide-y">
          {requirements.map((req, index) => (
            <RequirementItem key={index} text={req} />
          ))}
        </div>
        
        {showVisualizer && (
          <div className="mt-4 sm:hidden">
            <RequirementRelationshipVisualizer 
              functionalRequirements={requirements}
              acceptanceCriteria={acceptanceCriteria}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequirementsSection;
