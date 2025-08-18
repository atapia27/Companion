import { MessageSquare } from 'lucide-react';
import { ModelSelector } from '@/components/ui/ModelSelector';
import { AIModel } from '@/lib/model-config';

interface ChatHeaderProps {
  model: AIModel;
  showModelSelector: boolean;
  onToggleModelSelector: () => void;
  onModelChange: (model: AIModel) => void;
}

export function ChatHeader({ 
  model, 
  showModelSelector, 
  onToggleModelSelector, 
  onModelChange 
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-2xl border-2 border-neutralharmony-background-300 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-neutralharmony-secondary-400 to-neutralharmony-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
          <MessageSquare className="w-5 h-5 text-neutralharmony-background-50" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-neutralharmony-primary-900">Chat about your content</h2>
        </div>
      </div>
            <div className="flex items-center space-x-2">
        <ModelSelector
          model={model}
          showModelSelector={showModelSelector}
          onToggleModelSelector={onToggleModelSelector}
          onModelChange={onModelChange}
        />
      </div>
    </div>
  );
}
