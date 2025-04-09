
import { RequirementAnalysisResult } from "@/utils/api/types";
import { formatDisplayText } from "@/components/requirements/DisplayUtils";

export const convertToMarkdown = (
  result: RequirementAnalysisResult,
  clientRequest: string,
  stakeholders: string = "",
  systems: string = "",
  companyContext: string = "",
  getUserStoryText: (story: any) => string
): string => {
  let markdown = `# Requirements Analysis Document\n\n`;

  // Add today's date
  const today = new Date();
  markdown += `Generated on: ${today.toLocaleDateString()}\n\n`;

  // Add client request
  markdown += `## Client Request\n\n${clientRequest}\n\n`;

  // Add context if available
  if (companyContext) {
    markdown += `## Company Context\n\n${companyContext}\n\n`;
  }

  if (stakeholders) {
    markdown += `## Stakeholders\n\n${stakeholders}\n\n`;
  }

  if (systems) {
    markdown += `## Systems\n\n${systems}\n\n`;
  }

  // Add assumptions
  if (result.assumptions && result.assumptions.length > 0) {
    markdown += `## Assumptions\n\n`;
    result.assumptions.forEach((assumption) => {
      markdown += `- ${assumption}\n`;
    });
    markdown += `\n`;
  }

  // Add confidence score
  markdown += `## Confidence Score\n\n${result.confidenceScore}/10\n\n`;

  // Add functional requirements
  markdown += `## Functional Requirements\n\n`;
  result.functionalRequirements.forEach((req, index) => {
    markdown += `### FR${index + 1}: ${req.title}\n\n`;
    markdown += `${formatDisplayText(req.description)}\n\n`;
    
    if (req.priority) {
      markdown += `**Priority**: ${req.priority}\n\n`;
    }
    
    if (req.dependencies && req.dependencies.length > 0) {
      markdown += `**Dependencies**: ${req.dependencies.join(', ')}\n\n`;
    }
  });

  // Add non-functional requirements
  markdown += `## Non-Functional Requirements\n\n`;
  result.nonFunctionalRequirements.forEach((req, index) => {
    markdown += `### NFR${index + 1}: ${req.title}\n\n`;
    markdown += `${formatDisplayText(req.description)}\n\n`;
    
    if (req.priority) {
      markdown += `**Priority**: ${req.priority}\n\n`;
    }
    
    if (req.category) {
      markdown += `**Category**: ${req.category}\n\n`;
    }
  });

  // Add user stories
  markdown += `## User Stories\n\n`;
  result.userStories.forEach((story, index) => {
    const storyText = typeof story === 'string' ? story : getUserStoryText(story);
    markdown += `### Story ${index + 1}\n\n`;
    markdown += `${formatDisplayText(storyText)}\n\n`;
  });

  // Add acceptance criteria
  markdown += `## Acceptance Criteria\n\n`;
  result.acceptanceCriteria.forEach((criterion, index) => {
    markdown += `### AC${index + 1}: ${criterion.title}\n\n`;
    markdown += `${formatDisplayText(criterion.description)}\n\n`;
    
    if (criterion.relatedRequirements && criterion.relatedRequirements.length > 0) {
      markdown += `**Related Requirements**: ${criterion.relatedRequirements.join(', ')}\n\n`;
    }
  });

  // Add follow-up questions
  if (result.followUpQuestions && result.followUpQuestions.length > 0) {
    markdown += `## Follow-up Questions\n\n`;
    result.followUpQuestions.forEach((question, index) => {
      markdown += `${index + 1}. ${question}\n`;
    });
    markdown += `\n`;
  }

  return markdown;
};
