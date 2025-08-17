'use client';

import { Link, X, Loader2, TestTube } from 'lucide-react';
import { FileProcessingResult } from '@/types';
import { Button } from '@/components/ui/button';
import { useURLInput } from '../hooks';
import { sampleURLs } from '../utils';
import { ProcessingStatus, InlineStatusMessage } from './ProcessingStatus';

interface URLInputModalProps {
  onURLProcessedAction: (result: FileProcessingResult) => void;
  onCloseAction: () => void;
  existingContent: FileProcessingResult[];
}

export function URLInputModal({ onURLProcessedAction, onCloseAction, existingContent }: URLInputModalProps) {
  const {
    url,
    setUrl,
    isProcessing,
    processedURLs,
    error,
    setError,
    handleTestURL,
    handleSubmit,
  } = useURLInput({ onURLProcessed: onURLProcessedAction, existingContent });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto border-2 border-neutralharmony-background-300 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500 rounded-xl flex items-center justify-center shadow-lg">
              <Link className="w-5 h-5 text-neutralharmony-primary-900" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutralharmony-primary-900">Add URL</h2>
              <p className="text-neutralharmony-primary-600 text-sm">Extract content from web pages</p>
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

        {/* URL Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-bold text-neutralharmony-primary-900 mb-2">
              URL *
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              required
              className="w-full px-3 py-2 border-2 border-neutralharmony-background-300 rounded-xl bg-white text-neutralharmony-primary-900 placeholder:text-neutralharmony-primary-500 focus:outline-none focus:ring-2 focus:ring-neutralharmony-primary-500 focus:border-neutralharmony-primary-400 transition-all duration-200"
            />
          </div>

          <Button
            type="submit"
            disabled={isProcessing || !url.trim()}
            className="w-full bg-gradient-to-r from-neutralharmony-tertiary-500 to-neutralharmony-tertiary-600 hover:from-neutralharmony-tertiary-600 hover:to-neutralharmony-tertiary-700 text-neutralharmony-primary-900 px-4 py-2 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
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

        {/* Test URLs Section - Compact Grid Layout */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500 rounded-lg flex items-center justify-center">
                <TestTube className="w-3 h-3 text-neutralharmony-primary-900" />
              </div>
              <h3 className="text-base font-bold text-neutralharmony-primary-900">
                Test URLs
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
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {sampleURLs.map((sampleURL: { url: string; name: string; description: string }, index: number) => (
              <button
                key={index}
                onClick={() => handleTestURL(sampleURL)}
                disabled={isProcessing}
                className="flex flex-col items-center space-y-2 p-3 bg-white border-2 border-neutralharmony-background-300 rounded-lg hover:border-neutralharmony-tertiary-400 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500 rounded-lg flex items-center justify-center group-hover:from-neutralharmony-tertiary-500 group-hover:to-neutralharmony-tertiary-600 transition-all duration-300 shadow-sm">
                  <Link className="w-4 h-4 text-neutralharmony-primary-900" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-neutralharmony-primary-900 text-xs truncate w-full">
                    {sampleURL.name}
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
            className="bg-gradient-to-r from-neutralharmony-primary-500 to-neutralharmony-primary-600 hover:from-neutralharmony-primary-600 hover:to-neutralharmony-primary-700 text-neutralharmony-background-50 px-6 py-2 rounded-xl font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
