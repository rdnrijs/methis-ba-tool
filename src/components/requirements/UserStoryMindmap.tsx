import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Network, AlertTriangle, ChevronRight } from 'lucide-react';
import { UserStoryItem } from '@/utils/api/types';
import InfoCard from '../ui/InfoCard';
import { Button } from '@/components/ui/button';
import mermaid from 'mermaid';
import { generateMindmapForUserStories } from '@/utils/api/mindmapService';

interface UserStoryMindmapProps {
  userStories: Array<string | UserStoryItem>;
}

const MINDMAP_PROMPT_ID = '4f813505-74e7-42bc-8c79-f296c3a1ef76';

// Default fallback mindmap syntax in case the API call fails
const DEFAULT_MINDMAP_SYNTAX = `
mindmap
  root((User Stories))
    Grid Operations Team
      Monitor real-time power usage
    Maintenance Crew
      Receive predictive maintenance alerts
    Regulatory Compliance Officer
      Generate automated compliance reports
    Customer Service Representative
      Access real-time outage info
    Energy Efficiency Specialist
      Visualize geospatial energy data
`;

const UserStoryMindmap = ({ userStories }: UserStoryMindmapProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uniqueRoles, setUniqueRoles] = useState<string[]>([]);
  const [mindmapSyntax, setMindmapSyntax] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const mindmapRef = useRef<HTMLDivElement>(null);
  
  // Debug logging for dialog state
  useEffect(() => {
    console.log('Dialog open state changed:', dialogOpen);
  }, [dialogOpen]);
  
  // Initialize mermaid with basic settings
  useEffect(() => {
    try {
      console.log('Initializing mermaid...');
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'default',
        logLevel: 'info',
      });
      console.log('Mermaid initialized successfully');
    } catch (err) {
      console.error('Error initializing mermaid:', err);
      setError('Failed to initialize mindmap library');
    }
  }, []);
  
  // Extract unique roles from user stories
  useEffect(() => {
    const roles = new Set<string>();
    
    userStories.forEach(story => {
      if (typeof story === 'string') {
        const match = story.match(/As a ([^,]+)/i);
        if (match && match[1]) {
          roles.add(match[1].trim());
        }
      } else if (story.persona) {
        roles.add(story.persona);
      } else if (story.story) {
        const match = story.story.match(/As a ([^,]+)/i);
        if (match && match[1]) {
          roles.add(match[1].trim());
        }
      }
    });
    
    setUniqueRoles(Array.from(roles));
  }, [userStories]);
  
  // Fetch and generate mindmap syntax when dialog opens for the first time
  useEffect(() => {
    if (dialogOpen && userStories.length > 0 && !isGenerated) {
      console.log('Fetching mindmap syntax...');
      fetchMindmapSyntax();
    }
  }, [dialogOpen, userStories, isGenerated]);
  
  // Improved approach for rendering mermaid diagram with proper timing
  useEffect(() => {
    let renderTimeout: NodeJS.Timeout;
    
    if (dialogOpen && mindmapSyntax) {
      console.log('Dialog open and mindmap syntax available, scheduling render');
      
      // Use a longer delay to ensure dialog transition is complete
      renderTimeout = setTimeout(() => {
        console.log('Rendering mindmap now...');
        renderMindmap();
      }, 500); // Increased from 200ms to 500ms for dialog transition
    }
    
    return () => {
      if (renderTimeout) {
        clearTimeout(renderTimeout);
      }
    };
  }, [dialogOpen, mindmapSyntax]);
  
  // Additional effect to re-render when the window is resized
  useEffect(() => {
    const handleResize = () => {
      if (dialogOpen && mindmapSyntax) {
        console.log('Window resized, re-rendering mindmap');
        renderMindmap();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dialogOpen, mindmapSyntax]);
  
  // Function to render the mindmap
  const renderMindmap = async () => {
    if (!mindmapRef.current) {
      console.error('mindmapRef is not available!');
      return;
    }
    
    try {
      console.log('Starting mindmap rendering...', mindmapSyntax);
      // Clear previous content
      mindmapRef.current.innerHTML = '';
      
      // Create a simple div for the mermaid content
      const mermaidDiv = document.createElement('div');
      mermaidDiv.className = 'mermaid';
      mermaidDiv.textContent = mindmapSyntax;
      mindmapRef.current.appendChild(mermaidDiv);
      
      // Use Mermaid's render function with a short delay to ensure DOM is ready
      console.log('Running mermaid parser...');
      setTimeout(async () => {
        try {
          await mermaid.run({
            nodes: document.querySelectorAll('.mermaid')
          });
          console.log('Mermaid parsing complete!');
        } catch (delayedError) {
          console.error('Delayed mermaid parsing failed:', delayedError);
          fallbackToDefaultMindmap();
        }
      }, 300);
    } catch (error) {
      console.error('Failed to render mindmap:', error);
      fallbackToDefaultMindmap();
    }
  };
  
  // Separate fallback function for reuse
  const fallbackToDefaultMindmap = async () => {
    try {
      console.log('Trying fallback mindmap...');
      if (!mindmapRef.current) return;
      
      mindmapRef.current.innerHTML = '';
      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = 'mermaid';
      fallbackDiv.textContent = DEFAULT_MINDMAP_SYNTAX;
      mindmapRef.current.appendChild(fallbackDiv);
      
      await mermaid.run({
        nodes: document.querySelectorAll('.mermaid')
      });
      console.log('Fallback mindmap rendered successfully');
    } catch (fallbackError) {
      console.error('Even fallback mindmap failed:', fallbackError);
      setError('Failed to render the mindmap visualization');
    }
  };
  
  // Fetch mindmap syntax from the API (only once)
  const fetchMindmapSyntax = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Making API call to generate mindmap...');
      const response = await generateMindmapForUserStories(userStories, MINDMAP_PROMPT_ID);
      
      if (response.error) {
        console.warn('API returned error, using fallback mindmap:', response.error);
        setMindmapSyntax(DEFAULT_MINDMAP_SYNTAX);
      } else {
        console.log('Received mindmap syntax from API');
        setMindmapSyntax(response.mindmapSyntax);
      }
      setIsGenerated(true);
    } catch (error) {
      console.error('Error fetching mindmap syntax:', error);
      // Use default mindmap on error
      setMindmapSyntax(DEFAULT_MINDMAP_SYNTAX);
      setIsGenerated(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle dialog open/close event
  const handleOpenChange = (open: boolean) => {
    console.log('Dialog open state changing to:', open);
    
    // Only update if the state is actually changing
    if (dialogOpen !== open) {
      setDialogOpen(open);
      
      if (!open) {
        // Dialog is closing
        setError(null);
      } else if (open) {
        // Dialog is opening
        if (!isGenerated && userStories.length > 0) {
          // First time opening with stories - fetch syntax
          console.log('First time opening dialog with stories, fetching mindmap');
          fetchMindmapSyntax();
        } else if (isGenerated && mindmapSyntax) {
          // Re-opening with existing syntax - re-render
          console.log('Re-opening dialog with existing mindmap, scheduling re-render');
          setTimeout(renderMindmap, 500);
        }
      }
    }
  };
  
  const handleRetry = () => {
    console.log('Retry button clicked');
    setIsGenerated(false);
    setError(null);
    fetchMindmapSyntax();
  };
  
  // Manual button to open the dialog (for testing)
  const handleManualOpen = () => {
    console.log('Manual open button clicked');
    setDialogOpen(true);
  };
  
  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div onClick={() => setDialogOpen(true)} className="cursor-pointer transform transition-transform hover:scale-102 active:scale-98">
          <InfoCard 
            title="User Story Relationships" 
            className="animate-fade-in animate-once animate-delay-300 cursor-pointer h-full hover:border-primary"
            icon={<Network className="h-5 w-5 text-primary" />}
            glassmorphism
            hoverEffect
          >
            <div className="h-full flex flex-col justify-between">
              <div className="text-sm">
                <p className="text-muted-foreground">
                  Visual representation of user stories and their relationships
                </p>
              </div>
              
              <div 
                className="flex items-center justify-between text-primary font-medium mt-4"
              >
                <span>View Mindmap</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </InfoCard>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            User Story Mindmap
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg overflow-auto max-h-[70vh]">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              <span className="ml-3 text-muted-foreground">Generating mindmap...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-10 w-10 text-yellow-500 mb-2" />
              <p className="text-sm font-medium mb-1">Error generating mindmap</p>
              <p className="text-xs text-muted-foreground mb-4">{error}</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleRetry}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              <div 
                ref={mindmapRef} 
                className="w-full min-h-[400px] overflow-visible py-4"
                data-testid="mindmap-container"
              >
                {/* Mermaid content will be rendered here */}
                {!mindmapSyntax && (
                  <div className="flex justify-center items-center h-[400px]">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                )}
              </div>
              {mindmapSyntax && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={renderMindmap}
                  className="mt-4"
                >
                  Refresh Diagram
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserStoryMindmap; 