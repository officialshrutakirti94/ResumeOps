export interface PartialMatch {
  keyword: string;
  status: 'partial' | 'matched' | 'missing';
  evidence: string;
  suggestion: string;
}

export interface AnalysisResult {
  analysis: {
    match_score: number;
    matched_skills: string[];
    missing_skills: string[];
    partial_matches: PartialMatch[];
    matched_requirements: string[];
    missing_requirements: string[];
    recommendations: string[];
    summary: string;
  };
}

export interface OptimizeResult {
  optimized_latex: string;
  changes_summary: string[];
  new_match_score: number;
}