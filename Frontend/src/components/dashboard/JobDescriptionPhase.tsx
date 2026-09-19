import { ClipboardPaste } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface JobDescriptionPhaseProps {
  jobDescription: string;
  onJobDescriptionChange: (text: string) => void;
  onAnalyze: () => void;
  onResumeUploaded: boolean;
  onBackToResume: () => void;
}

export function JobDescriptionPhase({
  jobDescription,
  onJobDescriptionChange,
  onAnalyze,
  onResumeUploaded,
  onBackToResume,
}: JobDescriptionPhaseProps) {
  return (
    <div className="animate-fade-in-up mx-auto max-w-3xl">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Paste the Job Description</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Paste the full job description you want to target your resume towards
        </p>
      </div>

      <div className="relative">
        <textarea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste the job description here...

Example:
We are looking for a Senior Backend Engineer with:
- 3+ years building backend services in production
- Strong Python experience
- Experience with FastAPI or similar frameworks
- REST API design
- PostgreSQL
- Familiarity with Docker
- CI/CD pipelines
- AWS cloud infrastructure"
          rows={14}
          className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-sm leading-relaxed text-gray-900 transition-all placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white font-mono"
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <ClipboardPaste className="h-3.5 w-3.5" />
          {jobDescription.length} chars
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <Button
          variant="primary"
          size="lg"
          onClick={onAnalyze}
          disabled={!jobDescription.trim() || !onResumeUploaded}
        >
          Analyze Resume
        </Button>
        {(!jobDescription.trim() || !onResumeUploaded) && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {!onResumeUploaded
              ? 'Please upload your resume first'
              : 'Please paste a job description to continue'}
          </p>
        )}
        <Button variant="ghost" onClick={onBackToResume}>
          Back to Resume & History
        </Button>
      </div>
    </div>
  );
}
