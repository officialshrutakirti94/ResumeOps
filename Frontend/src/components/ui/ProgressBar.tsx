import { ReactNode } from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: 'brand' | 'accent' | 'amber' | 'red';
  children?: ReactNode;
}

const colorClasses = {
  brand: 'bg-brand-500',
  accent: 'bg-accent-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
};

export function ProgressBar({ value, max = 100, label, color = 'brand', children }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full">
      {(label || children) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label && <span className="font-medium text-gray-600 dark:text-gray-400">{label}</span>}
          {children}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full rounded-full ${colorClasses[color]} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
