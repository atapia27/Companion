'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileUploadModal } from '@/features/context-management/components/FileUploadModal';
import { URLInputModal } from '@/features/context-management/components/URLInputModal';
import { BriefingGeneratorModal } from '@/features/briefing/components/BriefingGeneratorModal';
import { ChatInterfaceModal } from '@/features/chat/components/ChatInterfaceModal';
import { AboutModal } from '@/features/navigation';
import { SettingsModal } from '@/features/navigation';
import { CollectionsManagementModal } from '@/features/navigation/components/CollectionsManagementModal';
import { FileProcessingResult } from '@/types';

// Feature-based imports
import { Header, TabNavigation, TabType, NavTabType } from '@/features/navigation';
import { ContextManagementTab } from '@/features/context-management';
import { ChatTab } from '@/features/chat';
import { BriefingTab } from '@/features/briefing';

export default function AppPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('manage-context');
  const [activeNavTab, setActiveNavTab] = useState<NavTabType | null>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showURLInput, setShowURLInput] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [showBriefingGenerator, setShowBriefingGenerator] = useState(false);
  const [processedContent, setProcessedContent] = useState<FileProcessingResult[]>([]);

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

  const handleStartChat = () => {
    setShowChatInterface(true);
  };

  const handleGenerateBriefing = () => {
    setShowBriefingGenerator(true);
  };

  const handleSwitchToContext = () => {
    setActiveTab('manage-context');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header 
        activeNavTab={activeNavTab}
        onNavTabChange={setActiveNavTab}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
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
              onStartChat={handleStartChat}
              onSwitchToContext={handleSwitchToContext}
            />
          )}

          {/* Generate Briefings Tab */}
          {activeTab === 'generate-briefings' && (
            <BriefingTab
              processedContent={processedContent}
              onGenerateBriefing={handleGenerateBriefing}
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

      {showChatInterface && (
        <ChatInterfaceModal
          content={processedContent}
          onClose={() => setShowChatInterface(false)}
        />
      )}

      {showBriefingGenerator && (
        <BriefingGeneratorModal
          content={processedContent}
          onCloseAction={() => setShowBriefingGenerator(false)}
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

