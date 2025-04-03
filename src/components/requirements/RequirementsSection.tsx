
import { GitBranch, GitCommitHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RequirementItem from './RequirementItem';

interface RequirementsSectionProps {
  requirements: string[];
  title: string;
  description: string;
  icon: 'functional' | 'nonfunctional';
}

const RequirementsSection = ({ 
  requirements, 
  title, 
  description, 
  icon 
}: RequirementsSectionProps) => {
  const IconComponent = icon === 'functional' ? GitBranch : GitCommitHorizontal;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <IconComponent className="h-5 w-5 mr-2 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 divide-y">
          {requirements.map((req, index) => (
            <RequirementItem key={index} text={req} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequirementsSection;
