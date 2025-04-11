
import React from 'react';
import { RequirementAnalysisResult, UserStoryItem } from '@/utils/api/types';
import { Button } from "@/components/ui/button";
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { saveAs } from 'file-saver';
import { convertToMarkdown } from '@/utils/markdownUtils';
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportButtonsProps {
  result: RequirementAnalysisResult;
  clientRequest: string;
  stakeholders?: string;
  systems?: string;
  companyContext?: string;
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

  const downloadJson = () => {
    if (!result) {
      toast.error("No results to export.");
      return;
    }

    try {
      // Create JSON data with all analysis details
      const jsonData = {
        metadata: {
          exportDate: new Date().toISOString(),
          clientRequest,
          stakeholders,
          systems, 
          companyContext
        },
        analysis: result
      };

      // Convert to JSON string with pretty formatting
      const jsonContent = JSON.stringify(jsonData, null, 2);
      
      // Create a Blob containing the JSON content
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });

      // Save the Blob as a file
      saveAs(blob, 'requirements_analysis.json');
      toast.success("JSON file downloaded successfully!");
    } catch (error) {
      console.error("Error generating or downloading JSON:", error);
      toast.error("Failed to generate JSON file.");
    }
  };

  const downloadCsv = () => {
    if (!result) {
      toast.error("No results to export.");
      return;
    }

    try {
      // Prepare CSV content
      let csvContent = "type,title,description,priority,category,dependencies\n";
      
      // Add functional requirements
      result.functionalRequirements.forEach((req, index) => {
        const row = [
          "Functional",
          `FR${index + 1}: ${req.title.replace(/,/g, ";")}`,
          req.description.replace(/,/g, ";").replace(/\n/g, " "),
          req.priority || "",
          "",
          (req.dependencies || []).join(";")
        ];
        csvContent += row.join(",") + "\n";
      });
      
      // Add non-functional requirements
      result.nonFunctionalRequirements.forEach((req, index) => {
        const row = [
          "Non-Functional",
          `NFR${index + 1}: ${req.title.replace(/,/g, ";")}`,
          req.description.replace(/,/g, ";").replace(/\n/g, " "),
          req.priority || "",
          req.category || "",
          ""
        ];
        csvContent += row.join(",") + "\n";
      });
      
      // Add acceptance criteria
      result.acceptanceCriteria.forEach((criterion, index) => {
        const row = [
          "Acceptance Criteria",
          `AC${index + 1}: ${criterion.title.replace(/,/g, ";")}`,
          criterion.description.replace(/,/g, ";").replace(/\n/g, " "),
          "",
          "",
          (criterion.relatedRequirements || []).join(";")
        ];
        csvContent += row.join(",") + "\n";
      });
      
      // Create a Blob containing the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

      // Save the Blob as a file
      saveAs(blob, 'requirements_analysis.csv');
      toast.success("CSV file downloaded successfully!");
    } catch (error) {
      console.error("Error generating or downloading CSV:", error);
      toast.error("Failed to generate CSV file.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={downloadMarkdown} className="flex items-center gap-2 cursor-pointer">
          <Download className="h-4 w-4" />
          Export to Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadJson} className="flex items-center gap-2 cursor-pointer">
          <FileJson className="h-4 w-4" />
          Export to JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadCsv} className="flex items-center gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          Export to CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButtons;
