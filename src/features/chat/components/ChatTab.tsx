'use client';

import { FileProcessingResult } from '@/types';
import { useChatMessages, useModelSelector } from '../hooks';
import { ChatHeader } from './ChatHeader';
import { ChatMessagesContainer } from './ChatMessagesContainer';
import { ChatInput } from './ChatInput';
import { EmptyChatState } from './EmptyChatState';

interface ChatTabProps {
  processedContent: FileProcessingResult[];
  onSwitchToContext: () => void;
}

export function ChatTab({ processedContent, onSwitchToContext }: ChatTabProps) {
  const { messages, isLoading, sendMessage, retryMessage, handleShowMockData } = useChatMessages(processedContent);
  const { model, showModelSelector, setShowModelSelector, handleModelChange } = useModelSelector();

  const handleSendMessage = (content: string) => {
    sendMessage(content, model);
  };

  // Show content prompt if no content available
  if (processedContent.length === 0) {
    return <EmptyChatState onSwitchToContext={onSwitchToContext} />;
  }

  // Show chat interface when content is available
  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-250px)] flex flex-col">
      <ChatHeader
        model={model}
        showModelSelector={showModelSelector}
        onToggleModelSelector={() => setShowModelSelector(!showModelSelector)}
        onModelChange={handleModelChange}
      />

      <ChatMessagesContainer 
        messages={messages} 
        isLoading={isLoading} 
        onRetryMessage={retryMessage}
        onShowMockData={handleShowMockData}
      />

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
