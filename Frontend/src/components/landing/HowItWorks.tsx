import { Upload, ClipboardPaste, Search, FileBarChart, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Resume',
    description: 'Upload your existing .tex LaTeX resume file.',
  },
  {
    icon: ClipboardPaste,
    title: 'Paste Job Description',
    description: 'Paste the job description you want to target.',
  },
  {
    icon: Search,
    title: 'Analyze',
    description: 'AI compares your resume against the job requirements.',
  },
  {
    icon: FileBarChart,
    title: 'View Results',
    description: 'See your match score, skills gaps, and recommendations.',
  },
  {
    icon: Sparkles,
    title: 'Optimize with AI',
    description: 'Let the AI agent optimize your resume for ATS compatibility.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-24 dark:from-gray-900/40 dark:to-gray-950">
      {/* Decorative background blobs */}
      <div className="absolute left-0 top-1/4 h-64 w-64 rounded-full bg-brand-500/5 blur-3xl" />
      <div className="absolute right-0 bottom-1/4 h-64 w-64 rounded-full bg-accent-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            From upload to optimized in 5 steps
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            A clear, visual pipeline that takes your resume from raw LaTeX to ATS-ready.
          </p>
        </div>

        <div className="mt-20">
          {/* Desktop: horizontal connected pipeline */}
          <div className="hidden lg:flex items-start justify-between">
            {steps.map((step, i) => (
              <div key={step.title} className="group relative flex flex-col items-center" style={{ flex: '1 1 0' }}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute top-10 left-[55%] right-[-45%] h-[2px] overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-brand-300 to-brand-200 dark:from-brand-700 dark:to-brand-800/50" />
                    <div
                      className="absolute inset-0 h-full w-1/3 bg-gradient-to-r from-transparent via-brand-500/60 to-transparent"
                      style={{ animation: 'flowRight 3s ease-in-out infinite', animationDelay: `${i * 0.4}s` }}
                    />
                  </div>
                )}

                {/* Step circle */}
                <div
                  className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-900/5 transition-all duration-300 group-hover:scale-110 group-hover:border-brand-300 group-hover:shadow-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:group-hover:border-brand-700 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <step.icon className="h-8 w-8 text-brand-600 transition-colors group-hover:text-brand-500 dark:text-brand-400" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-700 text-xs font-bold text-white shadow-md shadow-brand-600/30">
                    {i + 1}
                  </span>
                  {/* Glow ring on hover */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-brand-400/0 transition-all duration-300 group-hover:border-brand-400/40 group-hover:scale-125" />
                </div>

                <h3 className="mt-5 text-sm font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400 max-w-[150px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile: vertical connected pipeline */}
          <div className="lg:hidden relative">
            {/* Vertical line */}
            <div className="absolute left-7 top-4 bottom-4 w-[2px] bg-gradient-to-b from-brand-300 via-brand-200 to-accent-200 dark:from-brand-700 dark:via-brand-800/50 dark:to-accent-800/50" />

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="relative flex items-start gap-5 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900 z-10">
                    <step.icon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-700 text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes flowRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </section>
  );
}
