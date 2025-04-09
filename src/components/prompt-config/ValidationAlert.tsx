
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface ValidationAlertProps {
  validationError: string | null;
}

const ValidationAlert = ({ validationError }: ValidationAlertProps) => {
  if (!validationError) return null;
  
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Validation Error</AlertTitle>
      <AlertDescription>{validationError}</AlertDescription>
    </Alert>
  );
};

export default ValidationAlert;
