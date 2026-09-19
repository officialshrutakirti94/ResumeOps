import { useState } from 'react';
import { Sparkles, Download, Copy, Check, ArrowRight, Wand2, TrendingUp, FileCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CircularProgress } from '@/components/ui/CircularProgress';
import type { OptimizeResult } from '@/data/types';

interface OptimizePhaseProps {
  result: OptimizeResult;
  originalScore: number;
  onRestart: () => void;
}

export function OptimizePhase({ result, originalScore, onRestart }: OptimizePhaseProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.optimized_latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result.optimized_latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized-resume.tex';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Score improvement banner */}
      <Card className="overflow-hidden">
        <div className="flex flex-col items-center gap-6 p-8 lg:flex-row lg:justify-between">
          <div className="flex items-center gap-6">
            <CircularProgress value={result.new_match_score} size={140} label="New Score" />
            <div className="flex flex-col items-center">
              <ArrowRight className="h-8 w-8 text-gray-300 dark:text-gray-600" />
              <div className="mt-2 flex items-center gap-1 rounded-full bg-accent-50 px-3 py-1 text-sm font-bold text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                <TrendingUp className="h-4 w-4" />
                +{result.new_match_score - originalScore} pts
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative flex h-[140px] w-[140px] items-center justify-center">
                <svg width={140} height={140} className="-rotate-90">
                  <circle cx={70} cy={70} r={59} fill="none" strokeWidth={12} className="stroke-gray-200 dark:stroke-gray-700" />
                  <circle
                    cx={70} cy={70} r={59} fill="none" strokeWidth={12}
                    stroke="#9ca3af" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 59}
                    strokeDashoffset={2 * Math.PI * 59 - (originalScore / 100) * 2 * Math.PI * 59}
                    style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold text-gray-400">{originalScore}</span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">Before</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center lg:text-right">
            <div className="flex items-center gap-2 justify-center lg:justify-end">
              <FileCheck className="h-5 w-5 text-accent-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Resume Optimized!</h3>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your match score improved by {result.new_match_score - originalScore} points
            </p>
          </div>
        </div>
      </Card>

      {/* Changes Summary */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30">
            <Wand2 className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">What the AI Agent Changed</h3>
          <Badge variant="info" className="ml-auto">{result.changes_summary.length} changes</Badge>
        </div>
        <div className="space-y-2">
          {result.changes_summary.map((change, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-100 dark:bg-accent-900/40">
                <Check className="h-3.5 w-3.5 text-accent-600 dark:text-accent-400" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{change}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Optimized LaTeX Output */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Optimized LaTeX Resume</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-accent-500" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        <div className="max-h-[500px] overflow-auto bg-gray-50 p-6 dark:bg-gray-900/50">
          <pre className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap">
            {result.optimized_latex}
          </pre>
        </div>
      </Card>

      {/* Trust Note */}
      <div className="flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-700/50 dark:bg-brand-900/20">
        <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600 dark:text-brand-400" />
        <p className="text-sm text-brand-700 dark:text-brand-300">
          <strong>Honest Optimization:</strong> The AI agent only improves wording, keywords, structure,
          and JD alignment. It never invents skills, experience, projects, or qualifications that
          aren't already in your resume.
        </p>
      </div>

      {/* Action */}
      <div className="flex justify-center pb-8">
        <Button variant="primary" size="lg" onClick={onRestart}>
          Optimize Another Resume
        </Button>
      </div>
    </div>
  );
}
