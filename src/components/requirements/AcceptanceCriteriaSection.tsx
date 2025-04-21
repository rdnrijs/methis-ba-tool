import { useState, useEffect } from 'react';
import { CheckCheck, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RequirementItem from './RequirementItem';
import { AcceptanceCriteria } from '@/utils/api/types';

interface AcceptanceCriteriaSectionProps {
  criteria: Array<AcceptanceCriteria | string>;
}

const AcceptanceCriteriaSection = ({ criteria }: AcceptanceCriteriaSectionProps) => {
  const [hasError, setHasError] = useState(false);
  const [safeCriteria, setSafeCriteria] = useState<Array<AcceptanceCriteria | string>>([]);
  
  // Validate criteria on component mount
  useEffect(() => {
    try {
      console.log('AcceptanceCriteriaSection received criteria:', criteria);
      
      // Validate the criteria array
      if (!criteria) {
        console.error('criteria is undefined or null');
        setHasError(true);
        setSafeCriteria([]);
        return;
      }
      
      if (!Array.isArray(criteria)) {
        console.error('criteria is not an array:', typeof criteria);
        setHasError(true);
        setSafeCriteria([]);
        return;
      }
      
      // Filter out any invalid items
      const validCriteria = criteria.filter(criterion => 
        criterion !== null && 
        criterion !== undefined && 
        (typeof criterion === 'string' || typeof criterion === 'object')
      );
      
      setSafeCriteria(validCriteria);
      setHasError(validCriteria.length === 0 && criteria.length > 0);
      console.log('Validated criteria:', validCriteria);
    } catch (error) {
      console.error('Error in AcceptanceCriteriaSection:', error);
      setHasError(true);
      setSafeCriteria([]);
    }
  }, [criteria]);
  
  const isEmpty = !safeCriteria || safeCriteria.length === 0;

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
        {hasError ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Error displaying acceptance criteria</p>
              <p className="text-xs text-muted-foreground">
                There was an issue processing the acceptance criteria data. Try regenerating the requirements.
              </p>
            </div>
          </div>
        ) : isEmpty ? (
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
          <div className="space-y-1">
            {safeCriteria.map((criterion, index) => (
              <RequirementItem 
                key={index} 
                requirement={
                  typeof criterion === 'string' 
                    ? criterion 
                    : {
                        title: criterion.title || '',
                        description: criterion.description || 'No details provided'
                      }
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AcceptanceCriteriaSection;
