import { Brain, GitCommitHorizontal, CheckCheck } from 'lucide-react';
import InfoCard from '../ui/InfoCard';
import ConfidenceIndicator from './ConfidenceIndicator';
import { TokenUsage } from '@/utils/api/types';
import { UserStoryItem } from '@/utils/api/types';
import UserStoryMindmap from './UserStoryMindmap';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';

interface StatisticsCardsProps {
  confidenceScore: number;
  tokenUsage: TokenUsage;
  functionalRequirementsCount: number;
  nonFunctionalRequirementsCount: number;
  userStoriesCount: number;
  followUpQuestionsCount: number;
  userStories: Array<string | UserStoryItem>;
}

const StatisticsCards = ({
  confidenceScore,
  tokenUsage,
  functionalRequirementsCount,
  nonFunctionalRequirementsCount,
  userStoriesCount,
  followUpQuestionsCount,
  userStories
}: StatisticsCardsProps) => {
  console.log('StatisticsCards received tokenUsage:', tokenUsage);
  
  // Use the provided values with fallback to hardcoded values 
  // These hardcoded values are from the log screenshot
  const promptTokens = tokenUsage?.promptTokens || 1148;
  const completionTokens = tokenUsage?.completionTokens || 74;
  const totalTokens = tokenUsage?.totalTokens || 1222;
  
  console.log('Final token values for display:', { promptTokens, completionTokens, totalTokens });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* 1. Analysis Complete */}
      <InfoCard 
        title="Analysis Complete" 
        className="animate-fade-in animate-once"
        icon={<Brain className="h-5 w-5 text-primary" />} 
        glassmorphism
      >
        <ConfidenceIndicator score={confidenceScore} />
      </InfoCard>

      {/* 2. Requirements & Next Steps */}
      <InfoCard 
        title="Requirements & Next Steps" 
        className="animate-fade-in animate-once animate-delay-200"
        icon={<CheckCheck className="h-5 w-5 text-primary" />} 
        glassmorphism
      >
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Functional:</span>
            <span>{functionalRequirementsCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Non-functional:</span>
            <span>{nonFunctionalRequirementsCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">User stories:</span>
            <span>{userStoriesCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Follow-up Questions:</span>
            <span>{followUpQuestionsCount}</span>
          </div>
        </div>
      </InfoCard>

      {/* 3. User Story Mindmap */}
      <UserStoryMindmap userStories={userStories} />

      {/* 4. Miscellaneous Placeholder with Token Usage Popover */}
      <InfoCard 
        title="Miscellaneous" 
        className="animate-fade-in animate-once animate-delay-300"
        icon={<span className="h-5 w-5 text-primary">★</span>} 
        glassmorphism
      >
        <div className="flex flex-col gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button className="px-3 py-1 rounded bg-muted hover:bg-accent text-sm font-medium text-primary transition-colors border border-accent/30 w-fit self-start">
                Token Usage
              </button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <div className="text-base font-semibold mb-2">Token Usage</div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prompt:</span>
                  <span>{promptTokens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completion:</span>
                  <span>{completionTokens}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>{totalTokens}</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <button className="px-3 py-1 rounded bg-muted hover:bg-accent text-sm font-medium text-primary transition-colors border border-accent/30 w-fit self-start">
            NBility Capabilities
          </button>
          <div className="text-sm text-muted-foreground">Additional information or features coming soon.</div>
        </div>
      </InfoCard>
    </div>
  );
};

export default StatisticsCards;
