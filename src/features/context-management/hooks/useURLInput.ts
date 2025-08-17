import { useState } from 'react';
import { fileProcessor } from '@/lib/file-processor';
import { FileProcessingResult } from '@/types';

interface UseURLInputProps {
  onURLProcessed: (result: FileProcessingResult) => void;
  existingContent: FileProcessingResult[];
}

export function useURLInput({ onURLProcessed, existingContent }: UseURLInputProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedURLs, setProcessedURLs] = useState<FileProcessingResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleTestURL = async (sampleURL: {
    url: string;
    name: string;
    description: string;
  }) => {
    // Check for duplicates
    const isDuplicate = existingContent.some(content => 
      content.metadata.customName === sampleURL.name ||
      content.metadata.summary === sampleURL.name
    );

    if (isDuplicate) {
      setError(`${sampleURL.name} is already added`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await fileProcessor.extractFromURL(sampleURL.url);
      
      const resultWithName = {
        ...result,
        metadata: {
          ...result.metadata,
          customName: sampleURL.name,
        },
      };
      
      setProcessedURLs(prev => [...prev, resultWithName]);
      onURLProcessed(resultWithName);
    } catch (error) {
      console.error('Error processing test URL:', error);
      let errorMessage = 'Failed to process test URL';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await fileProcessor.extractFromURL(url);
      
      // Check for duplicates after getting the result
      const customName = name.trim() || result.metadata.summary || 'Web page content';
      const isDuplicate = existingContent.some(content => 
        content.metadata.customName === customName ||
        content.metadata.summary === customName
      );

      if (isDuplicate) {
        setError('This URL or content name is already added');
        setIsProcessing(false);
        return;
      }
      
      // Add custom name to the result if provided
      const resultWithName = {
        ...result,
        metadata: {
          ...result.metadata,
          customName: customName,
        },
      };
      
      setProcessedURLs(prev => [...prev, resultWithName]);
      onURLProcessed(resultWithName);
      setUrl('');
      setName('');
    } catch (error) {
      console.error('Error processing URL:', error);
      let errorMessage = 'Failed to process URL';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to reach the URL. Please check if the URL is correct and accessible.';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'This URL cannot be accessed due to security restrictions.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    url,
    setUrl,
    name,
    setName,
    isProcessing,
    processedURLs,
    error,
    setError,
    handleTestURL,
    handleSubmit,
  };
}
