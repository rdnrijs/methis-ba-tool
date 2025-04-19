import { Home, FileText, BarChart2, History } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAnalyze } from '@/contexts/AnalyzeContext';

const Ribbon = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = useAnalyze();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    
    // For the home button, always navigate directly to the root path
    if (path === '/') {
      navigate('/');
      return;
    }
    
    // For other paths, use navigate
    navigate(path);
  };

  const handleResultsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (result) {
      navigate('/analyze');
    }
  };

  const getTooltipContent = (stage: string) => {
    switch (stage) {
      case 'home':
        return "Home";
      case 'input':
        return "Start a new analysis";
      case 'results':
        return result ? "View analysis results" : "No analysis results available yet. Complete an analysis first.";
      case 'logs':
        return "View analysis logs";
      default:
        return "";
    }
  };
  
  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-background border border-border/50 rounded-full shadow-lg p-2 z-50">
      <div className="flex flex-col items-center space-y-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleNavigation('/')}
              className={cn(
                "rounded-full", 
                isActive('/') && "bg-accent text-accent-foreground"
              )}
            >
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{getTooltipContent('home')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleNavigation('/analyze')}
              className={cn(
                "rounded-full",
                isActive('/analyze') && !result && "bg-accent text-accent-foreground"
              )}
            >
              <FileText className="h-5 w-5" />
              <span className="sr-only">Input</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{getTooltipContent('input')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleResultsClick}
              className={cn(
                "rounded-full",
                isActive('/analyze') && result && "bg-accent text-accent-foreground",
                !result && "opacity-50 cursor-not-allowed"
              )}
            >
              <BarChart2 className="h-5 w-5" />
              <span className="sr-only">Results</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{getTooltipContent('results')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleNavigation('/logs')}
              className={cn(
                "rounded-full",
                isActive('/logs') && "bg-accent text-accent-foreground"
              )}
            >
              <History className="h-5 w-5" />
              <span className="sr-only">Logs</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{getTooltipContent('logs')}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default Ribbon;
