'use client';

import { useState } from 'react';
import { FileBarChart, Loader2 } from 'lucide-react';
import { FileProcessingResult} from '@/types';
import { Briefing } from '../../hooks';
import { aiService } from '@/lib/ai-service';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { ProcessedContentDisplay } from '@/features/context-management/components/ProcessingStatus';
import { useGlobalModel } from '@/features/navigation/hooks';

interface GenerateBriefingModalProps {
  content: FileProcessingResult[];
  onClose: () => void;
  onAddBriefing: (briefing: Briefing) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationError: (error: string | null) => void;
}

export function GenerateBriefingModal({ 
  content, 
  onClose, 
  onAddBriefing, 
  setIsGenerating, 
  setGenerationError
}: GenerateBriefingModalProps) {
  const [isGeneratingLocal, setIsGeneratingLocal] = useState(false);
  const { model } = useGlobalModel();

  const handleGenerate = async () => {
    if (content.length === 0) {
      return;
    }

    setIsGeneratingLocal(true);
    setIsGenerating(true);
    setGenerationError(null);
    
    // Close modal immediately to show skeleton in the main view
    onClose();

    try {
      // Create a mock collection ID for this session
      const collectionId = 'temp-collection-' + Date.now();
      
      // Prepare context from content
      const context = content.map((item, index) => ({
        id: `content-${index}`,
        text: item.text,
        source: {
          documentId: `doc-${index}`,
          documentTitle: item.metadata.customName || item.metadata.filename || item.metadata.summary || `Content ${index + 1}`,
          chunkId: `chunk-${index}`,
        },
        score: 1.0,
      }));

      // Generate briefing using AI service
      const response = await aiService.generateBriefing(
        collectionId,
        [], // No previous exchanges for now
        context,
        model
      );

      const newBriefing: Briefing = {
        id: Date.now().toString(),
        title: model === 'mock-api' ? `Mock Summary` : `Summary`,
        content: response.answer,
        timestamp: new Date(),
        contentCount: content.length,
      };

      onAddBriefing(newBriefing);
      setIsGeneratingLocal(false);
      // The hook will handle setting isGenerating to false after state update
    } catch (error) {
      console.error('Error generating briefing:', error);
      setIsGeneratingLocal(false);
      setIsGenerating(false); // Set to false on error
      
      // Set error message for display in skeleton
      let errorMessage = 'Failed to generate briefing';
      if (error instanceof Error) {
        if (error.message.includes('Rate limit exceeded') || error.message.includes('429')) {
          errorMessage = 'API rate limit reached. Please try again later or use Mock API Model.';
        } else {
          errorMessage = error.message;
        }
      }
      setGenerationError(errorMessage);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Generate Summary"
      icon={<FileBarChart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
      iconColor="from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Content Summary */}
        <div className="p-3 sm:p-4 bg-gradient-to-br from-neutralharmony-background-50 to-neutralharmony-background-100 border-2 border-neutralharmony-background-300 rounded-xl shadow-inner">
          <ProcessedContentDisplay 
            processedItems={content} 
            itemType="mixed" 
          />
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <Button
            onClick={handleGenerate}
            disabled={isGeneratingLocal}
            className="w-full sm:w-auto bg-gradient-to-r from-neutralharmony-tertiary-500 to-neutralharmony-tertiary-600 hover:from-neutralharmony-tertiary-600 hover:to-neutralharmony-tertiary-700 text-neutralharmony-background-50 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isGeneratingLocal ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span className="text-sm sm:text-base">Generating Briefing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <FileBarChart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="text-sm sm:text-base text-white">Generate Summary</span>
              </div>
            )}
          </Button>
          <p className="text-xs text-neutralharmony-primary-600 mt-3 sm:mt-4 mx-auto leading-relaxed max-w-sm">
            AI will analyze your content and create a structured report with key insights, risks, and action items.
          </p>
        </div>

        {/* Divider */}
        <div className="my-4 sm:my-6 border-t-2 border-gray-200"></div>

        {/* Help Text */}
        <div className="p-4 sm:p-6 bg-gradient-to-br from-neutralharmony-tertiary-50 to-neutralharmony-tertiary-100 border-2 border-neutralharmony-tertiary-300 rounded-xl shadow-lg">
          <h4 className="font-semibold text-neutralharmony-primary-900 mb-2 sm:mb-3 text-sm sm:text-base">What's included in the briefing?</h4>
          <ul className="text-xs sm:text-sm text-neutralharmony-primary-700 space-y-1.5 sm:space-y-2 list-none">
            <li className="before:content-['•'] before:text-neutralharmony-primary-700 before:mr-2 before:inline-block">
              Executive summary of key findings
            </li>
            <li className="before:content-['•'] before:text-neutralharmony-primary-700 before:mr-2 before:inline-block">
              Main insights and discoveries
            </li>
            <li className="before:content-['•'] before:text-neutralharmony-primary-700 before:mr-2 before:inline-block">
              Potential risks and concerns
            </li>
            <li className="before:content-['•'] before:text-neutralharmony-primary-700 before:mr-2 before:inline-block">
              Recommended action items
            </li>
            <li className="before:content-['•'] before:text-neutralharmony-primary-700 before:mr-2 before:inline-block">
              Source references and citations
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
