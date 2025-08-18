'use client';

import { useState, useEffect, useRef } from 'react';
import { FileProcessingResult } from '@/types';
import { Briefing } from '../hooks';
import { useGlobalModel } from '@/features/navigation/hooks';
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
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const { model, showModelSelector, setShowModelSelector, handleModelChange } = useGlobalModel();
  
  // Track when generation starts to detect completion
  const generationStartTimeRef = useRef<number | null>(null);

  // Detect when generation completes and hide skeleton
  useEffect(() => {
    if (isGenerating && !generationStartTimeRef.current) {
      // Generation just started
      generationStartTimeRef.current = Date.now();
    } else if (!isGenerating && generationStartTimeRef.current) {
      // Generation completed, reset the ref
      generationStartTimeRef.current = null;
    }
  }, [isGenerating]);

  // Hide skeleton when new briefing appears and we were generating
  useEffect(() => {
    if (isGenerating && generationStartTimeRef.current && !generationError) {
      // Check if we have a new briefing (not the mock ones)
      const newBriefings = briefings.filter(b => !['1', '2', '3'].includes(b.id));
      if (newBriefings.length > 0) {
        // Find the most recent briefing
        const latestBriefing = newBriefings[0];
        const briefingTime = new Date(latestBriefing.timestamp).getTime();
        
        // If the briefing was created after we started generating, hide skeleton
        if (briefingTime > generationStartTimeRef.current) {
          setTimeout(() => {
            setIsGenerating(false);
          }, 100);
        }
      }
    }
  }, [briefings, isGenerating, generationError]);



  const handleGenerateBriefing = async () => {
    // This will be handled by the GenerateBriefingModal
    setShowGenerateModal(true);
  };

  const handleRetryGeneration = () => {
    setGenerationError(null);
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
        isGenerating={isGenerating}
        generationError={generationError}
        onRetryGeneration={handleRetryGeneration}
      />

      {/* Generate Briefing Modal */}
      {showGenerateModal && (
        <GenerateBriefingModal
          content={processedContent}
          onClose={() => setShowGenerateModal(false)}
          onAddBriefing={onAddBriefing}
          setIsGenerating={setIsGenerating}
          setGenerationError={setGenerationError}
        />
      )}
    </div>
  );
}
