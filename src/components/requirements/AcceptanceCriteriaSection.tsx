
import { CheckCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RequirementItem from './RequirementItem';

interface AcceptanceCriteriaSectionProps {
  criteria: string[];
}

const AcceptanceCriteriaSection = ({ criteria }: AcceptanceCriteriaSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCheck className="h-5 w-5 mr-2 text-primary" />
          Acceptance Criteria
        </CardTitle>
        <CardDescription>
          Conditions that must be satisfied for the system to be accepted
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 divide-y">
          {criteria.map((criteria, index) => (
            <RequirementItem key={index} text={criteria} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AcceptanceCriteriaSection;
