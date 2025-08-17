'use client';

import { Link, X, Loader2, TestTube } from 'lucide-react';
import { FileProcessingResult } from '@/types';
import { Button } from '@/components/ui/button';
import { useURLInput } from '../hooks';
import { sampleURL } from '../utils';
import { ProcessingStatus } from './ProcessingStatus';

interface URLInputModalProps {
  onURLProcessedAction: (result: FileProcessingResult) => void;
  onCloseAction: () => void;
  existingContent: FileProcessingResult[];
}

export function URLInputModal({ onURLProcessedAction, onCloseAction, existingContent }: URLInputModalProps) {
  const {
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
  } = useURLInput({ onURLProcessed: onURLProcessedAction, existingContent });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-neutralharmony-background-50 dark:bg-neutralharmony-primary-900 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto border border-neutralharmony-background-300 dark:border-neutralharmony-primary-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutralharmony-primary-900 dark:text-neutralharmony-background-50">Add URL</h2>
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
            onClick={() => handleTestURL(sampleURL)}
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

        {/* Processing Status */}
        <ProcessingStatus
          error={error}
          progress={null}
          processedItems={processedURLs}
          itemType="url"
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
