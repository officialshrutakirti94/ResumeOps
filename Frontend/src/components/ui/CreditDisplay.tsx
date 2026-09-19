import { Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CreditDisplayProps {
  compact?: boolean;
}

export function CreditDisplay({ compact = false }: CreditDisplayProps) {
  const { user } = useAuth();
  const credits = user?.credits ?? 10;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
        <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
        {credits}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm dark:border-amber-700/50 dark:from-amber-900/20 dark:to-yellow-900/20 dark:text-amber-300">
      <Zap className="h-4 w-4 fill-amber-500 text-amber-500" />
      <span>{credits} Credits</span>
    </div>
  );
}
