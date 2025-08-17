'use client';

import { useState } from 'react';
import { FileProcessingResult } from '@/types';
import { Briefing } from '../hooks';
import { useModelSelector } from '../../chat/hooks';
import { BriefingHeader, EmptyBriefingState } from './mainDisplay';
import { BriefingList } from './briefingList';
import { GenerateBriefingModal } from './modal';

interface BriefingTabProps {
  processedContent: FileProcessingResult[];
  briefings: Briefing[];
  onAddBriefing: (briefing: Briefing) => void;
  onDeleteBriefing: (id: string) => void;
  onSwitchToContext: () => void;
}

export function BriefingTab({ 
  processedContent, 
  briefings, 
  onAddBriefing, 
  onDeleteBriefing, 
  onSwitchToContext 
}: BriefingTabProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const { model, showModelSelector, setShowModelSelector, handleModelChange } = useModelSelector();

  const handleGenerateBriefing = async () => {
    // This will be handled by the GenerateBriefingModal
    setShowGenerateModal(true);
  };

  // Show content prompt if no content available
  if (processedContent.length === 0) {
    return <EmptyBriefingState onSwitchToContext={onSwitchToContext} />;
  }

  // Show briefing interface when content is available
  return (
    <div className="mx-auto">
      <BriefingHeader
        onGenerateBriefing={() => setShowGenerateModal(true)}
        isGenerating={isGenerating}
        hasContent={processedContent.length > 0}
        model={model}
        showModelSelector={showModelSelector}
        onToggleModelSelector={() => setShowModelSelector(!showModelSelector)}
        onModelChange={handleModelChange}
      />

      <BriefingList 
        briefings={briefings} 
        onDeleteBriefing={onDeleteBriefing} 
      />

      {/* Generate Briefing Modal */}
      {showGenerateModal && (
        <GenerateBriefingModal
          content={processedContent}
          onClose={() => setShowGenerateModal(false)}
          onAddBriefing={onAddBriefing}
          setIsGenerating={setIsGenerating}
          model={model}
        />
      )}
    </div>
  );
}
