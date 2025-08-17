'use client';

import { Upload, FileText, X, TestTube } from 'lucide-react';
import { FileProcessingResult } from '@/types';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '../hooks';
import { sampleFiles } from '../utils';
import { ProcessingStatus } from './ProcessingStatus';

interface FileUploadModalProps {
  onFileProcessedAction: (result: FileProcessingResult) => void;
  onCloseAction: () => void;
  existingContent: FileProcessingResult[];
}

export function FileUploadModal({ onFileProcessedAction, onCloseAction, existingContent }: FileUploadModalProps) {
  const {
    isProcessing,
    progress,
    processedFiles,
    error,
    setError,
    handleTestFile,
    dropzoneProps,
  } = useFileUpload({ onFileProcessedAction, existingContent });

  const { getRootProps, getInputProps, isDragActive } = dropzoneProps;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-neutralharmony-background-50 dark:bg-neutralharmony-primary-900 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto border border-neutralharmony-background-300 dark:border-neutralharmony-primary-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutralharmony-primary-900 dark:text-neutralharmony-background-50">Upload Documents</h2>
          <Button
            onClick={onCloseAction}
            variant="ghost"
            size="sm"
            className="text-neutralharmony-primary-700 dark:text-neutralharmony-background-400 hover:text-neutralharmony-primary-900 dark:hover:text-neutralharmony-background-50"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-neutralharmony-primary-500 bg-neutralharmony-primary-50 dark:bg-neutralharmony-primary-900/20'
              : 'border-neutralharmony-background-400 dark:border-neutralharmony-primary-600 hover:border-neutralharmony-primary-500 dark:hover:border-neutralharmony-primary-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-neutralharmony-primary-600 dark:text-neutralharmony-primary-400" />
          {isDragActive ? (
            <p className="text-lg font-medium text-neutralharmony-primary-700 dark:text-neutralharmony-primary-300">Drop files here...</p>
          ) : (
            <div>
              <p className="text-lg font-medium text-neutralharmony-primary-900 dark:text-neutralharmony-background-50 mb-2">
                Drag & drop files here, or click to select
              </p>
              <p className="text-neutralharmony-primary-700 dark:text-neutralharmony-background-400 text-sm">
                Supports PDF, DOCX, TXT, MD, and images
              </p>
            </div>
          )}
        </div>

        {/* Test Files Section */}
        <div className="mt-6">
          <div className="flex items-center space-x-2 mb-4">
            <TestTube className="w-5 h-5 text-neutralharmony-secondary-600" />
            <h3 className="text-lg font-semibold text-neutralharmony-primary-900 dark:text-neutralharmony-background-50">
              Test Files
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sampleFiles.map((sampleFile, index) => (
              <button
                key={index}
                onClick={() => handleTestFile(sampleFile)}
                disabled={isProcessing}
                className="flex items-center space-x-3 p-3 bg-neutralharmony-secondary-50 dark:bg-neutralharmony-secondary-900/20 border border-neutralharmony-secondary-200 dark:border-neutralharmony-secondary-700 rounded-lg hover:bg-neutralharmony-secondary-100 dark:hover:bg-neutralharmony-secondary-900/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-5 h-5 text-neutralharmony-secondary-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <p className="font-medium text-neutralharmony-primary-900 dark:text-neutralharmony-background-50 text-sm truncate">
                    {sampleFile.name}
                  </p>
                  <p className="text-xs text-neutralharmony-primary-600 dark:text-neutralharmony-background-400 truncate">
                    {sampleFile.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Processing Status */}
        <ProcessingStatus
          error={error}
          progress={progress}
          processedItems={processedFiles}
          itemType="file"
          isProcessing={isProcessing}
          onClearError={() => setError(null)}
        />

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onCloseAction}
            disabled={isProcessing}
            className="bg-neutralharmony-primary-500 hover:bg-neutralharmony-primary-600 text-neutralharmony-background-50 px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
