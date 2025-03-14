
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  GitBranch, 
  GitCommitHorizontal, 
  User, 
  CheckCheck, 
  Brain, 
  Lightbulb, 
  AlertCircle,
  Download,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RequirementAnalysisResult, TokenUsage } from '@/utils/openAIService';
import { toast } from "sonner";
import InfoCard from './ui/InfoCard';
import { cn } from '@/lib/utils';

interface RequirementResultsProps {
  result: RequirementAnalysisResult;
  tokenUsage: TokenUsage;
  clientRequest: string;
}

const RequirementItem = ({ text }: { text: string }) => {
  return (
    <div className="flex items-start py-2 group">
      <Check className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
      <div className="text-sm">{text}</div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0"
        onClick={() => {
          navigator.clipboard.writeText(text);
          toast.success("Copied to clipboard");
        }}
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

const ConfidenceIndicator = ({ score }: { score: number }) => {
  const getColor = () => {
    if (score >= 0.8) return "bg-green-500";
    if (score >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const getMessage = () => {
    if (score >= 0.8) return "High confidence";
    if (score >= 0.6) return "Medium confidence";
    return "Low confidence";
  };
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{getMessage()}</span>
        <span className="text-sm text-muted-foreground">{Math.round(score * 100)}%</span>
      </div>
      <Progress value={score * 100} className={cn("h-2", getColor())} />
    </div>
  );
};

const RequirementResults = ({ result, tokenUsage, clientRequest }: RequirementResultsProps) => {
  const [activeTab, setActiveTab] = useState('functional');
  
  const handleExport = () => {
    const exportData = {
      clientRequest,
      result,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `requirements-analysis-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Requirements exported successfully");
  };
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-blur-in animate-once">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard 
          title="Analysis Complete" 
          className="animate-fade-in animate-once"
          icon={<Brain className="h-5 w-5 text-primary" />}
          glassmorphism
        >
          <ConfidenceIndicator score={result.confidenceScore} />
        </InfoCard>
        
        <InfoCard 
          title="Token Usage" 
          className="animate-fade-in animate-once animate-delay-100"
          icon={<GitCommitHorizontal className="h-5 w-5 text-primary" />}
          glassmorphism
        >
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prompt:</span>
              <span>{tokenUsage.promptTokens}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completion:</span>
              <span>{tokenUsage.completionTokens}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>{tokenUsage.totalTokens}</span>
            </div>
          </div>
        </InfoCard>
        
        <InfoCard 
          title="Requirements" 
          className="animate-fade-in animate-once animate-delay-200"
          icon={<CheckCheck className="h-5 w-5 text-primary" />}
          glassmorphism
        >
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Functional:</span>
              <span>{result.functionalRequirements.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Non-functional:</span>
              <span>{result.nonFunctionalRequirements.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">User stories:</span>
              <span>{result.userStories.length}</span>
            </div>
          </div>
        </InfoCard>
        
        <InfoCard 
          title="Follow-up Questions" 
          className="animate-fade-in animate-once animate-delay-300"
          icon={<Lightbulb className="h-5 w-5 text-primary" />}
          glassmorphism
          hoverEffect
        >
          <div className="text-sm">
            {result.followUpQuestions.length > 0 ? (
              <div className="text-muted-foreground flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                <span>{result.followUpQuestions.length} question{result.followUpQuestions.length > 1 ? 's' : ''} to clarify</span>
              </div>
            ) : (
              <div className="text-muted-foreground flex items-center">
                <Check className="h-4 w-4 mr-1 text-green-500" />
                <span>No follow-up questions needed</span>
              </div>
            )}
          </div>
        </InfoCard>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleExport}
          className="flex items-center"
        >
          <Download className="mr-1 h-4 w-4" />
          Export
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="functional" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <GitBranch className="h-4 w-4 mr-2" />
            Functional
          </TabsTrigger>
          <TabsTrigger value="nonfunctional" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <GitCommitHorizontal className="h-4 w-4 mr-2" />
            Non-functional
          </TabsTrigger>
          <TabsTrigger value="userstories" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="h-4 w-4 mr-2" />
            User Stories
          </TabsTrigger>
          <TabsTrigger value="acceptance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CheckCheck className="h-4 w-4 mr-2" />
            Acceptance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="functional" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GitBranch className="h-5 w-5 mr-2 text-primary" />
                Functional Requirements
              </CardTitle>
              <CardDescription>
                Capabilities the system must provide to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 divide-y">
                {result.functionalRequirements.map((req, index) => (
                  <RequirementItem key={index} text={req} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nonfunctional" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GitCommitHorizontal className="h-5 w-5 mr-2 text-primary" />
                Non-functional Requirements
              </CardTitle>
              <CardDescription>
                Quality attributes and constraints for the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 divide-y">
                {result.nonFunctionalRequirements.map((req, index) => (
                  <RequirementItem key={index} text={req} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="userstories" className="mt-0">
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
              <div className="space-y-1 divide-y">
                {result.userStories.map((story, index) => (
                  <RequirementItem key={index} text={story} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="acceptance" className="mt-0">
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
                {result.acceptanceCriteria.map((criteria, index) => (
                  <RequirementItem key={index} text={criteria} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {result.followUpQuestions.length > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Follow-up Questions
            </CardTitle>
            <CardDescription>
              These questions will help clarify requirements further
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {result.followUpQuestions.map((question, index) => (
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
          </CardContent>
        </Card>
      )}
      
      <Card className="border-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Assumptions
          </CardTitle>
          <CardDescription>
            Implicit requirements or constraints identified during analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 divide-y">
            {result.assumptions.map((assumption, index) => (
              <RequirementItem key={index} text={assumption} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequirementResults;
