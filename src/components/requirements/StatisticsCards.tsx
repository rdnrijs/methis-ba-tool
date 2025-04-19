import { Brain, GitCommitHorizontal, CheckCheck, Network } from 'lucide-react';
import InfoCard from '../ui/InfoCard';
import ConfidenceIndicator from './ConfidenceIndicator';
import { TokenUsage } from '@/utils/openAIService';

interface StatisticsCardsProps {
  confidenceScore: number;
  tokenUsage: TokenUsage;
  functionalRequirementsCount: number;
  nonFunctionalRequirementsCount: number;
  userStoriesCount: number;
  followUpQuestionsCount: number;
}

const StatisticsCards = ({
  confidenceScore,
  tokenUsage,
  functionalRequirementsCount,
  nonFunctionalRequirementsCount,
  userStoriesCount,
  followUpQuestionsCount
}: StatisticsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <InfoCard 
        title="Analysis Complete" 
        className="animate-fade-in animate-once"
        icon={<Brain className="h-5 w-5 text-primary" />}
        glassmorphism
      >
        <ConfidenceIndicator score={confidenceScore} />
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

      <InfoCard 
        title="Relationship with NBility" 
        className="animate-fade-in animate-once animate-delay-300"
        icon={<Network className="h-5 w-5 text-primary" />}
        glassmorphism
      >
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mapped:</span>
            <span>0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Unmapped:</span>
            <span>0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total:</span>
            <span>0</span>
          </div>
        </div>
      </InfoCard>
    </div>
  );
};

export default StatisticsCards;
