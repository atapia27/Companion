'use client';

import { useState } from 'react';
import { X, FileBarChart, Loader2 } from 'lucide-react';
import { FileProcessingResult} from '@/types';
import { Briefing } from '../../hooks';
import { aiService } from '@/lib/ai-service';
import { Button } from '@/components/ui/button';
import { ProcessedContentDisplay } from '@/features/context-management/components/ProcessingStatus';

interface GenerateBriefingModalProps {
  content: FileProcessingResult[];
  onClose: () => void;
  onAddBriefing: (briefing: Briefing) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationError: (error: string | null) => void;
  model: string;
}

export function GenerateBriefingModal({ 
  content, 
  onClose, 
  onAddBriefing, 
  setIsGenerating, 
  setGenerationError,
  model 
}: GenerateBriefingModalProps) {
  const [isGeneratingLocal, setIsGeneratingLocal] = useState(false);

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
        model as 'gemini-2.0-flash-exp' | 'gpt-oss-20b'
      );

      const newBriefing: Briefing = {
        id: Date.now().toString(),
        title: `Briefing - ${new Date().toLocaleDateString()}`,
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
          errorMessage = 'API rate limit reached. Please try again later or use mock mode.';
        } else {
          errorMessage = error.message;
        }
      }
      setGenerationError(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 border-2 border-neutralharmony-background-300 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 bg-gradient-to-br from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500 rounded-xl flex items-center justify-center shadow-lg">
               <FileBarChart className="w-5 h-5 text-neutralharmony-background-50" />
             </div>
            <h2 className="text-2xl font-bold text-neutralharmony-primary-900">Generate New Briefing</h2>
          </div>
          <Button
            onClick={onClose}
            variant="close"
            size="sm"
            className="rounded-xl"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content Summary */}
        <div className="mb-6 p-4 bg-gradient-to-br from-neutralharmony-background-50 to-neutralharmony-background-100 border-2 border-neutralharmony-background-300 rounded-xl shadow-inner">
          <ProcessedContentDisplay 
            processedItems={content} 
            itemType="mixed" 
          />
        </div>

        {/* Generate Button */}
        <div className="text-center mb-6">
          <Button
            onClick={handleGenerate}
            disabled={isGeneratingLocal}
                         className="bg-gradient-to-r from-neutralharmony-tertiary-500 to-neutralharmony-tertiary-600 hover:from-neutralharmony-tertiary-600 hover:to-neutralharmony-tertiary-700 text-neutralharmony-background-50 px-8 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isGeneratingLocal ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Briefing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <FileBarChart className="w-5 h-5 text-white" />
                <span className="text-white">Generate Comprehensive Briefing</span>
              </div>
            )}
          </Button>
          <p className="text-xs text-neutralharmony-primary-600 mt-4 mx-auto leading-relaxed">
            AI will analyze your content and create a structured report with key insights, risks, and action items.
          </p>
        </div>

        {/* Divider */}
        <div className="my-6 border-t-2 border-gray-200"></div>

        {/* Help Text */}
                 <div className="p-6 bg-gradient-to-br from-neutralharmony-tertiary-50 to-neutralharmony-tertiary-100 border-2 border-neutralharmony-tertiary-300 rounded-xl shadow-lg">
           <h4 className="font-semibold text-neutralharmony-primary-900 mb-3">What's included in the briefing?</h4>
           <ul className="text-sm text-neutralharmony-primary-700 space-y-2 list-none">
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
    </div>
  );
}
