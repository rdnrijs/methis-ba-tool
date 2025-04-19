import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Building } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllClients, Client } from '@/utils/supabaseService';
import { toast } from 'sonner';

interface ClientSelectorProps {
  onClientSelect: (client: Client | null) => void;
}

const ClientSelector = ({ onClientSelect }: ClientSelectorProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('none');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching clients...');
        const clientsData = await getAllClients();
        console.log('Fetched clients:', clientsData);
        setClients(clientsData);
        setError(null);
      } catch (error) {
        console.error('Error loading clients:', error);
        setError('Unable to load clients');
        toast.error('Unable to load clients. The clients table may not exist yet.');
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, []);

  const handleClientChange = (value: string) => {
    console.log('Selected client ID:', value);
    setSelectedClientId(value);
    if (value === 'none') {
      onClientSelect(null);
    } else {
      const selectedClient = clients.find(client => client.id === value);
      console.log('Found client:', selectedClient);
      if (selectedClient) {
        onClientSelect(selectedClient);
        // Show a toast with the context being loaded
        if (selectedClient.client_context) {
          toast.info(`Loaded context for ${selectedClient.client_name}`);
        }
      }
    }
  };

  // If there's an error loading clients, don't show the selector
  if (error) {
    return null;
  }

  console.log('Rendering with clients:', clients);
  return (
    <div className="space-y-1">
      <div className="flex items-center">
        <Building className="h-5 w-5 mr-2 text-primary" />
        <Label htmlFor="client" className="text-sm font-medium">Client</Label>
      </div>
      <Select
        value={selectedClientId}
        onValueChange={handleClientChange}
        disabled={isLoading}
      >
        <SelectTrigger id="client" className="w-full">
          <SelectValue placeholder="Select a client" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Select a client</SelectItem>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id} className="py-2">
              {client.client_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedClientId !== 'none' && clients.find(c => c.id === selectedClientId)?.client_context && (
        <p className="text-xs text-muted-foreground mt-1">
          Client context loaded: {clients.find(c => c.id === selectedClientId)?.client_context?.substring(0, 100)}...
        </p>
      )}
    </div>
  );
};

export default ClientSelector; 