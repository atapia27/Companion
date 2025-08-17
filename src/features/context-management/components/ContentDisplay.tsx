'use client';

import { FileText, Link as LinkIcon, X } from 'lucide-react';
import { FileProcessingResult } from '@/types';
import { getFileTypeIcon } from '../utils';

interface ContentDisplayProps {
  processedContent: FileProcessingResult[];
  onRemoveContentAction: (index: number) => void;
}

export function ContentDisplay({ processedContent, onRemoveContentAction }: ContentDisplayProps) {
  const files = processedContent.filter(content => content.metadata.filename);
  const urls = processedContent.filter(content => !content.metadata.filename);

  return (
    <div className="max-w-6xl mx-auto">
      <h3 className="text-xl font-bold text-neutralharmony-primary-900 mb-6 flex items-center">
        <div className="w-8 h-8 bg-neutralharmony-contrast-500 rounded-lg flex items-center justify-center mr-3">
          <FileText className="w-5 h-5 text-neutralharmony-background-50" />
        </div>
        Current Context ({processedContent.length} items)
      </h3>
      
      {/* Two-column layout for files and URLs */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Files Column */}
        <div>
          <h4 className="text-lg font-semibold text-neutralharmony-primary-900 mb-4 flex items-centero">
            <FileText className="w-5 h-5 mr-2 text-neutralharmony-primary-600" />
            Files ({files.length})
          </h4>
          <div className="p-6 bg-gradient-to-br from-neutralharmony-background-50 to-neutralharmony-background-100 rounded-xl border-2 border-neutralharmony-background-400">
            {files.length === 0 ? (
              <div className="text-center">
                <FileText className="w-8 h-8 text-neutralharmony-primary-400 mx-auto mb-2" />
                <p className="text-neutralharmony-primary-600 text-sm">No files uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {files.map((content, index) => {
                  const originalIndex = processedContent.indexOf(content);
                  return (
                    <div key={originalIndex} className="p-4 bg-white rounded-lg border border-neutralharmony-background-300 hover:border-neutralharmony-primary-400 transition-all duration-200 hover:shadow-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-10 h-10 bg-white border border-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                            {getFileTypeIcon(content.metadata.type || '', content.metadata.filename)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-neutralharmony-primary-900 text-sm mb-1 truncate">
                              {content.metadata.customName || content.metadata.filename || `File ${originalIndex + 1}`}
                            </p>
                            <p className="text-xs text-neutralharmony-primary-600 font-medium">
                              {content.text.length} characters
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveContentAction(originalIndex)}
                          className="ml-3 p-2 text-neutralharmony-contrast-600 hover:text-neutralharmony-contrast-700 hover:bg-neutralharmony-contrast-100 rounded-lg transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* URLs Column */}
        <div>
          <h4 className="text-lg font-semibold text-neutralharmony-primary-900 mb-4 flex items-center">
            <LinkIcon className="w-5 h-5 mr-2 text-neutralharmony-tertiary-600" />
            URLs ({urls.length})
          </h4>
          <div className="p-6 bg-gradient-to-br from-neutralharmony-background-50 to-neutralharmony-background-100 rounded-xl border-2 border-neutralharmony-background-400">
            {urls.length === 0 ? (
              <div className="text-center">
                <LinkIcon className="w-8 h-8 text-neutralharmony-tertiary-400 mx-auto mb-2" />
                <p className="text-neutralharmony-primary-600 text-sm">No URLs added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {urls.map((content, index) => {
                  const originalIndex = processedContent.indexOf(content);
                  return (
                    <div key={originalIndex} className="p-4 bg-white rounded-lg border border-neutralharmony-background-300 hover:border-neutralharmony-primary-400 transition-all duration-200 hover:shadow-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-neutralharmony-primary-900 text-sm mb-1">
                            {content.metadata.customName || content.metadata.summary || `URL ${originalIndex + 1}`}
                          </p>
                          <p className="text-xs text-neutralharmony-primary-600 font-medium">
                            {content.text.length} characters
                          </p>
                        </div>
                        <button
                          onClick={() => onRemoveContentAction(originalIndex)}
                          className="ml-3 p-2 text-neutralharmony-contrast-600 hover:text-neutralharmony-contrast-700 hover:bg-neutralharmony-contrast-100 rounded-lg transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
