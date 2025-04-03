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
  FileSpreadsheet,
  FileText,
  ArrowRight,
  Users,
  Building,
  Database
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RequirementAnalysisResult, TokenUsage } from '@/utils/openAIService';
import { toast } from "sonner";
import InfoCard from './ui/InfoCard';
import { cn } from '@/lib/utils';
import UserStoryToggle from './UserStoryToggle';

interface RequirementResultsProps {
  result: RequirementAnalysisResult;
  tokenUsage: TokenUsage;
  clientRequest: string;
  stakeholders?: string;
  systems?: string;
  companyContext?: string;
}

const formatDisplayText = (text: string) => {
  return text?.replace(/\\n/g, '\n') || '';
};

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

const UserStoryItem = ({ storyItem }: { storyItem: string | { story: string; description?: string } }) => {
  return <UserStoryToggle storyItem={storyItem} />;
};

const RequirementResults = ({ 
  result, 
  tokenUsage, 
  clientRequest,
  stakeholders,
  systems,
  companyContext
}: RequirementResultsProps) => {
  const [activeTab, setActiveTab] = useState('briefing');
  
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
  
  const handleExportCSV = () => {
    const headers = ["Type", "Requirement"];
    const rows = [
      ...result.functionalRequirements.map(req => ["Functional Requirement", req]),
      ...result.nonFunctionalRequirements.map(req => ["Non-Functional Requirement", req]),
      ...result.userStories.map(story => ["User Story", story]),
      ...result.acceptanceCriteria.map(criteria => ["Acceptance Criteria", criteria]),
      ...result.assumptions.map(assumption => ["Assumption", assumption]),
      ...result.followUpQuestions.map(question => ["Follow-up Question", question])
    ];
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `requirements-analysis-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Requirements exported as CSV");
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
          onClick={handleExportCSV}
          className="flex items-center"
        >
          <FileSpreadsheet className="mr-1 h-4 w-4" />
          Export CSV
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleExport}
          className="flex items-center"
        >
          <Download className="mr-1 h-4 w-4" />
          Export JSON
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-6 mb-6">
          <TabsTrigger value="briefing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="h-4 w-4 mr-2" />
            Briefing
          </TabsTrigger>
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
          <TabsTrigger value="next-steps" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ArrowRight className="h-4 w-4 mr-2" />
            Next Steps
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="briefing" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Management Briefing
              </CardTitle>
              <CardDescription>
                Concise summary of the client request and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Client Request</h3>
                  <p className="text-sm whitespace-pre-wrap">{formatDisplayText(clientRequest)}</p>
                </div>
                
                {(stakeholders || systems) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stakeholders && (
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <Users className="h-5 w-5 mr-2 text-primary" />
                          Stakeholders
                        </h3>
                        <div className="text-sm whitespace-pre-wrap">
                          {formatDisplayText(stakeholders)}
                        </div>
                      </div>
                    )}
                    
                    {systems && (
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <Database className="h-5 w-5 mr-2 text-primary" />
                          Systems & Applications
                        </h3>
                        <div className="text-sm whitespace-pre-wrap">
                          {formatDisplayText(systems)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {companyContext && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-primary" />
                      Company Context
                    </h3>
                    <div className="text-sm whitespace-pre-wrap">
                      {formatDisplayText(companyContext)}
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Assumptions Made</h3>
                  {result.assumptions.length > 0 ? (
                    <div className="space-y-0">
                      {result.assumptions.map((assumption, index) => (
                        <div key={index} className="py-2 flex items-start group">
                          <Check className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                          <div className="text-sm">{assumption}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0"
                            onClick={() => {
                              navigator.clipboard.writeText(assumption);
                              toast.success("Copied to clipboard");
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm">No assumptions were made during the analysis.</p>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span className="font-medium">Analysis Confidence</span>
                  </div>
                  <div className="w-1/3">
                    <ConfidenceIndicator score={result.confidenceScore} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="next-steps" className="mt-0">
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
                {result.followUpQuestions.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                      Follow-up Questions
                    </h3>
                    <div className="space-y-1 divide-y">
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
                    {result.followUpQuestions.length > 0 && (
                      <li className="flex items-start">
                        <CheckCheck className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                        <span>Address the {result.followUpQuestions.length} follow-up questions to clarify requirements</span>
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
        </TabsContent>
        
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
              <div className="space-y-0 divide-y">
                {result.userStories.map((story, index) => (
                  <UserStoryItem key={index} storyItem={story} />
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
    </div>
  );
};

export default RequirementResults;
