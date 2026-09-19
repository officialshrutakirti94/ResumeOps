export function AnalyzingPhase() {
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
