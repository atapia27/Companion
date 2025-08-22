'use client';

import { FolderOpen, MessageSquare, FileBarChart } from 'lucide-react';
import { TabType } from '../types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  {
    id: 'manage-context' as TabType,
    label: 'Manage Context',
    icon: FolderOpen,
    description: 'Upload documents and add URLs to build your knowledge base'
  },
  {
    id: 'ask-questions' as TabType,
    label: 'Ask Questions',
    icon: MessageSquare,
    description: 'Chat with your content using AI-powered search'
  },
  {
    id: 'generate-briefings' as TabType,
    label: 'Generate Summary',
    icon: FileBarChart,
    description: 'Create comprehensive reports with key insights'
  }
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="w-full flex space-x-1 md:space-x-2 mb-6 md:mb-8 bg-gradient-to-r from-neutralharmony-primary-600 to-neutralharmony-primary-700 rounded-xl p-1 md:p-2 shadow-md border border-neutralharmony-primary-500">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex flex-col md:flex-row items-center justify-center space-y-1 md:space-y-0 md:space-x-2 px-2 md:px-4 py-3 md:py-4 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-neutralharmony-contrast-400 text-white shadow-lg transform scale-105'
              : 'text-white hover:text-neutralharmony-background-100 hover:bg-neutralharmony-primary-500/30'
          }`}
        >
          <tab.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <span className="text-center leading-tight min-h-[2.5rem] md:min-h-0 flex items-center justify-center">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
