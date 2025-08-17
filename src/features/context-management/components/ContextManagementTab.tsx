'use client';

import { FileProcessingResult } from '@/types';
import { ContextActions } from './ContextActions';
import { ContentDisplay } from './ContentDisplay';

interface ContextManagementTabProps {
  processedContent: FileProcessingResult[];
  onFileUploadClickAction: () => void;
  onURLInputClickAction: () => void;
  onRemoveContentAction: (index: number) => void;
}

export function ContextManagementTab({
  processedContent,
  onFileUploadClickAction,
  onURLInputClickAction,
  onRemoveContentAction
}: ContextManagementTabProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutralharmony-primary-900 mb-3">
          Manage Your Context
        </h2>
        <p className="text-neutralharmony-primary-700 text-lg mb-6">
          Upload documents and add URLs to build your knowledge base for AI analysis
        </p>
      </div>

      {/* Action Buttons */}
      <ContextActions
        onFileUploadClickAction={onFileUploadClickAction}
        onURLInputClickAction={onURLInputClickAction}
      />

      {/* Current Context */}
      <ContentDisplay
        processedContent={processedContent}
        onRemoveContentAction={onRemoveContentAction}
      />
    </div>
  );
}

