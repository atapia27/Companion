import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useModelSelector() {
  const [model, setModel] = useState('gemini-2.0-flash-exp');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const { toast } = useToast();

  // Load model preference from localStorage on component mount
  useEffect(() => {
    const savedModel = localStorage.getItem('ai-model-preference');
    if (savedModel && (savedModel === 'gemini-2.0-flash-exp' || savedModel === 'gpt-oss-20b')) {
      setModel(savedModel);
    }
  }, []);

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    localStorage.setItem('ai-model-preference', newModel);
    setShowModelSelector(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showModelSelector && !target.closest('.model-selector')) {
        setShowModelSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModelSelector]);

  return {
    model,
    showModelSelector,
    setShowModelSelector,
    handleModelChange,
  };
}
