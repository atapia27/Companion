'use client';

import { Brain, Shield, Zap, FileText, Search, Quote } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface AboutModalProps {
  onClose: () => void;
}

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="About"
      icon={<Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
      iconColor="from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Mission Statement */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-neutralharmony-primary-900 mb-2">
            Evidence-Based AI Analysis
          </h3>
          <p className="text-neutralharmony-primary-600 text-xs sm:text-base ">
            Unlike generic AI responses, this analysis is grounded in your specific documents. Every claim, insight, and recommendation includes proper citations to source materials, ensuring transparency and reliability.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-white border-2 border-neutralharmony-background-200 rounded-xl hover:border-neutralharmony-secondary-300 transition-colors duration-200">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-neutralharmony-secondary-400 to-neutralharmony-secondary-500 rounded-lg flex items-center justify-center">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h4 className="font-bold text-neutralharmony-primary-900 text-sm sm:text-base">Document & URL Processing</h4>
            </div>
            <p className="text-neutralharmony-primary-600 text-xs sm:text-sm leading-relaxed">
              Upload PDFs, DOCX files, text documents, and images. Extract content from URLs and web pages for comprehensive analysis.
            </p>
          </div>

          <div className="p-3 sm:p-4 bg-white border-2 border-neutralharmony-background-200 rounded-xl hover:border-neutralharmony-secondary-300 transition-colors duration-200">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500 rounded-lg flex items-center justify-center">
                <Search className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h4 className="font-bold text-neutralharmony-primary-900 text-sm sm:text-base">Cited AI Chat</h4>
            </div>
            <p className="text-neutralharmony-primary-600 text-xs sm:text-sm leading-relaxed">
              Chat with your documents and receive answers with specific citations. Every response references exact sources from your uploaded content.
            </p>
          </div>

          <div className="p-3 sm:p-4 bg-white border-2 border-neutralharmony-background-200 rounded-xl hover:border-neutralharmony-secondary-300 transition-colors duration-200">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-neutralharmony-primary-400 to-neutralharmony-primary-500 rounded-lg flex items-center justify-center">
                <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h4 className="font-bold text-neutralharmony-primary-900 text-sm sm:text-base">Evidence-Based Reports</h4>
            </div>
            <p className="text-neutralharmony-primary-600 text-xs sm:text-sm leading-relaxed">
              Generate comprehensive reports with key insights, risks, and recommendations—all backed by specific citations from your documents.
            </p>
          </div>

          <div className="p-3 sm:p-4 bg-white border-2 border-neutralharmony-background-200 rounded-xl hover:border-neutralharmony-secondary-300 transition-colors duration-200">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-neutralharmony-contrast-400 to-neutralharmony-contrast-500 rounded-lg flex items-center justify-center">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h4 className="font-bold text-neutralharmony-primary-900 text-sm sm:text-base">Privacy & Safety</h4>
            </div>
            <p className="text-neutralharmony-primary-600 text-xs sm:text-sm leading-relaxed">
              Client-side processing only. No databases or external servers. Your documents are processed in real-time and never stored, ensuring complete privacy.
            </p>
          </div>
        </div>

        {/* Technology */}
        <div className="p-3 sm:p-4 bg-gradient-to-br from-neutralharmony-background-50 to-neutralharmony-background-100 border-2 border-neutralharmony-background-200 rounded-xl">
          <h4 className="font-bold text-neutralharmony-primary-900 text-sm sm:text-base mb-2">Technology</h4>
          <p className="text-neutralharmony-primary-600 mb-3 text-xs sm:text-sm leading-relaxed">
            Built with modern web technologies and powered by advanced AI models through OpenRouter for evidence-based analysis.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-white border-2 border-neutralharmony-background-200 rounded-lg text-xs font-semibold text-neutralharmony-primary-700 shadow-sm">Next.js</span>
            <span className="px-2 py-1 bg-white border-2 border-neutralharmony-background-200 rounded-lg text-xs font-semibold text-neutralharmony-primary-700 shadow-sm">React</span>
            <span className="px-2 py-1 bg-white border-2 border-neutralharmony-background-200 rounded-lg text-xs font-semibold text-neutralharmony-primary-700 shadow-sm">TypeScript</span>
            <span className="px-2 py-1 bg-white border-2 border-neutralharmony-background-200 rounded-lg text-xs font-semibold text-neutralharmony-primary-700 shadow-sm">Tailwind CSS</span>
            <span className="px-2 py-1 bg-white border-2 border-neutralharmony-background-200 rounded-lg text-xs font-semibold text-neutralharmony-primary-700 shadow-sm">OpenRouter AI</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
