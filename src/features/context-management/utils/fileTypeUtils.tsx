import React from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  WholeWord, 
  Highlighter 
} from 'lucide-react';

// Helper function to get file type icon
export function getFileTypeIcon(fileType: string, filename?: string): React.ReactNode {
  const extension = filename ? filename.split('.').pop()?.toLowerCase() || '' : '';
  
  // Image files
  if (fileType.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico'].includes(extension)) {
    return <ImageIcon className="w-5 h-5 text-emerald-600" />;
  }
  
  // PDF files
  if (fileType === 'application/pdf' || extension === 'pdf') {
    return <FileText className="w-5 h-5 text-red-600" />;
  }
  
  // Word documents
  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      fileType === 'application/msword' || 
      ['docx', 'doc'].includes(extension)) {
    return <WholeWord className="w-5 h-5 text-blue-600" />;
  }
  
  // Text and code files
  if (fileType.startsWith('text/') || 
      ['txt', 'md', 'markdown', 'json', 'xml', 'html', 'css', 'js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt'].includes(extension)) {
    return <Highlighter className="w-5 h-5 text-purple-600" />;
  }
  
  // Default file icon
  return <FileText className="w-5 h-5 text-gray-600" />;
}
