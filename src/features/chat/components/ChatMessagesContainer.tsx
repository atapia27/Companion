import { MessageSquare, Brain, Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatErrorMessage } from './ChatErrorMessage';
import { ChatMessage as ChatMessageType } from '../hooks';

interface ChatMessagesContainerProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onRetryMessage?: (messageId: string) => void;
}

export function ChatMessagesContainer({ messages, isLoading, onRetryMessage }: ChatMessagesContainerProps) {
  return (
    <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 mb-4 sm:mb-6 p-3 sm:p-6 bg-gradient-to-br from-neutralharmony-background-50 to-neutralharmony-background-100 border-2 border-neutralharmony-background-300 rounded-lg sm:rounded-xl shadow-inner messages-container">
      {messages.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-full text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-neutralharmony-secondary-200 to-neutralharmony-secondary-300 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-neutralharmony-secondary-600" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-neutralharmony-primary-900 mb-2">
            Start Your Conversation
          </h3>
          <p className="text-neutralharmony-primary-600 text-xs sm:text-sm max-w-xs sm:max-w-sm mx-auto leading-relaxed">
            Ask questions about your uploaded documents and URLs. The AI will analyze your content and provide detailed answers.
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4 pb-2 sm:pb-4">
          {messages.map((message) => {
            if (message.type === 'error') {
              return (
                <ChatErrorMessage
                  key={message.id}
                  error={message.content}
                  onRetry={() => onRetryMessage?.(message.id)}
                />
              );
            }
            return <ChatMessage key={message.id} message={message} />;
          })}
        </div>
      )}
      
      {isLoading && (
        <div className="flex gap-2 sm:gap-3 justify-start">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-neutralharmony-secondary-200 to-neutralharmony-secondary-300 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-neutralharmony-secondary-600" />
          </div>
          <div className="bg-white border-2 border-neutralharmony-background-300 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-neutralharmony-secondary-600" />
              <span className="text-xs sm:text-sm font-medium text-neutralharmony-primary-700">
                Thinking...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
