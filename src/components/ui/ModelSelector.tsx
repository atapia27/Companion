import { Settings, X } from 'lucide-react';
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
    <>
      <div className={`relative model-selector w-full ${className}`}>
        <Button
          onClick={onToggleModelSelector}
          variant="model-selector"
          size="md"
          className="flex items-center space-x-2 px-4 py-2 rounded-xl w-full"
        >
          <Settings className="w-4 h-4" />
          <span className="font-semibold">
            {currentModel?.label || model}
          </span>
        </Button>
        
        {/* Desktop Dropdown */}
        <div className="hidden md:block">
          {showModelSelector && (
            <div className="absolute z-[9999] mt-2 right-0 w-64 bg-white border-2 border-neutralharmony-background-300 rounded-xl shadow-lg max-h-80 overflow-y-auto">
              <div className="p-3">
                <h4 className="text-xs font-bold text-neutralharmony-primary-900 mb-2">Select AI Model</h4>
                <div className="space-y-1.5">
                  {AI_MODELS.map((modelOption) => (
                    <button
                      key={modelOption.value}
                      onClick={() => onModelChange(modelOption.value)}
                      disabled={modelOption.isDisabled}
                      className={`w-full text-left p-2.5 rounded-lg border-2 transition-all duration-200 ${
                        model === modelOption.value
                          ? 'border-neutralharmony-secondary-400 bg-gradient-to-r from-neutralharmony-secondary-50 to-neutralharmony-secondary-100'
                          : 'border-neutralharmony-background-300 hover:border-neutralharmony-secondary-300 hover:bg-neutralharmony-background-50'
                      } ${modelOption.isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-neutralharmony-primary-900 text-xs">{modelOption.label}</p>
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
      </div>

      {/* Mobile Modal */}
      {showModelSelector && (
        <div className="md:hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-neutralharmony-background-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 border-b border-neutralharmony-background-200">
              <h3 className="text-sm font-bold text-neutralharmony-primary-900">Select AI Model</h3>
              <Button
                onClick={onToggleModelSelector}
                variant="close"
                size="sm"
                className="rounded-xl"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-3 max-h-80 overflow-y-auto">
              <div className="space-y-1.5">
                {AI_MODELS.map((modelOption) => (
                  <button
                    key={modelOption.value}
                    onClick={() => {
                      onModelChange(modelOption.value);
                      onToggleModelSelector();
                    }}
                    disabled={modelOption.isDisabled}
                    className={`w-full text-left p-2.5 rounded-lg border-2 transition-all duration-200 ${
                      model === modelOption.value
                        ? 'border-neutralharmony-secondary-400 bg-gradient-to-r from-neutralharmony-secondary-50 to-neutralharmony-secondary-100'
                        : 'border-neutralharmony-background-300 hover:border-neutralharmony-secondary-300 hover:bg-neutralharmony-background-50'
                    } ${modelOption.isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-neutralharmony-primary-900 text-xs">{modelOption.label}</p>
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
        </div>
      )}
    </>
  );
}
