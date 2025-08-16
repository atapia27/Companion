'use client';

import { useState } from 'react';
import { X, Send, Loader2, MessageSquare, Brain } from 'lucide-react';
import { FileProcessingResult } from '@/types';
import { aiService } from '@/lib/ai-service';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { getPreferredAIModel } from '@/lib/utils';

interface ChatInterfaceProps {
  content: FileProcessingResult[];
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatInterface({ content, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    if (content.length === 0) {
      toast({
        title: "No content available",
        description: "Please upload some documents or URLs first.",
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

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

      // Ask question using AI service
      const response = await aiService.askQuestion(
        input.trim(),
        context,
        collectionId,
        getPreferredAIModel()
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error asking question:', error);
      toast({
        title: "Error asking question",
        description: error instanceof Error ? error.message : "Failed to get answer",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-neutralharmony-background-50 dark:bg-neutralharmony-primary-900 rounded-lg p-6 w-full max-w-4xl mx-4 h-[80vh] flex flex-col border border-neutralharmony-background-300 dark:border-neutralharmony-primary-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-neutralharmony-primary-900 dark:text-neutralharmony-background-50">Chat with Your Content</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-neutralharmony-primary-700 dark:text-neutralharmony-background-400 hover:text-neutralharmony-primary-900 dark:hover:text-neutralharmony-background-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-neutralharmony-background-100 dark:bg-neutralharmony-primary-800 rounded-lg">
          {messages.length === 0 ? (
            <div className="text-center text-neutralharmony-primary-700 dark:text-neutralharmony-background-400 py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-neutralharmony-primary-400 dark:text-neutralharmony-primary-600" />
              <p>Start a conversation with your content</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 bg-neutralharmony-primary-100 dark:bg-neutralharmony-primary-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-neutralharmony-primary-600 dark:text-neutralharmony-primary-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-neutralharmony-primary-500 text-neutralharmony-background-50'
                      : 'bg-neutralharmony-background-200 dark:bg-neutralharmony-primary-700 text-neutralharmony-primary-900 dark:text-neutralharmony-background-50'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-neutralharmony-secondary-100 dark:bg-neutralharmony-secondary-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-neutralharmony-secondary-600 dark:text-neutralharmony-secondary-400">
                      U
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-neutralharmony-primary-100 dark:bg-neutralharmony-primary-800 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-neutralharmony-primary-600 dark:text-neutralharmony-primary-400" />
              </div>
              <div className="bg-neutralharmony-background-200 dark:bg-neutralharmony-primary-700 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-neutralharmony-primary-600 dark:text-neutralharmony-primary-400" />
                  <span className="text-sm text-neutralharmony-primary-700 dark:text-neutralharmony-background-400">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your content..."
            className="flex-1 px-3 py-2 border border-neutralharmony-background-300 dark:border-neutralharmony-primary-700 rounded-lg bg-neutralharmony-background-50 dark:bg-neutralharmony-primary-800 text-neutralharmony-primary-900 dark:text-neutralharmony-background-50 placeholder:text-neutralharmony-primary-500 dark:placeholder:text-neutralharmony-background-400 focus:outline-none focus:ring-2 focus:ring-neutralharmony-primary-500 focus:border-transparent"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-neutralharmony-primary-500 hover:bg-neutralharmony-primary-600 text-neutralharmony-background-50 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
