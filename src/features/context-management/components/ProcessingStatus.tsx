'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, FileText, Link as LinkIcon, X } from 'lucide-react';
import { FileProcessingResult, ProcessingProgress } from '@/types';

interface ProcessingStatusProps {
  error: string | null;
  progress: ProcessingProgress | null;
  processedItems: FileProcessingResult[];
  itemType: 'file' | 'url';
  isProcessing: boolean;
  onClearError?: () => void;
}

export function ProcessingStatus({ 
  error, 
  progress, 
  processedItems, 
  itemType, 
  isProcessing,
  onClearError
}: ProcessingStatusProps) {
  const IconComponent = itemType === 'file' ? FileText : LinkIcon;
  const itemLabel = itemType === 'file' ? 'Files' : 'URLs';
  const itemLabelSingular = itemType === 'file' ? 'File' : 'URL';

  // Auto-dismiss messages after 3 seconds
  useEffect(() => {
    if ((error || progress) && onClearError) {
      const timer = setTimeout(() => {
        onClearError();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, progress, onClearError]);

  return (
    <>
      {/* Processed Items - Compact Badge Layout */}
      {processedItems.length > 0 && (
        <div className="mt-4">
                     <div className="flex items-center justify-between mb-3">
             <div className="flex items-center space-x-2">
               <div className={`w-5 h-5 bg-gradient-to-br rounded-lg flex items-center justify-center ${
                 itemType === 'file' 
                   ? 'from-neutralharmony-primary-400 to-neutralharmony-primary-500'
                   : 'from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500'
               }`}>
                 <IconComponent className="w-3 h-3 text-neutralharmony-background-50" />
               </div>
               <h3 className="text-sm font-bold text-neutralharmony-primary-900">
                 Processed {itemLabel} ({processedItems.length})
               </h3>
             </div>
           </div>
          
          {/* Compact Badge Layout */}
          <div className="flex flex-wrap gap-2">
            {processedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 px-3 py-2 bg-white border-2 border-neutralharmony-background-300 rounded-lg hover:border-neutralharmony-primary-400 transition-all duration-200"
              >
                <div className={`w-4 h-4 bg-gradient-to-br rounded flex items-center justify-center ${
                  itemType === 'file' 
                    ? 'from-neutralharmony-primary-400 to-neutralharmony-primary-500'
                    : 'from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500'
                }`}>
                  <IconComponent className="w-2 h-2 text-neutralharmony-background-50" />
                </div>
                <span className="font-medium text-neutralharmony-primary-900 text-xs truncate max-w-24">
                  {item.metadata.customName || item.metadata.filename || item.metadata.summary || `${itemLabelSingular} ${index + 1}`}
                </span>
                <span className="text-xs text-neutralharmony-primary-600 bg-neutralharmony-background-100 px-1.5 py-0.5 rounded">
                  {item.text.length}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// New reusable component for displaying processed content
export function ProcessedContentDisplay({ 
  processedItems, 
  itemType 
}: { 
  processedItems: FileProcessingResult[]; 
  itemType: 'file' | 'url' | 'mixed'; 
}) {
  const IconComponent = itemType === 'file' ? FileText : LinkIcon;
  const itemLabel = itemType === 'file' ? 'Files' : itemType === 'url' ? 'URLs' : 'Content';
  const itemLabelSingular = itemType === 'file' ? 'File' : itemType === 'url' ? 'URL' : 'Item';

  if (processedItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {itemType !== 'mixed' && (
            <div className={`w-5 h-5 bg-gradient-to-br rounded-lg flex items-center justify-center ${
              itemType === 'file' 
                ? 'from-neutralharmony-primary-400 to-neutralharmony-primary-500'
                : 'from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500'
            }`}>
              <IconComponent className="w-3 h-3 text-neutralharmony-background-50" />
            </div>
          )}
          <h3 className="text-sm font-bold text-neutralharmony-primary-900">
            {itemType === 'mixed' ? 'Content to Analyze' : `Processed ${itemLabel}`} ({processedItems.length} items)
          </h3>
        </div>
        {itemType !== 'mixed' && (
          <div className="w-5 h-5 bg-gradient-to-br from-neutralharmony-secondary-400 to-neutralharmony-secondary-500 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-neutralharmony-background-50" />
          </div>
        )}
      </div>
      
      {/* Compact Badge Layout */}
      <div className="flex flex-wrap gap-2">
        {processedItems.map((item, index) => {
          const isFile = item.metadata.filename;
          const itemGradient = isFile 
            ? 'from-neutralharmony-primary-400 to-neutralharmony-primary-500'
            : 'from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500';
          
          return (
            <div
              key={index}
              className="flex items-center space-x-2 px-3 py-2 bg-white border-2 border-neutralharmony-background-300 rounded-lg hover:border-neutralharmony-primary-400 transition-all duration-200"
            >
              <div className={`w-4 h-4 bg-gradient-to-br rounded flex items-center justify-center ${itemGradient}`}>
                {isFile ? (
                  <FileText className="w-2 h-2 text-neutralharmony-background-50" />
                ) : (
                  <LinkIcon className="w-2 h-2 text-neutralharmony-background-50" />
                )}
              </div>
              <span className="font-medium text-neutralharmony-primary-900 text-xs truncate max-w-24">
                {item.metadata.customName || item.metadata.filename || item.metadata.summary || `${isFile ? 'File' : 'URL'} ${index + 1}`}
              </span>
              <span className="text-xs text-neutralharmony-primary-600 bg-neutralharmony-background-100 px-1.5 py-0.5 rounded">
                {item.text.length}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// New component for inline status messages
export function InlineStatusMessage({ 
  message, 
  type, 
  onClear 
}: { 
  message: string; 
  type: 'success' | 'error' | 'progress'; 
  onClear: () => void; 
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClear();
      }, 300); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClear]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-700';
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-700';
      case 'progress':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-700';
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClear();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 border-2 rounded-lg text-xs font-medium transition-opacity duration-300 flex-shrink-0 min-w-0 ${getStyles()}`}>
      {type === 'success' && <CheckCircle className="w-3 h-3 flex-shrink-0" />}
      {type === 'error' && <X className="w-3 h-3 flex-shrink-0" />}
      {type === 'progress' && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />}
      <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0">{message}</span>
      <button
        onClick={handleClose}
        className="ml-1 p-0.5 hover:bg-black/10 rounded transition-colors flex-shrink-0"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </div>
  );
}
