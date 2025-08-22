import { MessageSquare } from 'lucide-react';
import { TabHeader } from '@/components/ui/TabHeader';
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
    <TabHeader
      title="Chat with AI"
      icon={<MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-neutralharmony-background-50" />}
      iconColor="bg-gradient-to-br from-neutralharmony-secondary-400 to-neutralharmony-secondary-500"
      model={model}
      showModelSelector={showModelSelector}
      onToggleModelSelector={onToggleModelSelector}
      onModelChange={onModelChange}
    />
  );
}
