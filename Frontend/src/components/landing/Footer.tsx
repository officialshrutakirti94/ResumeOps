import { Logo } from '@/components/ui/Logo';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Logo />
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <a href="#features" className="transition-colors hover:text-brand-600 dark:hover:text-brand-400">Features</a>
            <a href="#how-it-works" className="transition-colors hover:text-brand-600 dark:hover:text-brand-400">How It Works</a>
            <a href="#pricing" className="transition-colors hover:text-brand-600 dark:hover:text-brand-400">Pricing</a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-400 dark:border-gray-800 dark:text-gray-600">
          © 2026 ResumeOps. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
