
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Ribbon from './navigation/Ribbon';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const Layout = ({
  children,
  className,
  fullWidth = false
}: LayoutProps) => {
  return <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 border-b border-border/50 backdrop-blur-sm sticky top-0 z-10 bg-background/80">
        <div className={cn("mx-auto flex items-center justify-between", fullWidth ? "w-full" : "max-w-6xl")}>
          <Link to="/" className="font-medium text-2xl transition-opacity hover:opacity-80 mx-0 flex items-center gap-2">
            <img 
              src="/lovable-uploads/e3f13bd0-379f-4e01-8701-a83d72fc8f9d.png" 
              alt="Methis Logo" 
              className="w-8 h-8" 
            />
            Methis BA tool
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/analyze" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Analyze
            </Link>
          </nav>
        </div>
      </header>
      
      <main className={cn("flex-1", className)}>
        {children}
      </main>
      
      <footer className="py-6 px-6 border-t border-border/50">
        <div className={cn("mx-auto flex flex-col md:flex-row md:items-center justify-between text-sm text-muted-foreground", fullWidth ? "w-full" : "max-w-6xl")}>
          <p>© {new Date().getFullYear()} Requlator. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
      
      <Ribbon />
    </div>;
};

export default Layout;
