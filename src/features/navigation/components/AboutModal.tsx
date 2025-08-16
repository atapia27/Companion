'use client';

import { X, Brain, Shield, Zap, FileText } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">About AI Knowledge Companion</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Your Personal AI Research Assistant
            </h3>
            <p className="text-muted-foreground">
              AI Knowledge Companion helps you analyze documents, extract insights, and generate comprehensive reports using advanced AI technology.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">Document Processing</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload PDFs, DOCX files, text documents, and images. Extract content from URLs and web pages.
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">AI Analysis</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Ask questions about your content and get intelligent answers with source citations.
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Brain className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">Smart Briefings</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Generate comprehensive reports with key insights, risks, and actionable recommendations.
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">Privacy First</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Your data stays local. No content is stored on external servers for maximum privacy.
              </p>
            </div>
          </div>

          {/* Technology */}
          <div className="p-4 bg-primary/5 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">Technology</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Built with modern web technologies and powered by advanced AI models through OpenRouter.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-background rounded text-xs font-medium">Next.js</span>
              <span className="px-2 py-1 bg-background rounded text-xs font-medium">React</span>
              <span className="px-2 py-1 bg-background rounded text-xs font-medium">TypeScript</span>
              <span className="px-2 py-1 bg-background rounded text-xs font-medium">Tailwind CSS</span>
              <span className="px-2 py-1 bg-background rounded text-xs font-medium">OpenRouter AI</span>
            </div>
          </div>

          {/* Version */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Version 1.0.0</p>
            <p>© 2024 AI Knowledge Companion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
