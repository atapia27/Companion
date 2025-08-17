import { FileBarChart } from 'lucide-react';

interface EmptyBriefingStateProps {
  onSwitchToContext: () => void;
}

export function EmptyBriefingState({ onSwitchToContext }: EmptyBriefingStateProps) {
  return (
    <div className="text-center max-w-3xl mx-auto">
             <div className="w-24 h-24 bg-gradient-to-br from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
         <FileBarChart className="w-12 h-12 text-neutralharmony-primary-900" />
       </div>
      <h2 className="text-3xl font-bold text-neutralharmony-primary-900 mb-3">
        Generate Briefings
      </h2>
      <p className="text-neutralharmony-primary-700 text-lg mb-8">
        Create comprehensive reports with key insights, risks, and action items
      </p>
      
             <div className="p-10 bg-gradient-to-br from-neutralharmony-tertiary-50 to-neutralharmony-tertiary-100 border-2 border-neutralharmony-tertiary-300 rounded-2xl shadow-lg">
         <div className="w-16 h-16 bg-neutralharmony-tertiary-200 rounded-full flex items-center justify-center mx-auto mb-6">
           <FileBarChart className="w-8 h-8 text-neutralharmony-tertiary-600" />
         </div>
        <h3 className="text-xl font-bold text-neutralharmony-primary-900 mb-3 text-center">
          No Content Available
        </h3>
        <p className="text-neutralharmony-primary-700 mb-8 text-center text-base">
          Please add some documents or URLs first to generate briefings.
        </p>
        <button
          onClick={onSwitchToContext}
                     className="bg-gradient-to-r from-neutralharmony-tertiary-500 to-neutralharmony-tertiary-600 hover:from-neutralharmony-tertiary-600 hover:to-neutralharmony-tertiary-700 text-neutralharmony-primary-900 px-8 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Add Content
        </button>
      </div>
    </div>
  );
}
