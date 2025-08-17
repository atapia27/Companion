'use client';

import { useEffect } from 'react';
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

  // Auto-dismiss error after 2 seconds
  useEffect(() => {
    if (error && onClearError) {
      const timer = setTimeout(() => {
        onClearError();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error, onClearError]);

  return (
    <>
      {/* Error Display */}
      {error && (
        <div className="mt-4 mb-4 p-3 bg-neutralharmony-contrast-50 dark:bg-neutralharmony-contrast-900/20 border border-neutralharmony-contrast-200 dark:border-neutralharmony-contrast-800 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutralharmony-contrast-700 dark:text-neutralharmony-contrast-300">
              {error}
            </p>
            {onClearError && (
              <button
                onClick={onClearError}
                className="ml-2 p-1 text-neutralharmony-contrast-500 hover:text-neutralharmony-contrast-700 dark:text-neutralharmony-contrast-400 dark:hover:text-neutralharmony-contrast-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Progress Display */}
      {progress && (
        <div className="mt-6 p-4 bg-neutralharmony-background-100 dark:bg-neutralharmony-primary-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutralharmony-primary-900 dark:text-neutralharmony-background-50">
              {progress.message}
            </span>
            {progress.stage === 'complete' && (
              <CheckCircle className="w-5 h-5 text-neutralharmony-secondary-500" />
            )}
          </div>
          {progress.stage !== 'complete' && (
            <div className="w-full bg-neutralharmony-background-300 dark:bg-neutralharmony-primary-700 rounded-full h-2">
              <div
                className="bg-neutralharmony-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          )}
          {progress.error && (
            <p className="text-sm text-neutralharmony-contrast-600 dark:text-neutralharmony-contrast-400 mt-2">
              Error: {progress.error}
            </p>
          )}
        </div>
      )}

      {/* Processed Items */}
      {processedItems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-neutralharmony-primary-900 dark:text-neutralharmony-background-50 mb-3">
            Processed {itemLabel} ({processedItems.length})
          </h3>
          <div className="space-y-2">
            {processedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-neutralharmony-background-100 dark:bg-neutralharmony-primary-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <IconComponent 
                    className={`w-5 h-5 ${
                      itemType === 'file' 
                        ? 'text-neutralharmony-primary-600 dark:text-neutralharmony-primary-400'
                        : 'text-neutralharmony-tertiary-600 dark:text-neutralharmony-tertiary-400'
                    }`} 
                  />
                  <div>
                    <p className="font-medium text-neutralharmony-primary-900 dark:text-neutralharmony-background-50">
                      {item.metadata.customName || item.metadata.filename || item.metadata.summary || `${itemLabelSingular} ${index + 1}`}
                    </p>
                    <p className="text-sm text-neutralharmony-primary-700 dark:text-neutralharmony-background-400">
                      {item.text.length} characters extracted
                    </p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-neutralharmony-secondary-500" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
