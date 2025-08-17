import { Brain, CircleUser } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../hooks';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex gap-3 ${
        message.type === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.type === 'assistant' && (
        <div className="w-10 h-10 bg-gradient-to-br from-neutralharmony-secondary-200 to-neutralharmony-secondary-300 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
          <Brain className="w-5 h-5 text-neutralharmony-secondary-600" />
        </div>
      )}
      <div
        className={`max-w-[80%] p-4 rounded-xl shadow-md ${
          message.type === 'user'
            ? 'bg-gradient-to-r from-neutralharmony-secondary-500 to-neutralharmony-secondary-600 text-neutralharmony-background-50'
            : 'bg-white border-2 border-neutralharmony-background-300 text-neutralharmony-primary-900'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <div className={`flex items-center mt-2 text-xs ${
          message.type === 'user' 
            ? 'justify-end text-neutralharmony-secondary-100' 
            : 'justify-start text-neutralharmony-primary-500'
        }`}>
          <span className="font-medium">{message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
        </div>
      </div>
      {message.type === 'user' && (
        <div className="w-10 h-10 bg-gradient-to-br from-neutralharmony-contrast-200 to-neutralharmony-contrast-300 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
          <CircleUser className="w-5 h-5 text-neutralharmony-contrast-600" />
        </div>
      )}
    </div>
  );
}
