'use client';

import { Upload, Link as LinkIcon } from 'lucide-react';

interface ContextActionsProps {
  onFileUploadClickAction: () => void;
  onURLInputClickAction: () => void;
}

export function ContextActions({ onFileUploadClickAction, onURLInputClickAction }: ContextActionsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto">
      <button
        onClick={onFileUploadClickAction}
        className="flex items-center space-x-3 sm:space-x-6 p-4 sm:p-8 bg-white rounded-2xl border-2 border-neutralharmony-primary-300 hover:shadow-xl transition-all duration-300 group hover:border-neutralharmony-primary-400 hover:scale-105"
      >
        <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-neutralharmony-primary-400 to-neutralharmony-primary-500 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-neutralharmony-primary-500 group-hover:to-neutralharmony-primary-600 transition-all duration-300 shadow-lg">
          <Upload className="w-6 h-6 sm:w-10 sm:h-10 text-neutralharmony-background-50" />
        </div>
        <div className="text-left">
          <h3 className="text-lg sm:text-2xl font-bold text-neutralharmony-primary-900 mb-1 sm:mb-3">
            Upload Documents
          </h3>
          <p className="text-neutralharmony-primary-700 text-sm sm:text-base">
            PDF, DOCX, TXT, and images
          </p>
        </div>
      </button>

      <button
        onClick={onURLInputClickAction}
        className="flex items-center space-x-3 sm:space-x-6 p-4 sm:p-8 bg-white rounded-2xl border-2 border-neutralharmony-primary-300 hover:shadow-xl transition-all duration-300 group hover:border-neutralharmony-primary-400 hover:scale-105"
      >
        <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-neutralharmony-tertiary-500 group-hover:to-neutralharmony-tertiary-600 transition-all duration-300 shadow-lg">
          <LinkIcon className="w-6 h-6 sm:w-10 sm:h-10 text-neutralharmony-primary-900" />
        </div>
        <div className="text-left">
          <h3 className="text-lg sm:text-2xl font-bold text-neutralharmony-primary-900 mb-1 sm:mb-3">
            Add URLs
          </h3>
          <p className="text-neutralharmony-primary-700 text-sm sm:text-base">
            Extract content from web pages
          </p>
        </div>
      </button>
    </div>
  );
}
