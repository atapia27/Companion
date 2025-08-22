'use client';

import { X } from 'lucide-react';
import { Button } from './button';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  iconColor?: string;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  icon, 
  children, 
  footer,
  maxWidth = "max-w-3xl",
  iconColor = "from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500"
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl w-full ${maxWidth} mx-auto max-h-[70vh] shadow-2xl border border-neutralharmony-background-200 flex flex-col`}>
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl p-4 sm:p-8 pb-3 sm:pb-4 border-b border-neutralharmony-background-200 z-10">
          <div className="flex items-center justify-between relative">
            {/* Icon on the left */}
            {icon && (
              <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${iconColor} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                {icon}
              </div>
            )}
            
            {/* Centered title */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <h2 className="text-base sm:text-3xl font-bold text-neutralharmony-primary-900 truncate">
                {title}
              </h2>
            </div>
            
            {/* Close button on the right */}
            <Button
              onClick={onClose}
              variant="close"
              size="sm"
              className="rounded-xl flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 pt-3 sm:pt-4">
          {children}
        </div>

        {/* Footer (optional) */}
        {footer && (
          <div className="sticky bottom-0 bg-white rounded-b-2xl p-4 sm:p-8 pt-3 sm:pt-4 border-t border-neutralharmony-background-200 z-10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
