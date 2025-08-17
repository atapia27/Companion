import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-center p-4 bg-white rounded-2xl border-2 border-neutralharmony-background-300 shadow-lg">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question about your content..."
        className="flex-1 h-12 px-4 border-2 border-neutralharmony-background-300 rounded-xl bg-white text-neutralharmony-primary-900 placeholder:text-neutralharmony-primary-500 focus:outline-none transition-all duration-200 shadow-md"
        disabled={isLoading}
      />
      <Button
        type="submit"
        disabled={!input.trim() || isLoading}
        className="h-12 w-12 bg-gradient-to-r from-neutralharmony-secondary-500 to-neutralharmony-secondary-600 hover:from-neutralharmony-secondary-600 hover:to-neutralharmony-secondary-700 text-neutralharmony-background-50 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      >
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
}
