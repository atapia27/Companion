'use client';

import { useState } from 'react';
import { Link, X, CheckCircle, Loader2, TestTube } from 'lucide-react';
import { fileProcessor } from '@/lib/file-processor';
import { FileProcessingResult } from '@/types';
import { Button } from '@/components/ui/button';

interface URLInputProps {
  onURLProcessed: (result: FileProcessingResult) => void;
  onClose: () => void;
  existingContent: FileProcessingResult[];
}

export function URLInput({ onURLProcessed, onClose, existingContent }: URLInputProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedURLs, setProcessedURLs] = useState<FileProcessingResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Sample URL for testing
  const sampleURL = {
    url: 'https://react.dev/learn/thinking-in-react',
    name: 'React Thinking Guide',
    description: 'Official React documentation about thinking in React'
  };

  const handleTestURL = async () => {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-neutralharmony-background-50 dark:bg-neutralharmony-primary-900 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto border border-neutralharmony-background-300 dark:border-neutralharmony-primary-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutralharmony-primary-900 dark:text-neutralharmony-background-50">Add URL</h2>
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

        {/* URL Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutralharmony-primary-900 dark:text-neutralharmony-background-50 mb-2">
              Content Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., React Documentation, News Article, etc."
              className="w-full px-3 py-2 border border-neutralharmony-background-300 dark:border-neutralharmony-primary-700 rounded-lg bg-neutralharmony-background-50 dark:bg-neutralharmony-primary-800 text-neutralharmony-primary-900 dark:text-neutralharmony-background-50 placeholder:text-neutralharmony-primary-500 dark:placeholder:text-neutralharmony-background-400 focus:outline-none focus:ring-2 focus:ring-neutralharmony-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-neutralharmony-primary-900 dark:text-neutralharmony-background-50 mb-2">
              URL *
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              required
              className="w-full px-3 py-2 border border-neutralharmony-background-300 dark:border-neutralharmony-primary-700 rounded-lg bg-neutralharmony-background-50 dark:bg-neutralharmony-primary-800 text-neutralharmony-primary-900 dark:text-neutralharmony-background-50 placeholder:text-neutralharmony-primary-500 dark:placeholder:text-neutralharmony-background-400 focus:outline-none focus:ring-2 focus:ring-neutralharmony-primary-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="p-3 bg-neutralharmony-contrast-50 dark:bg-neutralharmony-contrast-900/20 border border-neutralharmony-contrast-200 dark:border-neutralharmony-contrast-800 rounded-lg">
              <p className="text-sm text-neutralharmony-contrast-700 dark:text-neutralharmony-contrast-300">
                {error}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isProcessing || !url.trim()}
            className="w-full bg-neutralharmony-primary-500 hover:bg-neutralharmony-primary-600 text-neutralharmony-background-50 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Link className="w-4 h-4 mr-2" />
                Extract Content
              </>
            )}
          </Button>
        </form>

        {/* Test URL Section */}
        <div className="mt-6">
          <div className="flex items-center space-x-2 mb-4">
            <TestTube className="w-5 h-5 text-neutralharmony-tertiary-600" />
            <h3 className="text-lg font-semibold text-neutralharmony-primary-900 dark:text-neutralharmony-background-50">
              Test URL
            </h3>
          </div>
          <button
            onClick={handleTestURL}
            disabled={isProcessing}
            className="w-full flex items-center space-x-3 p-3 bg-neutralharmony-tertiary-50 dark:bg-neutralharmony-tertiary-900/20 border border-neutralharmony-tertiary-200 dark:border-neutralharmony-tertiary-700 rounded-lg hover:bg-neutralharmony-tertiary-100 dark:hover:bg-neutralharmony-tertiary-900/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Link className="w-5 h-5 text-neutralharmony-tertiary-600 flex-shrink-0" />
            <div className="text-left flex-1 min-w-0">
              <p className="font-medium text-neutralharmony-primary-900 dark:text-neutralharmony-background-50 text-sm truncate">
                {sampleURL.name}
              </p>
              <p className="text-xs text-neutralharmony-primary-600 dark:text-neutralharmony-background-400 truncate">
                {sampleURL.description}
              </p>
            </div>
          </button>
        </div>

        {/* Processed URLs */}
        {processedURLs.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-neutralharmony-primary-900 dark:text-neutralharmony-background-50 mb-3">
              Processed URLs ({processedURLs.length})
            </h3>
            <div className="space-y-2">
              {processedURLs.map((urlResult, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-neutralharmony-background-100 dark:bg-neutralharmony-primary-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Link className="w-5 h-5 text-neutralharmony-tertiary-600 dark:text-neutralharmony-tertiary-400" />
                    <div>
                      <p className="font-medium text-neutralharmony-primary-900 dark:text-neutralharmony-background-50">
                        {urlResult.metadata.customName || urlResult.metadata.summary || `URL ${index + 1}`}
                      </p>
                      <p className="text-sm text-neutralharmony-primary-700 dark:text-neutralharmony-background-400">
                        {urlResult.text.length} characters extracted
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
