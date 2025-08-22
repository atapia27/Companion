'use client';

import { Upload, FileText, TestTube } from 'lucide-react';
import { FileProcessingResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { useFileUpload } from '../hooks';
import { sampleFiles } from '../utils';
import { ProcessingStatus, InlineStatusMessage } from './ProcessingStatus';
import { getFileTypeIcon } from '../utils';

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
    <Modal
      isOpen={true}
      onClose={onCloseAction}
      title="Upload Documents"
      icon={<Upload className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
      iconColor="from-neutralharmony-primary-400 to-neutralharmony-primary-500"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Description */}
        <p className="text-neutralharmony-primary-600 text-sm">
          Add files to your knowledge base
        </p>

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-neutralharmony-primary-500 bg-gradient-to-br from-neutralharmony-primary-50 to-neutralharmony-primary-100 scale-105'
              : 'border-neutralharmony-background-400 hover:border-neutralharmony-primary-400 hover:bg-neutralharmony-background-50 hover:scale-[1.02]'
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-neutralharmony-primary-400 to-neutralharmony-primary-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-neutralharmony-background-50" />
          </div>
          {isDragActive ? (
            <p className="text-base sm:text-lg font-semibold text-neutralharmony-primary-700">Drop files here...</p>
          ) : (
            <div>
              <p className="text-base sm:text-lg font-semibold text-neutralharmony-primary-900 mb-2">
                Drag & drop files here, or click to select
              </p>
              <p className="text-neutralharmony-primary-600 text-xs sm:text-sm">
                Supports PDF, DOCX, TXT, MD, and images
              </p>
            </div>
          )}
        </div>

        {/* Test Files Section - Compact */}
        <div className="mt-4 sm:mt-6">
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-neutralharmony-secondary-400 to-neutralharmony-secondary-500 rounded-lg flex items-center justify-center">
                <TestTube className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutralharmony-background-50" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-neutralharmony-primary-900">
                Test Files
              </h3>
            </div>
            {/* Inline Status Messages */}
            <div className="space-y-1">
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
                <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:shadow-md transition-all duration-300">
                  {getFileTypeIcon(sampleFile.type, sampleFile.name)}
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
    </Modal>
  );
}
