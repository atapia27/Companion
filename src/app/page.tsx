'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileUploadModal } from '@/features/context-management/components/FileUploadModal';
import { URLInputModal } from '@/features/context-management/components/URLInputModal';

import { AboutModal } from '@/features/navigation';
import { SettingsModal } from '@/features/navigation';
import { CollectionsManagementModal } from '@/features/navigation/components/CollectionsManagementModal';
import { FileProcessingResult } from '@/types';
import { useBriefing, Briefing } from '@/features/briefing/hooks';

// Feature-based imports
import { Navbar, TabNavigation, TabType, NavTabType } from '@/features/navigation';
import { ContextManagementTab } from '@/features/context-management';
import { ChatTab } from '@/features/chat';
import { BriefingTab } from '@/features/briefing';

export default function AppPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('manage-context');
  const [activeNavTab, setActiveNavTab] = useState<NavTabType | null>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showURLInput, setShowURLInput] = useState(false);
  const [processedContent, setProcessedContent] = useState<FileProcessingResult[]>([]);
  const { briefings, isGenerating, generateBriefing, deleteBriefing } = useBriefing(processedContent);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleFileProcessed = (result: FileProcessingResult) => {
    setProcessedContent(prev => [...prev, result]);
  };

  const handleURLProcessed = (result: FileProcessingResult) => {
    setProcessedContent(prev => [...prev, result]);
  };

  const handleRemoveContent = (index: number) => {
    setProcessedContent(prev => prev.filter((_, i) => i !== index));
  };


  const handleSwitchToContext = () => {
    setActiveTab('manage-context');
  };



  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar 
        activeNavTab={activeNavTab}
        onNavTabChange={setActiveNavTab}
      />

      {/* Main Content */}
      <div className="w-full py-8 px-4 md:px-8 lg:px-16 xl:px-72">
          {/* Tab Navigation */}
          <TabNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
          {/* Manage Context Tab */}
          {activeTab === 'manage-context' && (
            <ContextManagementTab
              processedContent={processedContent}
              onFileUploadClickAction={() => setShowFileUpload(true)}
              onURLInputClickAction={() => setShowURLInput(true)}
              onRemoveContentAction={handleRemoveContent}
            />
          )}

          {/* Ask Questions Tab */}
          {activeTab === 'ask-questions' && (
            <ChatTab
              processedContent={processedContent}
              onSwitchToContext={handleSwitchToContext}
            />
          )}

          {/* Generate Briefings Tab */}
          {activeTab === 'generate-briefings' && (
            <BriefingTab
              processedContent={processedContent}
              briefings={briefings}
              onAddBriefing={generateBriefing}
              onDeleteBriefing={deleteBriefing}
              onSwitchToContext={handleSwitchToContext}
            />
          )}
        </motion.div>
      </div>

      {/* Modals */}
      {showFileUpload && (
        <FileUploadModal
          onFileProcessedAction={handleFileProcessed}
          onCloseAction={() => setShowFileUpload(false)}
          existingContent={processedContent}
        />
      )}

      {showURLInput && (
        <URLInputModal
          onURLProcessedAction={handleURLProcessed}
          onCloseAction={() => setShowURLInput(false)}
          existingContent={processedContent}
        />
      )}
      {/* Navigation Modals */}
      {activeNavTab === 'about' && (
        <AboutModal onClose={() => setActiveNavTab(null)} />
      )}

      {activeNavTab === 'collections' && (
        <CollectionsManagementModal onCloseAction={() => setActiveNavTab(null)} />
      )}

      {activeNavTab === 'settings' && (
        <SettingsModal onClose={() => setActiveNavTab(null)} />
      )}


    </div>
  );
}

