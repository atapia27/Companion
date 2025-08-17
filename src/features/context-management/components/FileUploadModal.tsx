'use client';

import { Upload, FileText, X, TestTube } from 'lucide-react';
import { FileProcessingResult } from '@/types';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '../hooks';
import { sampleFiles } from '../utils';
import { ProcessingStatus, InlineStatusMessage } from './ProcessingStatus';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto border-2 border-neutralharmony-background-300 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neutralharmony-primary-400 to-neutralharmony-primary-500 rounded-xl flex items-center justify-center shadow-lg">
              <Upload className="w-5 h-5 text-neutralharmony-background-50" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutralharmony-primary-900">Upload Documents</h2>
              <p className="text-neutralharmony-primary-600 text-sm">Add files to your knowledge base</p>
            </div>
          </div>
          <Button
            onClick={onCloseAction}
            variant="close"
            size="sm"
            className="rounded-xl p-2"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-neutralharmony-primary-500 bg-gradient-to-br from-neutralharmony-primary-50 to-neutralharmony-primary-100 scale-105'
              : 'border-neutralharmony-background-400 hover:border-neutralharmony-primary-400 hover:bg-neutralharmony-background-50 hover:scale-[1.02]'
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 bg-gradient-to-br from-neutralharmony-primary-400 to-neutralharmony-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Upload className="w-8 h-8 text-neutralharmony-background-50" />
          </div>
          {isDragActive ? (
            <p className="text-lg font-semibold text-neutralharmony-primary-700">Drop files here...</p>
          ) : (
            <div>
              <p className="text-lg font-semibold text-neutralharmony-primary-900 mb-2">
                Drag & drop files here, or click to select
              </p>
              <p className="text-neutralharmony-primary-600 text-sm">
                Supports PDF, DOCX, TXT, MD, and images
              </p>
            </div>
          )}
        </div>

        {/* Test Files Section - Compact */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-neutralharmony-secondary-400 to-neutralharmony-secondary-500 rounded-lg flex items-center justify-center">
                <TestTube className="w-3 h-3 text-neutralharmony-background-50" />
              </div>
              <h3 className="text-base font-bold text-neutralharmony-primary-900">
                Test Files
              </h3>
              {/* Inline Status Messages */}
              {error && (
                <InlineStatusMessage
                  key="error-message"
                  message={error}
                  type="error"
                  onClear={() => setError(null)}
                />
              )}
              {progress && (
                <InlineStatusMessage
                  key="progress-message"
                  message={progress.message}
                  type={progress.stage === 'complete' ? 'success' : 'progress'}
                  onClear={() => setError(null)}
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {sampleFiles.map((sampleFile, index) => (
              <button
                key={index}
                onClick={() => handleTestFile(sampleFile)}
                disabled={isProcessing}
                className="flex flex-col items-center space-y-2 p-3 bg-white border-2 border-neutralharmony-background-300 rounded-lg hover:border-neutralharmony-primary-400 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-neutralharmony-secondary-400 to-neutralharmony-secondary-500 rounded-lg flex items-center justify-center group-hover:from-neutralharmony-secondary-500 group-hover:to-neutralharmony-secondary-600 transition-all duration-300 shadow-sm">
                  <FileText className="w-4 h-4 text-neutralharmony-background-50" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-neutralharmony-primary-900 text-xs truncate w-full">
                    {sampleFile.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Processing Status */}
        <ProcessingStatus
          error={null}
          progress={null}
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
            className="bg-gradient-to-r from-neutralharmony-primary-500 to-neutralharmony-primary-600 hover:from-neutralharmony-primary-600 hover:to-neutralharmony-primary-700 text-neutralharmony-background-50 px-6 py-2 rounded-xl font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
