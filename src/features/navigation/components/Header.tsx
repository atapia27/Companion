'use client';

import { Brain, Info, Folder, Settings } from 'lucide-react';
import { NavTabType } from '../types';

interface HeaderProps {
  activeNavTab: NavTabType | null;
  onNavTabChange: (tab: NavTabType | null) => void;
}

const navTabs = [
  {
    id: 'about' as NavTabType,
    label: 'About',
    icon: Info
  },
  {
    id: 'collections' as NavTabType,
    label: 'Collections',
    icon: Folder
  },
  {
    id: 'settings' as NavTabType,
    label: 'Settings',
    icon: Settings
  }
];

export function Header({ activeNavTab, onNavTabChange }: HeaderProps) {
  return (
    <header className="border-b-2 border-neutralharmony-contrast-400 bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-neutralharmony-tertiary-500 rounded-xl flex items-center justify-center shadow-md">
              <Brain className="w-6 h-6 text-neutralharmony-primary-900" />
            </div>
            <h1 className="text-2xl font-bold text-neutralharmony-primary-900">
              AI Knowledge Companion
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onNavTabChange(activeNavTab === tab.id ? null : tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeNavTab === tab.id
                    ? 'bg-neutralharmony-tertiary-500 text-neutralharmony-primary-900 shadow-md transform scale-105'
                    : 'text-neutralharmony-primary-700 hover:text-neutralharmony-primary-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
