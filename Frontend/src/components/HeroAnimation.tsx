import { Check, FileCode2, Gauge, Lightbulb, Sparkles, Target, WandSparkles } from 'lucide-react';

export function HeroAnimation() {
  return (
    <div className="hero-visual relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden">
      <div className="hero-visual-glow absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/20 blur-3xl" />
      <div className="hero-visual-orbit hero-visual-orbit-one absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-300/20" />
      <div className="hero-visual-orbit hero-visual-orbit-two absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-300/20" />

      <div className="hero-float hero-float-left absolute left-[2%] top-[17%] w-[41%] -rotate-[8deg] rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl shadow-brand-900/10 dark:border-gray-700 dark:bg-gray-900/95 sm:p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400 sm:text-xs">
          <FileCode2 className="h-4 w-4 text-brand-500" />
          Resume input
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-2 w-[72%] rounded-full bg-gray-500 dark:bg-gray-400" />
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-2 w-[84%] rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="mt-4 h-2 w-[48%] rounded-full bg-brand-300/80" />
          <div className="h-2 w-[92%] rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-2 w-[68%] rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="mt-5 flex gap-2">
          <span className="h-5 w-12 rounded-md bg-brand-100 dark:bg-brand-900/50" />
          <span className="h-5 w-16 rounded-md bg-accent-100 dark:bg-accent-900/50" />
        </div>
      </div>

      <div className="hero-float hero-float-right absolute right-[1%] top-[7%] w-[44%] rotate-[7deg] rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl shadow-brand-900/10 dark:border-gray-700 dark:bg-gray-900/95 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400 sm:text-xs">Match score</span>
          <Target className="h-5 w-5 text-brand-500" />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[7px] border-gray-100 dark:border-gray-700">
            <div className="absolute inset-[-7px] rounded-full border-[7px] border-transparent border-t-brand-500 border-r-brand-400" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">86</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Strong match</p>
            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">Ready to optimize</p>
          </div>
        </div>
      </div>

      <div className="hero-float hero-float-bottom absolute bottom-[5%] left-[10%] w-[48%] -rotate-[4deg] rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl shadow-brand-900/10 dark:border-gray-700 dark:bg-gray-900/95 sm:p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400 sm:text-xs">
          <Gauge className="h-4 w-4 text-accent-500" />
          ATS readiness
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-brand-500 to-accent-400" />
        </div>
        <div className="mt-4 flex gap-2">
          <span className="h-6 w-14 rounded-lg bg-brand-100 dark:bg-brand-900/50" />
          <span className="h-6 w-20 rounded-lg bg-amber-100 dark:bg-amber-900/40" />
          <span className="h-6 w-10 rounded-lg bg-accent-100 dark:bg-accent-900/50" />
        </div>
      </div>

      <div className="hero-float hero-float-center absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-[22px] border border-gray-200 bg-white p-5 shadow-2xl shadow-brand-900/15 dark:border-gray-700 dark:bg-gray-900 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/40">
              <WandSparkles className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">AI optimization</h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 sm:text-xs">Resume intelligence</p>
            </div>
          </div>
          <span className="rounded-full bg-accent-50 px-2.5 py-1 text-[10px] font-bold text-accent-700 dark:bg-accent-900/30 dark:text-accent-300">LIVE</span>
        </div>

        <div className="mt-5 space-y-3">
          <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/80 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-100 dark:bg-accent-900/40">
                <Check className="h-4 w-4 text-accent-600 dark:text-accent-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-medium text-gray-700 dark:text-gray-200">Keyword alignment</span>
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400">86%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="h-full w-[86%] rounded-full bg-brand-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/80 sm:p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
              <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-200">Impact potential</p>
              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">High opportunity</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/80 sm:p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40">
              <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-200">No fabrication</p>
              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">Your experience, better told</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-float-left { animation: heroFloatLeft 6s ease-in-out infinite -1.4s; }
        .hero-float-right { animation: heroFloatRight 6s ease-in-out infinite -3.2s; }
        .hero-float-bottom { animation: heroFloatBottom 6s ease-in-out infinite -4.5s; }
        .hero-float-center { animation: heroCenterFloat 7s ease-in-out infinite; }
        .hero-visual-orbit-one { animation: heroOrbit 18s linear infinite; }
        .hero-visual-orbit-two { animation: heroOrbit 12s linear infinite reverse; }
        @keyframes heroFloatLeft {
          0%, 100% { transform: translateY(0) rotate(-8deg); }
          50% { transform: translateY(-10px) rotate(-8deg); }
        }
        @keyframes heroFloatRight {
          0%, 100% { transform: translateY(0) rotate(7deg); }
          50% { transform: translateY(-10px) rotate(7deg); }
        }
        @keyframes heroFloatBottom {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(-10px) rotate(-4deg); }
        }
        @keyframes heroCenterFloat {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-7px); }
        }
        @keyframes heroOrbit {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-float-left, .hero-float-right, .hero-float-bottom, .hero-float-center, .hero-visual-orbit-one, .hero-visual-orbit-two { animation: none; }
        }
      `}</style>
    </div>
  );
}
