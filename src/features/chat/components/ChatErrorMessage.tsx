import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatErrorMessageProps {
  error: string;
  onRetry: () => void;
  onShowMockData?: () => void;
}

export function ChatErrorMessage({ error, onRetry, onShowMockData }: ChatErrorMessageProps) {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
        <AlertTriangle className="w-5 h-5 text-white" />
      </div>
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 shadow-md max-w-[80%]">
        <div>
          <h4 className="text-sm font-semibold text-red-900 mb-1">
            Error occurred
          </h4>
          <p className="text-sm text-red-700 leading-relaxed">
            {error}
          </p>
          <div className="flex items-center mt-2 text-xs text-red-600">
            <span className="font-medium">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              onClick={onRetry}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </Button>
            <Button
              onClick={onShowMockData || (() => {})}
              className="bg-gradient-to-r from-neutralharmony-tertiary-500 to-neutralharmony-tertiary-600 hover:from-neutralharmony-tertiary-600 hover:to-neutralharmony-tertiary-700 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-1"
            >
              <span>Show Demo Data</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
