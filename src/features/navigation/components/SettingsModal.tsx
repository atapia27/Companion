'use client';

import { X, Settings as SettingsIcon, Brain, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [model, setModel] = useState('gemini-2.0-flash-exp');
  const { toast } = useToast();

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedModel = localStorage.getItem('ai-model-preference');
    if (savedModel && (savedModel === 'gemini-2.0-flash-exp' || savedModel === 'gpt-oss-20b')) {
      setModel(savedModel);
    }
    
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme as 'light' | 'dark' | 'system');
    }
  }, []);

  const handleSaveSettings = () => {
    // Save model preference
    localStorage.setItem('ai-model-preference', model);
    
    // Save theme preference
    localStorage.setItem('theme-preference', theme);
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been saved successfully.",
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
                     <Button
             onClick={onClose}
             variant="close"
             size="sm"
             className="rounded-lg"
           >
             <X className="w-5 h-5" />
           </Button>
        </div>

        <div className="space-y-6">
          {/* AI Model Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">AI Model</h3>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <label className="block text-sm font-medium text-foreground mb-2">
                Default Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Free) - Default</option>
                <option value="gpt-oss-20b">GPT-OSS-20B (Free)</option>
                <option value="gpt-4" disabled>GPT-4 (Coming Soon)</option>
                <option value="claude" disabled>Claude (Coming Soon)</option>
              </select>
              <p className="text-xs text-muted-foreground mt-2">
                Currently using {model === 'gemini-2.0-flash-exp' ? 'Gemini 2.0 Flash' : 'GPT-OSS-20B'} as your preferred model. You can switch between the two free models.
              </p>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <label className="block text-sm font-medium text-foreground mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
                    theme === 'light'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-input hover:bg-muted'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span className="text-sm">Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-input hover:bg-muted'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span className="text-sm">Dark</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
                    theme === 'system'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-input hover:bg-muted'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span className="text-sm">System</span>
                </button>
              </div>
            </div>
          </div>

          {/* Coming Soon Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Coming Soon</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg opacity-60">
                <h4 className="font-semibold text-foreground mb-2">Collections</h4>
                <p className="text-sm text-muted-foreground">
                  Organize your documents into themed collections for better organization.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg opacity-60">
                <h4 className="font-semibold text-foreground mb-2">Export Options</h4>
                <p className="text-sm text-muted-foreground">
                  Export your briefings and conversations in various formats.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg opacity-60">
                <h4 className="font-semibold text-foreground mb-2">Advanced Models</h4>
                <p className="text-sm text-muted-foreground">
                  Access to GPT-4, Claude, and other premium AI models.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg opacity-60">
                <h4 className="font-semibold text-foreground mb-2">Collaboration</h4>
                <p className="text-sm text-muted-foreground">
                  Share collections and collaborate with team members.
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
