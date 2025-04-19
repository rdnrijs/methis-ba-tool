import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, ClipboardList, Key } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const userInitials = user.email ? user.email.substring(0, 2).toUpperCase() : 'U';
  
  const handleSignOut = async () => {
    await signOut();
    toast.success('Successfully signed out');
  };

  const handleViewLogs = () => {
    navigate('/logs');
  };

  const handleConfigureAPI = () => {
    navigate('/api-config');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-medium text-sm">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleConfigureAPI} className="cursor-pointer">
          <Key className="mr-2 h-4 w-4" />
          <span>API Configuration</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleViewLogs} className="cursor-pointer">
          <ClipboardList className="mr-2 h-4 w-4" />
          <span>View Logs</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
