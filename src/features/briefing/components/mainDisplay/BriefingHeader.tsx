import { FileBarChart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabHeader } from '@/components/ui/TabHeader';
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
    <TabHeader
      title="Generate Summary"
      icon={<FileBarChart className="w-4 h-4 sm:w-5 sm:h-5 text-neutralharmony-background-50" />}
      iconColor="bg-gradient-to-br from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500"
      model={model}
      showModelSelector={showModelSelector}
      onToggleModelSelector={onToggleModelSelector}
      onModelChange={onModelChange}
    >
      {hasContent && (
        <Button
          onClick={onGenerateBriefing}
          disabled={isGenerating}
          className="bg-gradient-to-r from-neutralharmony-tertiary-500 to-neutralharmony-tertiary-600 hover:from-neutralharmony-tertiary-600 hover:to-neutralharmony-tertiary-700 text-neutralharmony-background-50 px-4 py-2 sm:py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 text-white flex-shrink-0" />
          <span className="text-white whitespace-nowrap">{isGenerating ? 'Generating...' : 'Generate Summary'}</span>
        </Button>
      )}
    </TabHeader>
  );
}
