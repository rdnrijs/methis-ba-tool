
import React from 'react';
import { RequirementAnalysisResult } from '@/utils/api/types';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { convertToMarkdown } from '@/utils/markdownUtils';
import { toast } from "sonner";
import { UserStoryItem } from "../UserStoryToggle";

interface ExportButtonsProps {
  result: RequirementAnalysisResult;
  clientRequest: string;
  stakeholders: string;
  systems: string;
  companyContext: string;
}

// Get the story text based on the format of the user story
const getUserStoryText = (story: UserStoryItem) => {
  if (story.story) {
    return story.story;
  } else if (story.persona && story.goal && story.reason) {
    return `As a ${story.persona}, I want ${story.goal}, so that ${story.reason}`;
  } else {
    return story.title;
  }
};

const ExportButtons: React.FC<ExportButtonsProps> = ({ result, clientRequest, stakeholders, systems, companyContext }) => {
  const downloadMarkdown = () => {
    if (!result) {
      toast.error("No results to export.");
      return;
    }

    try {
      // Convert the analysis result to Markdown format
      const markdownContent = convertToMarkdown(result, clientRequest, stakeholders, systems, companyContext, getUserStoryText);

      // Create a Blob containing the Markdown content
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });

      // Save the Blob as a file
      saveAs(blob, 'requirements_analysis.md');
      toast.success("Markdown file downloaded successfully!");
    } catch (error) {
      console.error("Error generating or downloading Markdown:", error);
      toast.error("Failed to generate Markdown file.");
    }
  };

  return (
    <Button onClick={downloadMarkdown} className="gap-2">
      <Download className="h-4 w-4" />
      Export to Markdown
    </Button>
  );
};

export default ExportButtons;
