import { Home, FileText, BarChart2, History as HistoryIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAnalyze } from '@/contexts/AnalyzeContext';
import { useContext } from 'react';
import { AnalyzeContext } from '@/contexts/AnalyzeContext';
import type { RecentAnalysisEntry } from '@/contexts/AnalyzeContext';
import { useState, useCallback } from 'react';

const Ribbon = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, recentResults, resetCurrentAnalysis, activateLatestResult } = useAnalyze();
  const analyzeContext = useContext(AnalyzeContext);

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

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleString();
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

  // Handler for starting a new analysis
  const handleStartNewAnalysis = useCallback(() => {
    resetCurrentAnalysis();
    if (analyzeContext && typeof analyzeContext.setShowInput === 'function') {
      analyzeContext.setShowInput(true);
    }
    navigate('/analyze');
  }, [resetCurrentAnalysis, navigate, analyzeContext]);

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
              onClick={handleStartNewAnalysis}
              className={cn("rounded-full")}
            >
              <FileText className="h-5 w-5" />
              <span className="sr-only">Start a new analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Start a new analysis</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                activateLatestResult();
                navigate('/analyze');
              }}
              className={cn("rounded-full")}
              disabled={recentResults.length === 0}
            >
              <BarChart2 className="h-5 w-5" />
              <span className="sr-only">Latest Output</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Show latest output</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/history')}
              className={cn("rounded-full")}
            >
              <HistoryIcon className="h-5 w-5" />
              <span className="sr-only">History</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>History</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default Ribbon;
