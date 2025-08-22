import { Brain, CircleUser } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage as ChatMessageType } from '../hooks';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  // Don't render error messages here - they'll be handled by ChatErrorMessage component
  if (message.type === 'error') {
    return null;
  }

  return (
    <div
      className={`flex gap-2 sm:gap-3 ${
        message.type === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.type === 'assistant' && (
        <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
          <Brain className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600" />
        </div>
      )}
      <div className="flex flex-col max-w-[85%] sm:max-w-[80%]">
        <div
          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md ${
            message.type === 'user'
              ? 'bg-gradient-to-r from-neutralharmony-secondary-500 to-neutralharmony-secondary-600'
              : 'bg-white border-2 border-neutralharmony-background-300'
          }`}
        >
          <div className={`text-xs sm:text-sm leading-relaxed prose prose-sm max-w-none ${
            message.type === 'user' ? 'text-white' : 'text-neutralharmony-primary-900'
          }`}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
        <div className={`flex items-center mt-1 text-xs ${
          message.type === 'user' 
            ? 'justify-end text-neutralharmony-primary-500' 
            : 'justify-start text-neutralharmony-primary-500'
        }`}>
          <span className={`font-medium ${
            message.type === 'user' ? 'mr-1' : 'ml-1'
          }`}>{message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
        </div>
      </div>
      {message.type === 'user' && (
        <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-br from-neutralharmony-contrast-200 to-neutralharmony-contrast-300 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
          <CircleUser className="w-3 h-3 sm:w-5 sm:h-5 text-neutralharmony-contrast-600" />
        </div>
      )}
    </div>
  );
}
