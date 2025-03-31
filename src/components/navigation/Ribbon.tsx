
import { Home, Key, FileText } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getApiKey } from '@/utils/storageUtils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const Ribbon = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasApiKey = !!getApiKey();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
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
            <p>Home</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleNavigation('/api-config')}
              className={cn(
                "rounded-full",
                !hasApiKey && "text-yellow-500",
                isActive('/api-config') && "bg-accent text-accent-foreground"
              )}
            >
              <Key className="h-5 w-5" />
              <span className="sr-only">API Configuration</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>API Configuration</p>
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
                isActive('/analyze') && "bg-accent text-accent-foreground"
              )}
            >
              <FileText className="h-5 w-5" />
              <span className="sr-only">Analyze</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Analyze</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default Ribbon;
