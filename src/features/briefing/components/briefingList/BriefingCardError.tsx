import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SwapToMockButton } from '@/features/chat/components/SwapToMockButton';

interface BriefingCardErrorProps {
  error: string;
  onRetry: () => void;
}

export function BriefingCardError({ error, onRetry }: BriefingCardErrorProps) {
  return (
    <div className="bg-white border-2 border-red-300 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b-2 border-red-200 bg-red-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900">Generation Failed</h3>
              <div className="text-sm text-red-700">
                Failed to generate Summary
              </div>
            </div>
          </div>
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </Button>
        </div>
      </div>

      {/* Error Content */}
      <div className="bg-gradient-to-br from-red-50 to-red-100">
        <div className="p-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h4 className="text-lg font-semibold text-red-900 mb-2">
              Briefing Generation Failed
            </h4>
            <p className="text-red-700 text-sm leading-relaxed max-w-md mx-auto">
              {error}
            </p>
            <div className="mt-4 flex gap-3 justify-center">
              <Button
                onClick={onRetry}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Try Again
              </Button>
              <SwapToMockButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
