// @ts-ignore
import mammoth from "mammoth/mammoth.browser.js";
import { FileAttachment } from "@/components/ui/file-attachment";
// @ts-ignore
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
// @ts-ignore - Vite worker import to get URL
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker?worker&url";
import pptxParser from "pptx-parser";

// NOTE: For pdfjs to work in Vite/browser, you must set the workerSrc in your main entry point (e.g., main.ts):
// import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker?worker';
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// NOTE: pptx-parser may not work in all browsers or may require polyfills. If you encounter issues, consider using jszip + xml parsing for .pptx files.

// Save attachment to IndexedDB for larger file storage
const DB_NAME = 'methis-attachments-db';
const STORE_NAME = 'attachments';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

// Initialize the database
export const initAttachmentsDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve();
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event);
      reject(new Error('Could not open attachments database'));
    };
    
    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve();
    };
    
    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// Store an attachment in IndexedDB
export const storeAttachment = async (attachment: FileAttachment): Promise<void> => {
  await initAttachmentsDB();
  
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.put({
      id: attachment.id,
      file: attachment.file,
      dataUrl: attachment.dataUrl,
      timestamp: new Date().getTime()
    });
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to store attachment'));
  });
};

// Get an attachment from IndexedDB
export const getAttachment = async (id: string): Promise<FileAttachment | null> => {
  await initAttachmentsDB();
  
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.get(id);
    
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    
    request.onerror = () => reject(new Error('Failed to retrieve attachment'));
  });
};

// Delete an attachment from IndexedDB
export const deleteAttachment = async (id: string): Promise<void> => {
  await initAttachmentsDB();
  
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to delete attachment'));
  });
};

// Store multiple attachments
export const storeAttachments = async (attachments: FileAttachment[]): Promise<void> => {
  for (const attachment of attachments) {
    await storeAttachment(attachment);
  }
};

// Get multiple attachments by their IDs
export const getAttachments = async (ids: string[]): Promise<FileAttachment[]> => {
  const attachments: FileAttachment[] = [];
  
  for (const id of ids) {
    const attachment = await getAttachment(id);
    if (attachment) {
      attachments.push(attachment);
    }
  }
  
  return attachments;
};

// Delete multiple attachments
export const deleteAttachments = async (ids: string[]): Promise<void> => {
  for (const id of ids) {
    await deleteAttachment(id);
  }
};

// Clear all attachments
export const clearAttachments = async (): Promise<void> => {
  await initAttachmentsDB();
  
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.clear();
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to clear attachments'));
  });
};

// Extract text content from attachment data URL
export const extractTextFromDataUrl = (dataUrl: string): string => {
  try {
    // The data URL format is: data:[<mediatype>][;base64],<data>
    const base64Content = dataUrl.split(',')[1];
    return atob(base64Content);
  } catch (error) {
    console.error('Error extracting text from data URL:', error);
    return '';
  }
};

// Check if a file type is text-based
export const isTextFile = (fileType: string): boolean => {
  const textTypes = [
    'text/', 'csv', 'plain', 'markdown', 'txt', 'md', 
    'json', 'xml', 'html', 'css', 'javascript'
  ];
  
  return textTypes.some(type => fileType.toLowerCase().includes(type));
};

// Helper to check if a file is a docx
export const isDocxFile = (file: File) => {
  return (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.toLowerCase().endsWith(".docx")
  );
};

// Extract text content from a docx file using mammoth
export const extractTextFromDocx = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result;
        if (!arrayBuffer) return resolve("");
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        resolve(value);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(file);
  });
};

export const isPdfFile = (file: File) => {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
};

export const isPptxFile = (file: File) => {
  return (
    file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    file.name.toLowerCase().endsWith(".pptx")
  );
};

// Extract text from PDF using pdfjs-dist
export const extractTextFromPdf = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
        // @ts-ignore
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
        resolve(text);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(file);
  });
};

// Extract text from PPTX using pptx-parser
export const extractTextFromPptx = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result;
        if (!arrayBuffer) return resolve("");
        // @ts-ignore
        pptxParser(arrayBuffer, (err: any, data: any) => {
          if (err) return reject(err);
          // data.slides is an array of slides, each with an array of texts
          const text = data.slides.map((slide: any) => slide.texts.join(' ')).join('\n--- Slide ---\n');
          resolve(text);
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(file);
  });
};

// Update extractTextFromAttachments to support docx, pdf, pptx
export const extractTextFromAttachments = async (attachments: FileAttachment[]): Promise<string> => {
  let extractedText = '';
  for (const attachment of attachments) {
    if (isDocxFile(attachment.file)) {
      try {
        const textContent = await extractTextFromDocx(attachment.file);
        extractedText += `\n\n--- Content from ${attachment.file.name} ---\n${textContent}\n--- End of ${attachment.file.name} ---\n`;
      } catch (error) {
        console.error(`Error extracting text from DOCX ${attachment.file.name}:`, error);
      }
    } else if (isPdfFile(attachment.file)) {
      try {
        const textContent = await extractTextFromPdf(attachment.file);
        extractedText += `\n\n--- Content from ${attachment.file.name} ---\n${textContent}\n--- End of ${attachment.file.name} ---\n`;
      } catch (error) {
        console.error(`Error extracting text from PDF ${attachment.file.name}:`, error);
      }
    } else if (isPptxFile(attachment.file)) {
      try {
        const textContent = await extractTextFromPptx(attachment.file);
        extractedText += `\n\n--- Content from ${attachment.file.name} ---\n${textContent}\n--- End of ${attachment.file.name} ---\n`;
      } catch (error) {
        console.error(`Error extracting text from PPTX ${attachment.file.name}:`, error);
      }
    } else if (attachment.dataUrl && isTextFile(attachment.file.type || attachment.file.name)) {
      try {
        const textContent = extractTextFromDataUrl(attachment.dataUrl);
        extractedText += `\n\n--- Content from ${attachment.file.name} ---\n${textContent}\n--- End of ${attachment.file.name} ---\n`;
      } catch (error) {
        console.error(`Error extracting text from ${attachment.file.name}:`, error);
      }
    }
  }
  return extractedText;
};

// Set workerSrc for PDF.js
// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker; 