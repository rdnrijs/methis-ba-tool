import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, X, File } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export interface FileAttachment {
  id: string;
  file: File;
  dataUrl?: string;
}

interface FileAttachmentProps {
  attachments: FileAttachment[];
  onAttach: (attachments: FileAttachment[]) => void;
  onRemove: (id: string) => void;
  maxSize?: number; // in MB
  maxFiles?: number;
  accept?: string;
}

export const FileAttachment = ({
  attachments,
  onAttach,
  onRemove,
  maxSize = 10, // 10MB default
  maxFiles = 5,
  accept = "*"
}: FileAttachmentProps) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + attachments.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files`);
      return;
    }
    
    // Check file size
    const oversizedFiles = files.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the maximum size of ${maxSize}MB`);
      return;
    }
    
    setError(null);
    
    // Process files
    const newAttachments: FileAttachment[] = [];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const attachment: FileAttachment = {
          id: uuidv4(),
          file,
          dataUrl: e.target?.result as string
        };
        newAttachments.push(attachment);
        
        // If all files are processed, update the state
        if (newAttachments.length === files.length) {
          onAttach([...attachments, ...newAttachments]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={attachments.length >= maxFiles}
        >
          <Paperclip className="h-4 w-4 mr-2" />
          Attach Files
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
      
      {attachments.length > 0 && (
        <div className="space-y-2 mt-2">
          {attachments.map(attachment => (
            <div 
              key={attachment.id} 
              className="flex items-center justify-between p-2 rounded-md border border-input bg-background"
            >
              <div className="flex items-center">
                <File className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm truncate max-w-[200px]">{attachment.file.name}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({(attachment.file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(attachment.id)}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 