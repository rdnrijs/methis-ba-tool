
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RequirementAnalysisResult, TokenUsage } from '@/utils/openAIService';
import type { UserStoryItem } from './UserStoryToggle';
import BriefingSection from './requirements/BriefingSection';
import NextStepsSection from './requirements/NextStepsSection';
import RequirementsSection from './requirements/RequirementsSection';
import UserStorySection from './requirements/UserStorySection';
import AcceptanceCriteriaSection from './requirements/AcceptanceCriteriaSection';
import StatisticsCards from './requirements/StatisticsCards';
import ExportButtons from './requirements/ExportButtons';
import { FileText, GitBranch, GitCommitHorizontal, User, CheckCheck, ArrowRight } from 'lucide-react';

interface RequirementResultsProps {
  result: RequirementAnalysisResult;
  tokenUsage: TokenUsage;
  clientRequest: string;
  stakeholders?: string;
  systems?: string;
  companyContext?: string;
}

const RequirementResults = ({ 
  result, 
  tokenUsage, 
  clientRequest,
  stakeholders,
  systems,
  companyContext
}: RequirementResultsProps) => {
  const [activeTab, setActiveTab] = useState('briefing');
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-blur-in animate-once">
      <StatisticsCards 
        confidenceScore={result.confidenceScore}
        tokenUsage={tokenUsage}
        functionalRequirementsCount={result.functionalRequirements.length}
        nonFunctionalRequirementsCount={result.nonFunctionalRequirements.length}
        userStoriesCount={result.userStories.length}
        followUpQuestionsCount={result.followUpQuestions.length}
      />
      
      <ExportButtons result={result} clientRequest={clientRequest} />
      
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
          <BriefingSection 
            clientRequest={clientRequest}
            stakeholders={stakeholders}
            systems={systems}
            companyContext={companyContext}
            assumptions={result.assumptions}
            confidenceScore={result.confidenceScore}
          />
        </TabsContent>
        
        <TabsContent value="next-steps" className="mt-0">
          <NextStepsSection followUpQuestions={result.followUpQuestions} />
        </TabsContent>
        
        <TabsContent value="functional" className="mt-0">
          <RequirementsSection 
            requirements={result.functionalRequirements}
            title="Functional Requirements"
            description="Capabilities the system must provide to users"
            icon="functional"
          />
        </TabsContent>
        
        <TabsContent value="nonfunctional" className="mt-0">
          <RequirementsSection 
            requirements={result.nonFunctionalRequirements}
            title="Non-functional Requirements"
            description="Quality attributes and constraints for the system"
            icon="nonfunctional"
          />
        </TabsContent>
        
        <TabsContent value="userstories" className="mt-0">
          <UserStorySection userStories={result.userStories} />
        </TabsContent>
        
        <TabsContent value="acceptance" className="mt-0">
          <AcceptanceCriteriaSection criteria={result.acceptanceCriteria} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequirementResults;
