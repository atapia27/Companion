'use client';

import { Settings as SettingsIcon, Brain, Moon, Sun, Monitor } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useState, useEffect } from 'react';
import { useGlobalModel } from '../hooks';
import { AI_MODELS, getModelDisplayName } from '@/lib/model-config';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const { model, handleModelChange } = useGlobalModel();

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme as 'light' | 'dark' | 'system');
    }
  }, []);

  const handleModelChangeLocal = (newModel: string) => {
    handleModelChange(newModel as 'gemini-2.0-flash-exp' | 'gpt-oss-20b' | 'mock-api');
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Settings"
      icon={<SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
      iconColor="from-neutralharmony-primary-400 to-neutralharmony-primary-500"
    >
      <div className="space-y-6 sm:space-y-8">
        {/* AI Model Settings */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-neutralharmony-primary-400 to-neutralharmony-primary-500 rounded-lg flex items-center justify-center">
              <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-neutralharmony-primary-900">AI Model</h3>
          </div>
          <div className="p-4 sm:p-6 bg-white border-2 border-neutralharmony-background-200 rounded-xl">
            <label className="block text-sm font-semibold text-neutralharmony-primary-700 mb-3">
              Default Model
            </label>
            <select
              value={model}
              onChange={(e) => handleModelChangeLocal(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neutralharmony-background-200 rounded-xl bg-white text-neutralharmony-primary-900 focus:outline-none focus:ring-2 focus:ring-neutralharmony-secondary-400 focus:border-neutralharmony-secondary-400 transition-colors appearance-none bg-no-repeat bg-right pr-10 text-sm sm:text-base"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px'
              }}
            >
              {AI_MODELS.map((modelOption) => (
                <option key={modelOption.value} value={modelOption.value} disabled={modelOption.isDisabled}>
                  {modelOption.label} ({modelOption.description})
                </option>
              ))}
            </select>
            <p className="text-xs sm:text-sm text-neutralharmony-primary-600 mt-3 leading-relaxed text-start">
              Currently using <span className="font-semibold">
                {getModelDisplayName(model)}
              </span> as your AI model.
            </p>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-neutralharmony-secondary-400 to-neutralharmony-secondary-500 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-neutralharmony-primary-900">Appearance</h3>
          </div>
          <div className="p-4 sm:p-6 bg-white border-2 border-neutralharmony-background-200 rounded-xl">
            <label className="block text-sm font-semibold text-neutralharmony-primary-700 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                disabled
                className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-xl border-2 bg-gradient-to-r from-neutralharmony-secondary-500 to-neutralharmony-secondary-600 text-white border-neutralharmony-secondary-500 shadow-lg cursor-not-allowed"
              >
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="text-xs sm:text-sm font-semibold text-center">Light</span>
              </button>
              <button
                disabled
                className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-xl border-2 bg-neutralharmony-background-100 border-neutralharmony-background-200 text-neutralharmony-primary-400 cursor-not-allowed opacity-50"
              >
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold text-center">Dark (WIP)</span>
              </button>
              <button
                disabled
                className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-xl border-2 bg-neutralharmony-background-100 border-neutralharmony-background-200 text-neutralharmony-primary-400 cursor-not-allowed opacity-50"
              >
                <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold text-center">System (WIP)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
