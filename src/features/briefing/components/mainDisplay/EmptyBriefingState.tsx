import { FileBarChart } from 'lucide-react';

interface EmptyBriefingStateProps {
  onSwitchToContext: () => void;
}

export function EmptyBriefingState({ onSwitchToContext }: EmptyBriefingStateProps) {
  return (
    <div className="text-center max-w-3xl mx-auto">

      <h2 className="text-xl sm:text-3xl font-bold text-neutralharmony-primary-900 mb-2 sm:mb-3">
        Generate Summary
      </h2>
      <p className="text-neutralharmony-primary-700 text-sm sm:text-lg mb-6 sm:mb-8">
        Create comprehensive reports with key insights, risks, and action items
      </p>
      
      <div className="p-6 sm:p-10 bg-gradient-to-br from-neutralharmony-tertiary-50 to-neutralharmony-tertiary-100 border-2 border-neutralharmony-tertiary-300 rounded-2xl shadow-lg">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutralharmony-tertiary-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <FileBarChart className="w-6 h-6 sm:w-8 sm:h-8 text-neutralharmony-tertiary-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-neutralharmony-primary-900 mb-2 sm:mb-3 text-center">
          No Content Available
        </h3>
        <p className="text-neutralharmony-primary-700 mb-6 sm:mb-8 text-center text-sm sm:text-base">
          Please add some documents or URLs first to generate a summary.
        </p>
        <button
          onClick={onSwitchToContext}
          className="bg-gradient-to-r from-neutralharmony-tertiary-500 to-neutralharmony-tertiary-600 hover:from-neutralharmony-tertiary-600 hover:to-neutralharmony-tertiary-700 text-neutralharmony-primary-900 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Add Content
        </button>
      </div>
    </div>
  );
}
