
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string;
  onConfigureApiClick: () => void;
}

const ErrorDisplay = ({ error, onConfigureApiClick }: ErrorDisplayProps) => {
  return (
    <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
      <h3 className="font-semibold">Error analyzing requirements:</h3>
      <p className="mt-1">{error}</p>
      {error.includes('API key') && (
        <Button onClick={onConfigureApiClick} className="mt-2">
          Configure API Key
        </Button>
      )}
    </div>
  );
};

export default ErrorDisplay;
