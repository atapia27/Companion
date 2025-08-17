'use client';

import { X, Brain, Shield, Zap, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AboutModalProps {
  onClose: () => void;
}

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-neutralharmony-background-200">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-neutralharmony-primary-900">About AI Knowledge Companion</h2>
          <Button
            onClick={onClose}
            variant="close"
            size="sm"
            className="rounded-xl"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

                 <div className="space-y-6">
           {/* Introduction */}
           <div className="text-center">
             <div className="w-16 h-16 bg-gradient-to-br from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
               <Brain className="w-8 h-8 text-white" />
             </div>
             <h3 className="text-lg font-bold text-neutralharmony-primary-900 mb-2">
               Your Personal AI Research Assistant
             </h3>
             <p className="text-neutralharmony-primary-600 text-base leading-relaxed max-w-2xl mx-auto">
               AI Knowledge Companion helps you analyze documents, extract insights, and generate comprehensive reports using advanced AI technology.
             </p>
           </div>

           {/* Features */}
           <div className="grid md:grid-cols-2 gap-4">
             <div className="p-4 bg-white border-2 border-neutralharmony-background-200 rounded-xl hover:border-neutralharmony-secondary-300 transition-colors duration-200">
               <div className="flex items-center space-x-3 mb-2">
                 <div className="w-8 h-8 bg-gradient-to-br from-neutralharmony-secondary-400 to-neutralharmony-secondary-500 rounded-lg flex items-center justify-center">
                   <FileText className="w-4 h-4 text-white" />
                 </div>
                 <h4 className="font-bold text-neutralharmony-primary-900 text-base">Document & URL Processing</h4>
               </div>
               <p className="text-neutralharmony-primary-600 text-sm leading-relaxed">
                 Upload PDFs, DOCX files, text documents, and images. Extract content from URLs and web pages.
               </p>
             </div>

             <div className="p-4 bg-white border-2 border-neutralharmony-background-200 rounded-xl hover:border-neutralharmony-secondary-300 transition-colors duration-200">
               <div className="flex items-center space-x-3 mb-2">
                 <div className="w-8 h-8 bg-gradient-to-br from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500 rounded-lg flex items-center justify-center">
                   <Zap className="w-4 h-4 text-white" />
                 </div>
                                 <h4 className="font-bold text-neutralharmony-primary-900 text-base">AI Chat & Analysis</h4>
                </div>
                <p className="text-neutralharmony-primary-600 text-sm leading-relaxed">
                  Chat with your documents in real-time. Ask questions and get intelligent answers with source citations and context.
                </p>
             </div>

             <div className="p-4 bg-white border-2 border-neutralharmony-background-200 rounded-xl hover:border-neutralharmony-secondary-300 transition-colors duration-200">
               <div className="flex items-center space-x-3 mb-2">
                 <div className="w-8 h-8 bg-gradient-to-br from-neutralharmony-primary-400 to-neutralharmony-primary-500 rounded-lg flex items-center justify-center">
                   <Brain className="w-4 h-4 text-white" />
                 </div>
                 <h4 className="font-bold text-neutralharmony-primary-900 text-base">Smart Summaries</h4>
               </div>
               <p className="text-neutralharmony-primary-600 text-sm leading-relaxed">
                 Generate comprehensive reports with key insights, risks, and actionable recommendations.
               </p>
             </div>

             <div className="p-4 bg-white border-2 border-neutralharmony-background-200 rounded-xl hover:border-neutralharmony-secondary-300 transition-colors duration-200">
               <div className="flex items-center space-x-3 mb-2">
                 <div className="w-8 h-8 bg-gradient-to-br from-neutralharmony-contrast-400 to-neutralharmony-contrast-500 rounded-lg flex items-center justify-center">
                   <Shield className="w-4 h-4 text-white" />
                 </div>
                                 <h4 className="font-bold text-neutralharmony-primary-900 text-base">Privacy & Safety</h4>
                </div>
                <p className="text-neutralharmony-primary-600 text-sm leading-relaxed">
                  Client-side processing only. No databases or external servers. Your documents are processed in real-time and never stored, ensuring complete privacy.
                </p>
             </div>
           </div>

           {/* Technology */}
           <div className="p-4 bg-gradient-to-br from-neutralharmony-background-50 to-neutralharmony-background-100 border-2 border-neutralharmony-background-200 rounded-xl">
             <h4 className="font-bold text-neutralharmony-primary-900 text-base mb-2">Technology</h4>
             <p className="text-neutralharmony-primary-600 mb-3 text-sm leading-relaxed">
               Built with modern web technologies and powered by advanced AI models through OpenRouter.
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
      </div>
    </div>
  );
}
