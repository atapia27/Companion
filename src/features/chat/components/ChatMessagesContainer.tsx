import { MessageSquare, Brain, Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatMessage as ChatMessageType } from '../hooks';

interface ChatMessagesContainerProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

export function ChatMessagesContainer({ messages, isLoading }: ChatMessagesContainerProps) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 mb-6 p-6 bg-gradient-to-br from-neutralharmony-background-50 to-neutralharmony-background-100 border-2 border-neutralharmony-background-300 rounded-xl shadow-inner messages-container">
      {messages.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-neutralharmony-secondary-200 to-neutralharmony-secondary-300 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <MessageSquare className="w-10 h-10 text-neutralharmony-secondary-600" />
          </div>
          <h3 className="text-xl font-bold text-neutralharmony-primary-900 mb-3">
            Start Your Conversation
          </h3>
          <p className="text-neutralharmony-primary-600 text-base max-w-md mx-auto leading-relaxed">
            Ask questions about your uploaded documents and URLs. The AI will analyze your content and provide detailed answers.
          </p>
        </div>
      ) : (
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      )}
      
      {isLoading && (
        <div className="flex gap-3 justify-start">
          <div className="w-10 h-10 bg-gradient-to-br from-neutralharmony-secondary-200 to-neutralharmony-secondary-300 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Brain className="w-5 h-5 text-neutralharmony-secondary-600" />
          </div>
          <div className="bg-white border-2 border-neutralharmony-background-300 rounded-xl p-4 shadow-md">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin text-neutralharmony-secondary-600" />
              <span className="text-sm font-medium text-neutralharmony-primary-700">
                Thinking...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
