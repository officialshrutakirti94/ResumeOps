import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  Sparkles,
  Lightbulb,
  FileText,
  TrendingUp,
  Check,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CircularProgress } from '@/components/ui/CircularProgress';
import type { AnalysisResult } from '@/data/types';

interface ResultsPhaseProps {
  result: AnalysisResult;
  onOptimize?: () => void;
  onRestart: () => void;
  onBackToJobDescription: () => void;
  onBackToResume: () => void;
}

export function ResultsPhase({ result, onOptimize, onRestart, onBackToJobDescription, onBackToResume }: ResultsPhaseProps) {
  const { analysis } = result;
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const toggleCard = (i: number) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Header with match score */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Match Score Card */}
        <Card className="flex flex-col items-center justify-center p-8 lg:col-span-1">
          <CircularProgress value={analysis.match_score} size={200} />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Based on skills, requirements, and experience alignment
          </p>
        </Card>

        {/* Summary Card */}
        <Card className="p-8 lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30">
              <FileText className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Analysis Summary</h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {analysis.summary}
          </p>

          {/* Quick stats */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-accent-200 bg-accent-50 p-3 text-center dark:border-accent-700/50 dark:bg-accent-900/20">
              <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                {analysis.matched_skills.length}
              </div>
              <div className="text-xs text-accent-700 dark:text-accent-300">Matched Skills</div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center dark:border-amber-700/50 dark:bg-amber-900/20">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {analysis.partial_matches.length}
              </div>
              <div className="text-xs text-amber-700 dark:text-amber-300">Partial Matches</div>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center dark:border-red-700/50 dark:bg-red-900/20">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {analysis.missing_skills.length + analysis.missing_requirements.length}
              </div>
              <div className="text-xs text-red-700 dark:text-red-300">Gaps</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Skills Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Matched Skills */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-accent-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Matched Skills</h3>
            <Badge variant="success" className="ml-auto">{analysis.matched_skills.length}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.matched_skills.map((skill) => (
              <Badge key={skill} variant="success">
                <Check className="h-3 w-3" />
                {skill}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Missing Skills */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Missing Skills</h3>
            <Badge variant="danger" className="ml-auto">{analysis.missing_skills.length}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.missing_skills.length > 0 ? (
              analysis.missing_skills.map((skill) => (
                <Badge key={skill} variant="danger">
                  <X className="h-3 w-3" />
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No missing skills detected!</p>
            )}
          </div>
        </Card>
      </div>

      {/* Partial Matches */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Partial Matches</h3>
          <Badge variant="warning" className="ml-auto">{analysis.partial_matches.length}</Badge>
        </div>
        <div className="space-y-3">
          {analysis.partial_matches.map((match, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleCard(i)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/30">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {match.keyword}
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                    expandedCards.has(i) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedCards.has(i) ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="space-y-3 p-4 pt-0">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Evidence
                    </span>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{match.evidence}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      Suggestion
                    </span>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{match.suggestion}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Requirements */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-accent-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Matched Requirements</h3>
            <Badge variant="success" className="ml-auto">{analysis.matched_requirements.length}</Badge>
          </div>
          <ul className="space-y-2">
            {analysis.matched_requirements.map((req) => (
              <li key={req} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                {req}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Missing Requirements</h3>
            <Badge variant="danger" className="ml-auto">{analysis.missing_requirements.length}</Badge>
          </div>
          <ul className="space-y-2">
            {analysis.missing_requirements.length > 0 ? (
              analysis.missing_requirements.map((req) => (
                <li key={req} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                  {req}
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">All requirements matched!</p>
            )}
          </ul>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30">
            <Lightbulb className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Recommendations</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {analysis.recommendations.map((rec, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                {i + 1}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{rec}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Bar */}
      <div className="sticky bottom-4 z-10">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl shadow-gray-900/10 dark:border-gray-600 dark:bg-gray-800 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Ready to optimize?</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Let the AI agent improve your resume's ATS compatibility
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onBackToResume}>
              Resume & History
            </Button>
            <Button variant="outline" onClick={onBackToJobDescription}>
              Edit JD
            </Button>
            <Button variant="outline" onClick={onRestart}>
              Start Over
            </Button>
            <Button variant="primary" size="lg" onClick={onOptimize} disabled={!onOptimize}>
              <Sparkles className="h-5 w-5" />
              {onOptimize ? 'Optimize Resume with AI Agent' : 'Optimization unavailable'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
