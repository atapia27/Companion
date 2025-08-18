import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIModel, AI_MODELS } from '@/lib/model-config';

interface ModelSelectorProps {
  model: AIModel;
  showModelSelector: boolean;
  onToggleModelSelector: () => void;
  onModelChange: (model: AIModel) => void;
  className?: string;
}

export function ModelSelector({ 
  model, 
  showModelSelector, 
  onToggleModelSelector, 
  onModelChange,
  className = ''
}: ModelSelectorProps) {
  const currentModel = AI_MODELS.find(m => m.value === model);
  
  return (
    <div className={`relative model-selector ${className}`}>
      <Button
        onClick={onToggleModelSelector}
        variant="model-selector"
        size="md"
        className="flex items-center space-x-2 px-4 py-2 rounded-xl"
      >
        <Settings className="w-4 h-4" />
        <span className="font-semibold">
          {currentModel?.label || model}
        </span>
      </Button>
      
      {/* Model Selector Dropdown */}
      {showModelSelector && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border-2 border-neutralharmony-background-300 rounded-xl shadow-lg z-10">
          <div className="p-3">
            <h4 className="text-sm font-bold text-neutralharmony-primary-900 mb-2">Select AI Model</h4>
            <div className="space-y-2">
              {AI_MODELS.map((modelOption) => (
                <button
                  key={modelOption.value}
                  onClick={() => onModelChange(modelOption.value)}
                  disabled={modelOption.isDisabled}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                    model === modelOption.value
                      ? 'border-neutralharmony-secondary-400 bg-gradient-to-r from-neutralharmony-secondary-50 to-neutralharmony-secondary-100'
                      : 'border-neutralharmony-background-300 hover:border-neutralharmony-secondary-300 hover:bg-neutralharmony-background-50'
                  } ${modelOption.isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutralharmony-primary-900">{modelOption.label}</p>
                      <p className="text-xs text-neutralharmony-primary-600">{modelOption.description}</p>
                    </div>
                    {model === modelOption.value && (
                      <div className="w-4 h-4 bg-gradient-to-br from-neutralharmony-secondary-400 to-neutralharmony-secondary-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
