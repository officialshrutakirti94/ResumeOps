import { Wand2, FileEdit, AlignLeft, Target, CheckCircle2 } from 'lucide-react';

const steps = [
  { icon: FileEdit, text: 'Reading your LaTeX resume structure...' },
  { icon: AlignLeft, text: 'Realigning keywords with job description...' },
  { icon: Target, text: 'Optimizing ATS compatibility...' },
  { icon: CheckCircle2, text: 'Finalizing optimized resume...' },
];

export function OptimizingPhase() {
  return (
    <div className="animate-fade-in mx-auto max-w-md">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-accent-500/20 to-brand-500/20 blur-2xl animate-pulse-slow" />
          </div>
          <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-accent-500 to-accent-600 shadow-2xl shadow-accent-500/30">
            <Wand2 className="h-12 w-12 text-white animate-bounce-subtle" />
          </div>
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-brand-300 shadow-lg" />
            <div className="absolute bottom-0 right-1/4 h-2 w-2 rounded-full bg-brand-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Agent is Optimizing</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Improving your resume's keywords, wording, and structure for ATS compatibility
        </p>

        <div className="mt-10 w-full space-y-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-3 animate-fade-in-up opacity-60"
              style={{ animationDelay: `${i * 0.9}s` }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                <step.icon className="h-4 w-4 text-accent-500 dark:text-accent-400 animate-pulse" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{step.text}</span>
              <div className="ml-auto flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" style={{ animationDelay: '200ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 w-full">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-500 to-brand-500"
              style={{
                backgroundSize: '1000px 100%',
                animation: 'shimmer 2s linear infinite, progressMove 4s ease-in-out forwards',
              }}
            />
          </div>
          <style>{`
            @keyframes progressMove {
              0% { width: 5%; }
              25% { width: 35%; }
              50% { width: 60%; }
              75% { width: 80%; }
              100% { width: 95%; }
            }
          `}</style>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-lg bg-accent-50 px-4 py-2 text-xs text-accent-700 dark:bg-accent-900/20 dark:text-accent-300">
          <Wand2 className="h-3.5 w-3.5" />
          No skills or experience will be invented — only improved wording and structure
        </div>
      </div>
    </div>
  );
}
