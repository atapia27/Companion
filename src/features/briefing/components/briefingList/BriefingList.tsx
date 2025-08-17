import { FileBarChart } from 'lucide-react';
import { BriefingCard } from './BriefingCard';
import { BriefingCardSkeleton } from './BriefingCardSkeleton';
import { BriefingCardError } from './BriefingCardError';
import { Briefing } from '../../hooks';

interface BriefingListProps {
  briefings: Briefing[];
  onDeleteBriefing: (id: string) => void;
  isGenerating?: boolean;
  generationError?: string | null;
  onRetryGeneration?: () => void;
}

export function BriefingList({ 
  briefings, 
  onDeleteBriefing, 
  isGenerating = false, 
  generationError = null,
  onRetryGeneration 
}: BriefingListProps) {
  if (briefings.length === 0) {
    return (
      <div className="space-y-4 mb-6 p-6 bg-gradient-to-br from-neutralharmony-background-50 to-neutralharmony-background-100 border-2 border-neutralharmony-background-300 rounded-xl shadow-inner">
        <div className="text-center py-16">
                     <div className="w-20 h-20 bg-gradient-to-br from-neutralharmony-tertiary-200 to-neutralharmony-tertiary-300 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
             <FileBarChart className="w-10 h-10 text-neutralharmony-tertiary-600" />
           </div>
          <h3 className="text-xl font-bold text-neutralharmony-primary-900 mb-3">
            No Briefings Yet
          </h3>
          <p className="text-neutralharmony-primary-600 text-base max-w-md mx-auto leading-relaxed">
            Generate your first briefing to see it appear here. Each briefing will be saved and can be viewed, copied, or downloaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Show skeleton when generating */}
      {isGenerating && <BriefingCardSkeleton />}
      
      {/* Show error state when generation fails */}
      {generationError && !isGenerating && onRetryGeneration && (
        <BriefingCardError 
          error={generationError} 
          onRetry={onRetryGeneration}
        />
      )}
      
      {briefings.map((briefing, index) => {
        // Check if this is the first mock briefing (IDs 1, 2, 3)
        const isMockBriefing = ['1', '2', '3'].includes(briefing.id);
        const isFirstMockBriefing = isMockBriefing && 
          !briefings.slice(0, index).some(b => ['1', '2', '3'].includes(b.id));
        
        return (
          <div key={briefing.id}>
            {/* Add divider before the first mock briefing */}
            {isFirstMockBriefing && (
              <div className="mb-6 p-4 bg-gradient-to-br from-neutralharmony-tertiary-50 to-neutralharmony-tertiary-100 border-2 border-neutralharmony-tertiary-200 rounded-xl">
                <div className="text-center">
                  <p className="text-sm font-semibold text-neutralharmony-tertiary-700">
                    📋 Example Briefings (Demo)
                  </p>
                  <p className="text-xs text-neutralharmony-tertiary-600 mt-1">
                    These are sample briefings to demonstrate the feature
                  </p>
                </div>
              </div>
            )}
            
            <BriefingCard
              briefing={briefing}
              onDelete={onDeleteBriefing}
            />
          </div>
        );
      })}
    </div>
  );
}
