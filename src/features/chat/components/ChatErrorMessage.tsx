import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SwapToMockButton } from './SwapToMockButton';

interface ChatErrorMessageProps {
  error: string;
  onRetry: () => void;
}

export function ChatErrorMessage({ error, onRetry }: ChatErrorMessageProps) {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
        <AlertTriangle className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col max-w-[80%]">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 shadow-md">
          <div>
            <h4 className="text-sm font-semibold text-red-900 mb-1">
              Error occurred
            </h4>
            <p className="text-sm text-red-700 leading-relaxed">
              {error}
            </p>
          </div>
        </div>
        <div className="flex items-center mt-1 text-xs justify-start text-neutralharmony-primary-500">
          <span className="font-medium ml-1">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </Button>
          <SwapToMockButton />
        </div>
             </div>
     </div>
   );
 }
