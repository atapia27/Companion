'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle, TestTube } from 'lucide-react';
import { fileProcessor } from '@/lib/file-processor';
import { FileProcessingResult, ProcessingProgress } from '@/types';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileProcessed: (result: FileProcessingResult) => void;
  onClose: () => void;
  existingContent: FileProcessingResult[];
}

export function FileUpload({ onFileProcessed, onClose, existingContent }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [processedFiles, setProcessedFiles] = useState<FileProcessingResult[]>([]);

  // Sample files for testing
  const sampleFiles = [
    {
      path: '/files/invoicesample.pdf',
      name: 'Invoice Sample',
      type: 'application/pdf',
      description: 'Sample PDF invoice for testing'
    },
    {
      path: '/files/sample1.docx',
      name: 'Sample Document',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      description: 'Sample Word document for testing'
    },
    {
      path: '/files/sample1.txt',
      name: 'Sample Text',
      type: 'text/plain',
      description: 'Sample text file for testing'
    },
    {
      path: '/files/thinking-in-react.md',
      name: 'React Guide',
      type: 'text/markdown',
      description: 'Sample Markdown file for testing'
    }
  ];

  const handleTestFile = async (sampleFile: typeof sampleFiles[0]) => {
    // Check for duplicates
    const isDuplicate = existingContent.some(content => 
      content.metadata.filename === sampleFile.name ||
      content.metadata.customName === sampleFile.name
    );

    if (isDuplicate) {
      setProgress({
        stage: 'uploading',
        progress: 0,
        message: `${sampleFile.name} is already uploaded`,
        error: 'This file has already been uploaded'
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      setProgress({
        stage: 'uploading',
        progress: 0,
        message: `Loading test file: ${sampleFile.name}...`,
      });

      const response = await fetch(sampleFile.path);
      const blob = await response.blob();
      const file = new File([blob], sampleFile.name, { type: sampleFile.type });
      
      setProgress({
        stage: 'extracting',
        progress: 50,
        message: `Processing ${sampleFile.name}...`,
      });

      const result = await fileProcessor.processFile(file, (progress) => {
        setProgress(progress);
      });

      setProcessedFiles(prev => [...prev, result]);
      onFileProcessed(result);
      
      setProgress({
        stage: 'complete',
        progress: 100,
        message: `${sampleFile.name} processed successfully!`,
      });
    } catch (error) {
      console.error('Error processing test file:', error);
      setProgress({
        stage: 'extracting',
        progress: 0,
        message: `Error processing ${sampleFile.name}`,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    
    for (const file of acceptedFiles) {
      // Check for duplicates
      const isDuplicate = existingContent.some(content => 
        content.metadata.filename === file.name ||
        content.metadata.customName === file.name
      );

      if (isDuplicate) {
        setProgress({
          stage: 'uploading',
          progress: 0,
          message: `${file.name} is already uploaded`,
          error: 'This file has already been uploaded'
        });
        continue; // Skip this file and continue with the next one
      }

      try {
        setProgress({
          stage: 'uploading',
          progress: 0,
          message: `Processing ${file.name}...`,
        });

        const result = await fileProcessor.processFile(file, (progress) => {
          setProgress(progress);
        });

        setProcessedFiles(prev => [...prev, result]);
        onFileProcessed(result);
        
        setProgress({
          stage: 'complete',
          progress: 100,
          message: `${file.name} processed successfully!`,
        });
      } catch (error) {
        console.error('Error processing file:', error);
        setProgress({
          stage: 'extracting',
          progress: 0,
          message: `Error processing ${file.name}`,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    setIsProcessing(false);
  }, [onFileProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md', '.markdown'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
    },
    multiple: true,
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-neutralharmony-background-50 dark:bg-neutralharmony-primary-900 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto border border-neutralharmony-background-300 dark:border-neutralharmony-primary-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutralharmony-primary-900 dark:text-neutralharmony-background-50">Upload Documents</h2>
          <Button
            onClick={onClose}
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

        {/* Progress */}
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

        {/* Processed Files */}
        {processedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-neutralharmony-primary-900 dark:text-neutralharmony-background-50 mb-3">
              Processed Files ({processedFiles.length})
            </h3>
            <div className="space-y-2">
              {processedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-neutralharmony-background-100 dark:bg-neutralharmony-primary-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-neutralharmony-primary-600 dark:text-neutralharmony-primary-400" />
                    <div>
                      <p className="font-medium text-neutralharmony-primary-900 dark:text-neutralharmony-background-50">
                        {file.metadata.customName || file.metadata.filename || `File ${index + 1}`}
                      </p>
                      <p className="text-sm text-neutralharmony-primary-700 dark:text-neutralharmony-background-400">
                        {file.text.length} characters extracted
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-neutralharmony-secondary-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
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
