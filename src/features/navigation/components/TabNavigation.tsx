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
    <div className="w-full flex space-x-2 mb-8 bg-gradient-to-r from-neutralharmony-primary-600 to-neutralharmony-primary-700 rounded-xl p-2 shadow-md border border-neutralharmony-primary-500 px-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-neutralharmony-contrast-400 text-white shadow-lg transform scale-105'
              : 'text-white hover:text-neutralharmony-background-100 hover:bg-neutralharmony-primary-500/30'
          }`}
        >
          <tab.icon className="w-5 h-5" />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
