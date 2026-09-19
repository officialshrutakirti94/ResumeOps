interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function CircularProgress({
  value,
  size = 180,
  strokeWidth = 12,
  label = 'Match Score',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (v: number) => {
    if (v >= 80) return { stroke: '#10b981', text: 'text-accent-600 dark:text-accent-400' };
    if (v >= 60) return { stroke: '#3385ff', text: 'text-brand-600 dark:text-brand-400' };
    if (v >= 40) return { stroke: '#f59e0b', text: 'text-amber-600 dark:text-amber-400' };
    return { stroke: '#ef4444', text: 'text-red-600 dark:text-red-400' };
  };

  const color = getColor(value);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke={color.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-5xl font-bold ${color.text}`}>{value}</span>
        <span className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </span>
      </div>
    </div>
  );
}
