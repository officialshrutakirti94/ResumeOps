import { ChevronRight, FileBarChart, History, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { AnalysisHistoryItem } from '@/api';

interface AnalysisHistoryPanelProps {
  history: AnalysisHistoryItem[];
  onSelect: (item: AnalysisHistoryItem) => void;
  onDelete: (item: AnalysisHistoryItem) => Promise<void>;
}

function getAnalysis(item: AnalysisHistoryItem) {
  const value = item.analysis as { analysis?: Record<string, unknown> } & Record<string, unknown>;
  return (value.analysis ?? value) as {
    match_score?: number;
    summary?: string;
  };
}

export function AnalysisHistoryPanel({ history, onSelect, onDelete }: AnalysisHistoryPanelProps) {
  const getAnalysisId = (item: AnalysisHistoryItem) => item.analysis_id ?? item.id;

  return (
    <Card className="h-fit overflow-hidden p-0">
      <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30">
            <History className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">Analysis history</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Open a previous result</p>
          </div>
          <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {history.length}
          </span>
        </div>
      </div>

      {history.length > 0 ? (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {history.map((item, index) => {
            const analysis = getAnalysis(item);
            return (
              <div
                key={`${item.resume_name}-${item.version}-${index}`}
                className="group flex w-full items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60"
              >
                <button type="button" onClick={() => onSelect(item)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent-50 dark:bg-accent-900/20">
                    <FileBarChart className="h-4 w-4 text-accent-600 dark:text-accent-400" />
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">{item.resume_name}</span>
                    <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">Version {item.version}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    {typeof analysis.match_score === 'number' && (
                      <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{analysis.match_score}%</span>
                    )}
                    <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
                {getAnalysisId(item) !== undefined && (
                  <button
                    type="button"
                    aria-label={`Delete analysis for ${item.resume_name}`}
                    title="Delete analysis"
                    onClick={() => {
                      if (window.confirm(`Delete this analysis for "${item.resume_name}"?`)) void onDelete(item);
                    }}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-6 py-10 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No analyses yet</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Your completed analyses will appear here.</p>
        </div>
      )}
    </Card>
  );
}
