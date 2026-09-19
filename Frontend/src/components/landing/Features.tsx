import { Upload, FileSearch, BarChart3, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: Upload,
    title: 'LaTeX Resume Upload',
    description: 'Upload your existing .tex resume directly. We preserve your LaTeX structure while optimizing content.',
  },
  {
    icon: FileSearch,
    title: 'Deep JD Analysis',
    description: 'Our AI parses the job description to extract skills, requirements, and qualifications that matter.',
  },
  {
    icon: BarChart3,
    title: 'Match Score & Insights',
    description: 'Get a detailed match score with matched, missing, and partial skills — plus actionable recommendations.',
  },
  {
    icon: Sparkles,
    title: 'AI Optimization Agent',
    description: 'The agent rewrites your resume for better ATS alignment without ever inventing skills or experience.',
  },
  {
    icon: ShieldCheck,
    title: 'Honest Optimization',
    description: 'We never fabricate skills, experience, or achievements. Only better wording, keywords, and structure.',
  },
  {
    icon: Zap,
    title: 'Credit-Based System',
    description: 'Start with 10 free credits. Each analysis and optimization uses credits — no subscription required.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Everything you need to beat the ATS
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Powerful AI tools that analyze and optimize your resume for every job application.
        </p>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <Card
            key={feature.title}
            hover
            className="animate-fade-in-up p-6"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/10 to-accent-500/10">
              <feature.icon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
