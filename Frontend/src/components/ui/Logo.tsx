import { FileText } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizeMap = {
  sm: { icon: 'h-7 w-7', text: 'text-lg', gap: 'gap-2' },
  md: { icon: 'h-9 w-9', text: 'text-xl', gap: 'gap-2.5' },
  lg: { icon: 'h-12 w-12', text: 'text-3xl', gap: 'gap-3' },
};

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const s = sizeMap[size];

  return (
    <div className={`flex items-center ${s.gap}`}>
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 opacity-20 blur-md" />
        <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 shadow-lg shadow-brand-600/30">
          <FileText className={`${s.icon} p-1.5 text-white`} />
        </div>
      </div>
      {showText && (
        <span className={`font-bold tracking-tight ${s.text} text-gray-900 dark:text-white`}>
          Resume<span className="text-gradient dark:text-gradient-dark">Ops</span>
        </span>
      )}
    </div>
  );
}
