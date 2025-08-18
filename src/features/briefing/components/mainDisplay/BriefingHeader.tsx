import { FileBarChart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModelSelector } from '@/components/ui/ModelSelector';
import { AIModel } from '@/lib/model-config';

interface BriefingHeaderProps {
  onGenerateBriefing: () => void;
  isGenerating: boolean;
  hasContent: boolean;
  model: AIModel;
  showModelSelector: boolean;
  onToggleModelSelector: () => void;
  onModelChange: (model: AIModel) => void;
}

export function BriefingHeader({ 
  onGenerateBriefing, 
  isGenerating, 
  hasContent, 
  model, 
  showModelSelector, 
  onToggleModelSelector, 
  onModelChange 
}: BriefingHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-2xl border-2 border-neutralharmony-background-300 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500 rounded-xl flex items-center justify-center shadow-lg">
          <FileBarChart className="w-5 h-5 text-neutralharmony-background-50" />
        </div>
                 <div>
           <h2 className="text-2xl font-bold text-neutralharmony-primary-900">Generate Summary</h2>
         </div>
      </div>
      <div className="flex items-center space-x-2">
        <ModelSelector
          model={model}
          showModelSelector={showModelSelector}
          onToggleModelSelector={onToggleModelSelector}
          onModelChange={onModelChange}
        />

        {hasContent && (
          <Button
            onClick={onGenerateBriefing}
            disabled={isGenerating}
            className="bg-gradient-to-r from-neutralharmony-tertiary-500 to-neutralharmony-tertiary-600 hover:from-neutralharmony-tertiary-600 hover:to-neutralharmony-tertiary-700 text-neutralharmony-background-50 px-4 py-2 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4 text-white" />
            <span className="text-white">{isGenerating ? 'Generating...' : 'New Summary'}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
