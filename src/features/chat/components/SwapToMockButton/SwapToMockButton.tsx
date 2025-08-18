import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGlobalModel } from '@/features/navigation/hooks/useGlobalModel';

interface SwapToMockButtonProps {
  className?: string;
}

export function SwapToMockButton({ className }: SwapToMockButtonProps) {
  const { handleModelChange } = useGlobalModel();

  return (
    <Button
      onClick={() => handleModelChange('mock-api')}
      className={`bg-gradient-to-r from-neutralharmony-tertiary-500 to-neutralharmony-tertiary-600 hover:from-neutralharmony-tertiary-600 hover:to-neutralharmony-tertiary-700 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-1 ${className || ''}`}
    >
      <Zap className="w-3 h-3" />
      <span>Swap to Mock API</span>
    </Button>
  );
}
