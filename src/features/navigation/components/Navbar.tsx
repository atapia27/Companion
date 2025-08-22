'use client';

import { useState } from 'react';
import { Brain, Info, Folder, Settings, Menu, X } from 'lucide-react';
import { NavTabType } from '../types';

interface NavbarProps {
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

export function Navbar({ activeNavTab, onNavTabChange }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavTabClick = (tab: NavTabType) => {
    onNavTabChange(activeNavTab === tab ? null : tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="border-b-2 border-neutralharmony-contrast-400 bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neutralharmony-tertiary-500 rounded-xl flex items-center justify-center shadow-md">
              <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-neutralharmony-primary-900" />
            </div>
            <h1 className="text-md sm:text-xl md:text-2xl font-bold text-neutralharmony-primary-900 whitespace-nowrap">
              AI Document Companion
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-neutralharmony-primary-700 hover:text-neutralharmony-primary-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2 pt-4">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleNavTabClick(tab.id)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeNavTab === tab.id
                      ? 'bg-neutralharmony-tertiary-500 text-neutralharmony-primary-900 shadow-md'
                      : 'text-neutralharmony-primary-700 hover:text-neutralharmony-primary-900 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
