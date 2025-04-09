
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileCog } from 'lucide-react';
import { RequirementAnalysisResult, UserStoryItem } from '@/utils/api/types';

interface ExportButtonsProps {
  result: RequirementAnalysisResult;
  clientRequest: string;
  stakeholders: string;
  systems: string;
  companyContext: string;
}

const ExportButtons = ({ result, clientRequest, stakeholders, systems, companyContext }: ExportButtonsProps) => {
  const formatUserStories = (stories: Array<string | UserStoryItem>): string => {
    return stories.map((story) => {
      if (typeof story === 'string') {
        return `- ${story}\n`;
      } else {
        const { role, want, benefit, story: storyContent } = story;
        let formattedStory = `- As a ${role}, I want ${want}, so that ${benefit}\n`;
        if (storyContent) {
          formattedStory += `  Details: ${storyContent}\n`;
        }
        return formattedStory;
      }
    }).join('\n');
  };

  const exportToMarkdown = () => {
    const markdown = `# Requirements Analysis

## Original Client Request
${clientRequest}

${stakeholders ? `## Stakeholders\n${stakeholders}\n\n` : ''}${systems ? `## Systems & Applications\n${systems}\n\n` : ''}${companyContext ? `## Company Context\n${companyContext}\n\n` : ''}
## Functional Requirements
${result.functionalRequirements.map(req => `- ${req}`).join('\n')}

## Non-Functional Requirements
${result.nonFunctionalRequirements.map(req => `- ${req}`).join('\n')}

## User Stories
${formatUserStories(result.userStories)}

## Acceptance Criteria
${result.acceptanceCriteria.map(criteria => `- ${criteria}`).join('\n')}

## Assumptions
${result.assumptions.map(assumption => `- ${assumption}`).join('\n')}

## Follow-Up Questions
${result.followUpQuestions.map(question => `- ${question}`).join('\n')}
`;

    // Create and download the file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'requirements-analysis.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={exportToMarkdown}
      >
        <Download size={14} />
        Export to Markdown
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        disabled
        title="Coming soon"
      >
        <FileCog size={14} />
        Export to JIRA (Coming soon)
      </Button>
    </div>
  );
};

export default ExportButtons;
