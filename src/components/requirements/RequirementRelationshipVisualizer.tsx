
import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { formatDisplayText } from './DisplayUtils';
import { Network, Share2, ArrowRightLeft, ZoomIn } from 'lucide-react';
import { Requirement, AcceptanceCriteria } from '@/utils/api/types';

interface RequirementRelationshipVisualizerProps {
  functionalRequirements: Requirement[];
  acceptanceCriteria: AcceptanceCriteria[];
}

const RequirementRelationshipVisualizer = ({ 
  functionalRequirements,
  acceptanceCriteria
}: RequirementRelationshipVisualizerProps) => {
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Enhanced relationship mapping algorithm
  const getRelatedCriteria = (requirement: Requirement | null) => {
    if (!requirement) return [];
    
    const reqText = requirement.description.toLowerCase();
    
    // Split requirement into words for keyword matching
    const reqWords = reqText.split(/\s+/)
      .filter(word => word.length > 3)  // Filter out common short words
      .map(word => word.replace(/[.,;:!?]/g, '')); // Remove punctuation
    
    // Create a scoring system for each acceptance criteria
    const scoredCriteria = acceptanceCriteria.map(criteria => {
      const criteriaText = criteria.description.toLowerCase();
      
      // Calculate base score from direct text matching
      let score = 0;
      
      // Check for direct substring matches (weighted heavily)
      if (criteriaText.includes(reqText.substring(0, Math.min(30, reqText.length))) || 
          reqText.includes(criteriaText.substring(0, Math.min(30, criteriaText.length)))) {
        score += 10;
      }
      
      // Check for keyword matches
      reqWords.forEach(word => {
        if (criteriaText.includes(word)) {
          score += 2;
        }
      });
      
      // Check for semantic similarity through common domain terms
      const domainTerms = [
        'display', 'generate', 'allow', 'provide', 'system', 'user', 'data', 
        'report', 'dashboard', 'interface', 'access', 'manage', 'filter',
        'create', 'delete', 'update', 'view', 'edit', 'analyze'
      ];
      
      domainTerms.forEach(term => {
        if (reqText.includes(term) && criteriaText.includes(term)) {
          score += 1;
        }
      });
      
      // Check for subject matter alignment
      if ((reqText.includes('alert') || reqText.includes('notif')) && 
          (criteriaText.includes('alert') || criteriaText.includes('notif'))) {
        score += 3;
      }
      
      // If requirement mentions data and criteria talks about information display
      if ((reqText.includes('data') || reqText.includes('information')) && 
          (criteriaText.includes('display') || criteriaText.includes('show') || criteriaText.includes('present'))) {
        score += 3;
      }
      
      return { criteria, score };
    });
    
    // Sort by score and filter out low-relevance criteria (score < 2)
    const sortedCriteria = scoredCriteria
      .filter(item => item.score > 2)
      .sort((a, b) => b.score - a.score)
      .map(item => item.criteria);
    
    return sortedCriteria;
  };

  return (
    <div className="my-4">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Network className="h-4 w-4" />
            View Requirement Relationships
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-primary" /> 
              Requirement to Acceptance Criteria Relationships
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-primary" />
                  Functional Requirements
                </h3>
                <div className="border rounded-md divide-y max-h-[50vh] overflow-y-auto">
                  {functionalRequirements.map((req, index) => (
                    <div 
                      key={index} 
                      className={`p-3 text-sm cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedRequirement === req ? 'bg-primary/10 border-l-4 border-primary' : ''
                      }`}
                      onClick={() => setSelectedRequirement(req === selectedRequirement ? null : req)}
                    >
                      {formatDisplayText(req.description)}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4 text-primary" />
                  Related Acceptance Criteria
                </h3>
                {selectedRequirement ? (
                  <div className="border rounded-md divide-y max-h-[50vh] overflow-y-auto">
                    {getRelatedCriteria(selectedRequirement).length > 0 ? (
                      getRelatedCriteria(selectedRequirement).map((criteria, index) => (
                        <div key={index} className="p-3 text-sm bg-muted/20">
                          {formatDisplayText(criteria.description)}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-muted-foreground">
                        No directly related acceptance criteria found. Select a different requirement or use a more sophisticated matching algorithm.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border rounded-md p-4 text-sm text-muted-foreground">
                    Select a functional requirement to see related acceptance criteria
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium mb-2">Relationship Summary</h3>
              <p className="text-sm text-muted-foreground">
                {selectedRequirement ? (
                  <>
                    <span className="font-medium">"{formatDisplayText(selectedRequirement.description).substring(0, 50)}..."</span> is related to {getRelatedCriteria(selectedRequirement).length} acceptance criteria.
                  </>
                ) : (
                  <>Select a requirement to see its relationship summary.</>
                )}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Smaller popover version that can be used inline */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1">
            <ZoomIn className="h-3.5 w-3.5" />
            <span className="text-xs">Quick View</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Requirements & Criteria</h4>
            <p className="text-xs text-muted-foreground">
              {functionalRequirements.length} functional requirements are mapped to {acceptanceCriteria.length} acceptance criteria.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs" 
              onClick={() => setDialogOpen(true)}
            >
              <Network className="h-3.5 w-3.5 mr-1" /> Open Full View
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RequirementRelationshipVisualizer;
