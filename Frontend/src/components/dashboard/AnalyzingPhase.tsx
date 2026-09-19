import { useEffect, useState } from 'react';
import { BriefcaseBusiness, CheckCircle2, FileSearch, Sparkles } from 'lucide-react';

const analysisStages = [
  { label: 'Preparing your analysis', icon: Sparkles },
  { label: 'Parsing your resume', icon: FileSearch },
  { label: 'Reading the job description', icon: BriefcaseBusiness },
  { label: 'Comparing skills and requirements', icon: Sparkles },
  { label: 'Putting the final insights together', icon: CheckCircle2 },
];

export function AnalyzingPhase() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const stageTimer = window.setInterval(() => {
      setStageIndex((current) => (current + 1) % analysisStages.length);
    }, 2600);

    return () => window.clearInterval(stageTimer);
  }, []);

  const currentStage = analysisStages[stageIndex];
  const StageIcon = currentStage.icon;

  return (
    <div className="animate-fade-in mx-auto flex max-w-md flex-col items-center text-center">
      {/* Minimal animated orb */}
      <div className="relative mb-10 flex h-24 w-24 items-center justify-center">
        {/* Outer rotating ring */}
        <svg className="absolute inset-0 h-24 w-24 animate-spin-slow" viewBox="0 0 96 96">
          <circle
            cx="48" cy="48" r="44" fill="none"
            stroke="currentColor" strokeWidth="2" strokeDasharray="8 12" strokeLinecap="round"
            className="text-brand-400 dark:text-brand-500"
          />
        </svg>
        {/* Middle counter-rotating ring */}
        <svg className="absolute inset-2 h-20 w-20 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '2s' }} viewBox="0 0 80 80">
          <circle
            cx="40" cy="40" r="36" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 8" strokeLinecap="round"
            className="text-accent-400 dark:text-accent-500"
          />
        </svg>
        {/* Center pulse */}
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/30">
          <div className="h-5 w-5 rounded-full bg-white animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analyzing your resume</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Comparing your resume against the job description
      </p>

      <div
        key={currentStage.label}
        aria-live="polite"
        className="mt-7 flex min-h-11 items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/70 px-4 py-2.5 text-left shadow-sm animate-fade-in-up dark:border-brand-900/50 dark:bg-brand-900/20"
      >
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm dark:bg-gray-900 dark:text-brand-400">
          <StageIcon className="h-4 w-4 animate-pulse" />
        </span>
        <span className="text-sm font-medium text-brand-800 dark:text-brand-200">{currentStage.label}...</span>
        <span className="ml-auto flex gap-1" aria-hidden="true">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="h-1.5 w-1.5 rounded-full bg-brand-400"
              style={{ animation: 'dotPulse 1.2s ease-in-out infinite', animationDelay: `${dot * 0.18}s` }}
            />
          ))}
        </span>
      </div>

      {/* Minimal progress dots */}
      <div className="mt-10 flex items-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-brand-500"
            style={{
              animation: 'dotPulse 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle progress line */}
      <div className="mt-8 h-0.5 w-48 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
          style={{ animation: 'lineGrow 3.5s ease-in-out forwards' }}
        />
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes lineGrow {
          0% { width: 0%; }
          30% { width: 40%; }
          60% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
