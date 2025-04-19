import { CheckCheck, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RequirementItem from './RequirementItem';
import { AcceptanceCriteria } from '@/utils/api/types';

interface AcceptanceCriteriaSectionProps {
  criteria: AcceptanceCriteria[];
}

const AcceptanceCriteriaSection = ({ criteria }: AcceptanceCriteriaSectionProps) => {
  const isEmpty = !criteria || criteria.length === 0;

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
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <AlertTriangle className="h-12 w-12 text-muted-foreground/50" />
            <div className="space-y-1">
              <p className="text-sm font-medium">No acceptance criteria available</p>
              <p className="text-xs text-muted-foreground">
                Try providing more detailed requirements or ask follow-up questions to generate acceptance criteria.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1 divide-y">
            {criteria.map((criterion, index) => (
              <RequirementItem 
                key={index} 
                text={criterion.description}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AcceptanceCriteriaSection;
