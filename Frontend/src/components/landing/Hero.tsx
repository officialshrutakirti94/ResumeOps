import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HeroAnimation } from '@/components/HeroAnimation';
import { useAuth } from '@/contexts/AuthContext';

interface HeroProps {
  onNavigate: (page: 'landing' | 'login' | 'register' | 'dashboard') => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 grid-pattern" />
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-950" />

      <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 lg:px-8 lg:pt-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Content */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-700/50 dark:bg-brand-900/20 dark:text-brand-300">
              <Sparkles className="h-4 w-4" />
              AI-Powered Resume Optimization
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Land more interviews with a{' '}
              <span className="text-gradient dark:text-gradient-dark">perfectly optimized</span>{' '}
              resume
            </h1>

            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
              Upload your LaTeX resume, paste a job description, and let AI analyze and optimize
              it for maximum ATS compatibility. No invented skills — just smarter wording,
              structure, and keyword alignment.
            </p>

            {/* Flow indicator */}
            <div className="mt-8 flex flex-wrap items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              {['Upload Resume', 'Paste JD', 'Analyze', 'Optimize'].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 dark:border-gray-700 dark:bg-gray-900">
                    {step}
                  </span>
                  {i < 3 && <ArrowRight className="h-4 w-4 text-brand-400" />}
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'register')}
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => onNavigate('login')}>
                Login
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent-500" />
                10 free credits on signup
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-brand-500" />
                No credit card required
              </div>
            </div>
          </div>

          {/* Right: Animation */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <HeroAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}
