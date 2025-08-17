import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { fileProcessor } from '@/lib/file-processor';
import { FileProcessingResult, ProcessingProgress } from '@/types';

interface UseFileUploadProps {
  onFileProcessedAction: (result: FileProcessingResult) => void;
  existingContent: FileProcessingResult[];
}

export function useFileUpload({ onFileProcessedAction, existingContent }: UseFileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [processedFiles, setProcessedFiles] = useState<FileProcessingResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize processedFiles with existing content (files only)
  useEffect(() => {
    const existingFiles = existingContent.filter(content => content.metadata.filename);
    setProcessedFiles(existingFiles);
  }, [existingContent]);

  const handleTestFile = async (sampleFile: {
    path: string;
    name: string;
    type: string;
    description: string;
  }) => {
    // Check for duplicates
    const isDuplicate = existingContent.some(content => 
      content.metadata.filename === sampleFile.name ||
      content.metadata.customName === sampleFile.name
    );

    if (isDuplicate) {
      setError(`${sampleFile.name} is already uploaded`);
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
      onFileProcessedAction(result);
      
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
        setError(`${file.name} is already uploaded`);
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
        onFileProcessedAction(result);
        
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
  }, [onFileProcessedAction, existingContent]);

  const dropzoneProps = useDropzone({
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

  return {
    isProcessing,
    progress,
    processedFiles,
    error,
    setError,
    handleTestFile,
    dropzoneProps,
  };
}
