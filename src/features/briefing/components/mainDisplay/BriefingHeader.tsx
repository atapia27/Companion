import { FileBarChart, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BriefingHeaderProps {
  onGenerateBriefing: () => void;
  isGenerating: boolean;
  hasContent: boolean;
  model: string;
  showModelSelector: boolean;
  onToggleModelSelector: () => void;
  onModelChange: (model: string) => void;
}

export function BriefingHeader({ 
  onGenerateBriefing, 
  isGenerating, 
  hasContent, 
  model, 
  showModelSelector, 
  onToggleModelSelector, 
  onModelChange 
}: BriefingHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-2xl border-2 border-neutralharmony-background-300 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500 rounded-xl flex items-center justify-center shadow-lg">
          <FileBarChart className="w-5 h-5 text-neutralharmony-background-50" />
        </div>
                 <div>
           <h2 className="text-2xl font-bold text-neutralharmony-primary-900">Generate Summary</h2>
         </div>
      </div>
      <div className="flex items-center space-x-2">
        {/* AI Model Selector */}
        <div className="relative model-selector">
          <Button
            onClick={onToggleModelSelector}
            variant="model-selector"
            size="md"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl"
          >
            <Settings className="w-4 h-4" />
            <span className="font-semibold">
              {model === 'gemini-2.0-flash-exp' ? 'Gemini' : 'GPT-OSS'}
            </span>
          </Button>
          
          {/* Model Selector Dropdown */}
          {showModelSelector && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border-2 border-neutralharmony-background-300 rounded-xl shadow-lg z-10">
              <div className="p-3">
                <h4 className="text-sm font-bold text-neutralharmony-primary-900 mb-2">Select AI Model</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => onModelChange('gemini-2.0-flash-exp')}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                      model === 'gemini-2.0-flash-exp'
                        ? 'border-neutralharmony-secondary-400 bg-gradient-to-r from-neutralharmony-secondary-50 to-neutralharmony-secondary-100'
                        : 'border-neutralharmony-background-300 hover:border-neutralharmony-secondary-300 hover:bg-neutralharmony-background-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-neutralharmony-primary-900">Gemini 2.0 Flash</p>
                        <p className="text-xs text-neutralharmony-primary-600">Free - Default</p>
                      </div>
                      {model === 'gemini-2.0-flash-exp' && (
                        <div className="w-4 h-4 bg-gradient-to-br from-neutralharmony-secondary-400 to-neutralharmony-secondary-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                  
                  <button
                    onClick={() => onModelChange('gpt-oss-20b')}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                      model === 'gpt-oss-20b'
                        ? 'border-neutralharmony-secondary-400 bg-gradient-to-r from-neutralharmony-secondary-50 to-neutralharmony-secondary-100'
                        : 'border-neutralharmony-background-300 hover:border-neutralharmony-secondary-300 hover:bg-neutralharmony-background-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-neutralharmony-primary-900">GPT-OSS-20B</p>
                        <p className="text-xs text-neutralharmony-primary-600">Free</p>
                      </div>
                      {model === 'gpt-oss-20b' && (
                        <div className="w-4 h-4 bg-gradient-to-br from-neutralharmony-secondary-400 to-neutralharmony-secondary-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {hasContent && (
          <Button
            onClick={onGenerateBriefing}
            disabled={isGenerating}
            className="bg-gradient-to-r from-neutralharmony-tertiary-500 to-neutralharmony-tertiary-600 hover:from-neutralharmony-tertiary-600 hover:to-neutralharmony-tertiary-700 text-neutralharmony-background-50 px-4 py-2 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4 text-white" />
            <span className="text-white">{isGenerating ? 'Generating...' : 'New Summary'}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
