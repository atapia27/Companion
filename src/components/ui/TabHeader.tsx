import React, { ReactNode } from 'react';
import { ModelSelector } from './ModelSelector';
import { AIModel } from '@/lib/model-config';

interface TabHeaderProps {
  title: string;
  icon: ReactNode;
  iconColor: string;
  model: AIModel;
  showModelSelector: boolean;
  onToggleModelSelector: () => void;
  onModelChange: (model: AIModel) => void;
  children?: ReactNode; // For additional buttons like "New Summary"
}

export function TabHeader({
  title,
  icon,
  iconColor,
  model,
  showModelSelector,
  onToggleModelSelector,
  onModelChange,
  children
}: TabHeaderProps) {
  return (
    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border-2 border-neutralharmony-background-300 shadow-lg">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 ${iconColor} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-neutralharmony-primary-900">{title}</h2>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <ModelSelector
            model={model}
            showModelSelector={showModelSelector}
            onToggleModelSelector={onToggleModelSelector}
            onModelChange={onModelChange}
          />
          {children}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-3">
        {/* Header with Icon and Title */}
        <div className="flex items-center space-x-2">
          <div className={`w-6 h-6 ${iconColor} rounded-lg flex items-center justify-center shadow-lg flex-shrink-0`}>
            {React.cloneElement(icon as React.ReactElement, { 
              className: 'w-3 h-3 text-neutralharmony-background-50' 
            })}
          </div>
          <h2 className="text-base font-bold text-neutralharmony-primary-900">{title}</h2>
        </div>

        {/* Buttons Stacked Vertically */}
        <div className="space-y-3">
          <div className="w-full">
            <ModelSelector
              model={model}
              showModelSelector={showModelSelector}
              onToggleModelSelector={onToggleModelSelector}
              onModelChange={onModelChange}
              className="w-full"
            />
          </div>
          {children && (
            <div className="w-full">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
