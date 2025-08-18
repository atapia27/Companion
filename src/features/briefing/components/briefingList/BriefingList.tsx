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
       {(() => {
         let mockBriefingContainer = null;
         let mockBriefings: Briefing[] = [];
         let regularBriefings: Briefing[] = [];
         
         // Separate mock and regular briefings
         briefings.forEach((briefing, index) => {
           const isMockBriefing = ['1', '2', '3'].includes(briefing.id);
           
           if (isMockBriefing) {
             mockBriefings.push(briefing);
           } else {
             regularBriefings.push(briefing);
           }
         });
         
         // Create mock briefing container if we have mock briefings
         if (mockBriefings.length > 0) {
           mockBriefingContainer = (
             <div className="mb-6 p-4 bg-gradient-to-br from-neutralharmony-tertiary-50 to-neutralharmony-tertiary-100 border-2 border-neutralharmony-tertiary-200 rounded-xl">
                             <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-white mb-2">
                  Example Summaries (Demo)
                </h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  These are sample summaries to demonstrate the feature
                </p>
              </div>
               <div className="space-y-3">
                 {mockBriefings.map((briefing) => (
                   <div key={briefing.id} className="mx-4">
                     <BriefingCard
                       briefing={briefing}
                       onDelete={onDeleteBriefing}
                     />
                   </div>
                 ))}
               </div>
             </div>
           );
         }
         
         return (
           <>
             {/* Show skeleton when generating */}
             {isGenerating && <BriefingCardSkeleton />}
             
             {/* Show error state when generation fails */}
             {generationError && !isGenerating && onRetryGeneration && (
               <BriefingCardError 
                 error={generationError} 
                 onRetry={onRetryGeneration}
               />
             )}
             
             {/* Regular briefings - displayed first */}
             {regularBriefings.map((briefing) => (
               <BriefingCard
                 key={briefing.id}
                 briefing={briefing}
                 onDelete={onDeleteBriefing}
               />
             ))}
             
             {/* Mock briefings container - displayed after regular briefings */}
             {mockBriefingContainer}
           </>
         );
       })()}
     </div>
   );
}
