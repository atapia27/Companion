import { useState, useEffect, createContext, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIModel, DEFAULT_MODEL, getModelDisplayName } from '@/lib/model-config';

interface GlobalModelContextType {
  model: AIModel;
  setModel: (model: AIModel) => void;
  showModelSelector: boolean;
  setShowModelSelector: (show: boolean) => void;
  handleModelChange: (newModel: AIModel) => void;
}

const GlobalModelContext = createContext<GlobalModelContextType | undefined>(undefined);

export function GlobalModelProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState<AIModel>(DEFAULT_MODEL);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const { toast } = useToast();

  // Load model preference from localStorage on component mount
  useEffect(() => {
    const savedModel = localStorage.getItem('ai-model-preference');
    if (savedModel && (savedModel === 'gemini-2.0-flash-exp' || savedModel === 'gpt-oss-20b' || savedModel === 'mock-api')) {
      setModel(savedModel as AIModel);
    }
  }, []);

  const handleModelChange = (newModel: AIModel) => {
    setModel(newModel);
    localStorage.setItem('ai-model-preference', newModel);
    setShowModelSelector(false);
    toast({
      title: "Model Updated",
      description: `Switched to ${getModelDisplayName(newModel)}`,
    });
  };

  return (
    <GlobalModelContext.Provider 
      value={{
        model,
        setModel,
        showModelSelector,
        setShowModelSelector,
        handleModelChange,
      }}
    >
      {children}
    </GlobalModelContext.Provider>
  );
}

export function useGlobalModel() {
  const context = useContext(GlobalModelContext);
  if (context === undefined) {
    throw new Error('useGlobalModel must be used within a GlobalModelProvider');
  }
  return context;
}
