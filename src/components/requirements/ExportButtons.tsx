
import { FileSpreadsheet, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RequirementAnalysisResult } from '@/utils/openAIService';
import { UserStoryItem as ApiUserStoryItem } from '@/utils/api/types';

interface ExportButtonsProps {
  result: RequirementAnalysisResult;
  clientRequest: string;
}

// Helper function to get the formatted story text regardless of format
const getStoryText = (story: string | ApiUserStoryItem): string => {
  if (typeof story === 'string') {
    return story;
  }
  
  // Handle the API format with role/want/benefit
  if ('role' in story && 'want' in story && 'benefit' in story) {
    return `As a ${story.role}, I want ${story.want} so that ${story.benefit}`;
  }
  
  // Handle the case where 'story' property exists
  if ('story' in story) {
    return story.story;
  }
  
  // Fallback to JSON representation
  return JSON.stringify(story);
};

const ExportButtons = ({ result, clientRequest }: ExportButtonsProps) => {
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
      ...result.userStories.map(story => {
        const storyText = getStoryText(story);
        return ["User Story", storyText];
      }),
      ...result.acceptanceCriteria.map(criteria => ["Acceptance Criteria", criteria]),
      ...result.assumptions.map(assumption => ["Assumption", assumption]),
      ...result.followUpQuestions.map(question => ["Follow-up Question", question])
    ];
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
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
  );
};

export default ExportButtons;
