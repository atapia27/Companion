'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileUpload } from '@/features/context-management/components/FileUpload';
import { URLInput } from '@/features/context-management/components/URLInput';
import { BriefingGenerator } from '@/features/briefing/components/BriefingGenerator';
import { ChatInterface } from '@/features/chat/components/ChatInterface';
import { AboutModal } from '@/features/navigation';
import { SettingsModal } from '@/features/navigation';
import { CollectionsModal } from '@/features/context-management/components/CollectionsModal';
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
              onFileUploadClick={() => setShowFileUpload(true)}
              onURLInputClick={() => setShowURLInput(true)}
              onRemoveContent={handleRemoveContent}
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
        <FileUpload
          onFileProcessed={handleFileProcessed}
          onClose={() => setShowFileUpload(false)}
          existingContent={processedContent}
        />
      )}

      {showURLInput && (
        <URLInput
          onURLProcessed={handleURLProcessed}
          onClose={() => setShowURLInput(false)}
          existingContent={processedContent}
        />
      )}

      {showChatInterface && (
        <ChatInterface
          content={processedContent}
          onClose={() => setShowChatInterface(false)}
        />
      )}

      {showBriefingGenerator && (
        <BriefingGenerator
          content={processedContent}
          onClose={() => setShowBriefingGenerator(false)}
        />
      )}

      {/* Navigation Modals */}
      {activeNavTab === 'about' && (
        <AboutModal onClose={() => setActiveNavTab(null)} />
      )}

      {activeNavTab === 'collections' && (
        <CollectionsModal onClose={() => setActiveNavTab(null)} />
      )}

      {activeNavTab === 'settings' && (
        <SettingsModal onClose={() => setActiveNavTab(null)} />
      )}
    </div>
  );
}

