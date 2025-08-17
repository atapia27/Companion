import { FileBarChart } from 'lucide-react';
import { BriefingCard } from './BriefingCard';
import { Briefing } from '../../hooks';

interface BriefingListProps {
  briefings: Briefing[];
  onDeleteBriefing: (id: string) => void;
}

export function BriefingList({ briefings, onDeleteBriefing }: BriefingListProps) {
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
      {briefings.map((briefing) => (
        <BriefingCard
          key={briefing.id}
          briefing={briefing}
          onDelete={onDeleteBriefing}
        />
      ))}
    </div>
  );
}
