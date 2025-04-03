
import { ArrowRight, Lightbulb, AlertCircle, Check, CheckCheck, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface NextStepsSectionProps {
  followUpQuestions: string[];
}

const NextStepsSection = ({ followUpQuestions }: NextStepsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowRight className="h-5 w-5 mr-2 text-primary" />
          Next Steps
        </CardTitle>
        <CardDescription>
          Follow-up questions to address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {followUpQuestions.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Follow-up Questions
              </h3>
              <div className="space-y-1 divide-y">
                {followUpQuestions.map((question, index) => (
                  <div key={index} className="flex items-start py-2 group">
                    <AlertCircle className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">{question}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(question);
                        toast.success("Copied to clipboard");
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                No follow-up questions needed. The requirements are clear.
              </p>
            </div>
          )}
          
          <div className="p-4 border rounded-lg bg-primary/5">
            <h4 className="font-medium mb-2">Recommended Actions</h4>
            <ul className="space-y-2 text-sm">
              {followUpQuestions.length > 0 && (
                <li className="flex items-start">
                  <CheckCheck className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <span>Address the {followUpQuestions.length} follow-up questions to clarify requirements</span>
                </li>
              )}
              <li className="flex items-start">
                <CheckCheck className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                <span>Review acceptance criteria to ensure all stakeholder needs are met</span>
              </li>
              <li className="flex items-start">
                <CheckCheck className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                <span>Validate functional and non-functional requirements with technical teams</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextStepsSection;
