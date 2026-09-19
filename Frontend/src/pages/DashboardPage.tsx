import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PipelineStepper, PipelineStep } from '@/components/dashboard/PipelineStepper';
import { UploadPhase } from '@/components/dashboard/UploadPhase';
import { JobDescriptionPhase } from '@/components/dashboard/JobDescriptionPhase';
import { AnalyzingPhase } from '@/components/dashboard/AnalyzingPhase';
import { ResultsPhase } from '@/components/dashboard/ResultsPhase';
import { AnalysisHistoryPanel } from '@/components/dashboard/AnalysisHistoryPanel';
import { Card } from '@/components/ui/Card';
import type { AnalysisResult } from '@/data/types';
import {
  checkCompatibility,
  getAnalysisHistory,
  getResumes,
  uploadResume,
  deleteAnalysis,
  deleteResume,
  type AnalysisHistoryItem,
  type ResumeSummary,
} from '@/api';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardPageProps {
  onNavigate: (page: 'landing' | 'login' | 'register' | 'dashboard') => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { refreshProfile, notify } = useAuth();
  const [currentStep, setCurrentStep] = useState<PipelineStep>(0);
  const [selectedResume, setSelectedResume] = useState<ResumeSummary | null>(null);
  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [resumeFilename, setResumeFilename] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const openHistoryItem = (item: AnalysisHistoryItem) => {
    const storedAnalysis = item.analysis as { analysis?: AnalysisResult['analysis'] };
    setAnalysisResult({
      analysis: storedAnalysis.analysis ?? item.analysis as unknown as AnalysisResult['analysis'],
    });
    setCurrentStep(3);
    setError('');
  };

  useEffect(() => {
    Promise.allSettled([getResumes(), getAnalysisHistory()]).then(([resumeResult, historyResult]) => {
      if (resumeResult.status === 'fulfilled') setResumes(resumeResult.value);
      if (historyResult.status === 'fulfilled') setHistory(historyResult.value);
    });
  }, []);

  const handleResumeUploaded = async (file: File, resumeName: string) => {
    setError('');
    const uploadedResume = await uploadResume(file, resumeName);
    const resume = {
      resume_id: uploadedResume.resume_id,
      file_name: uploadedResume.file_name,
      resume_name: uploadedResume.resume_name,
      url: uploadedResume.url,
      created_at: uploadedResume.created_at,
    };
    setResumes((current) => [resume, ...current.filter((item) => item.resume_id !== resume.resume_id)]);
    setSelectedResume(resume);
    setResumeFilename(uploadedResume.file_name);
    notify(`Resume "${resumeName}" uploaded successfully.`);
    if (uploadedResume.file_name && currentStep === 0) {
      setCurrentStep(1);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedResume) {
      setError('Please select or upload a resume first');
      return;
    }
    setError('');
    setCurrentStep(2);
    try {
      const result = await checkCompatibility(selectedResume.resume_id, jobDescription);
      setAnalysisResult(result);
      notify('Resume analysis completed successfully.');
      setCurrentStep(3);
      try {
        await refreshProfile();
        setHistory(await getAnalysisHistory());
      } catch {
        setError('Analysis completed, but the latest credits or history could not be refreshed.');
      }
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : 'Analysis failed');
      setCurrentStep(1);
    }
  };

  const handleResumeDeleted = async (resume: ResumeSummary) => {
    await deleteResume(resume.resume_id);
    const [latestResumes, latestHistory] = await Promise.all([getResumes(), getAnalysisHistory()]);
    setResumes(latestResumes);
    setHistory(latestHistory);
    if (selectedResume?.resume_id === resume.resume_id) {
      setSelectedResume(null);
      setResumeFilename('');
      setCurrentStep(0);
    }
    notify('Resume deleted successfully.');
  };

  const handleAnalysisDeleted = async (item: AnalysisHistoryItem) => {
    const analysisId = item.analysis_id ?? item.id;
    if (analysisId === undefined) return;
    await deleteAnalysis(analysisId);
    setHistory(await getAnalysisHistory());
    notify('Analysis deleted successfully.');
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedResume(null);
    setResumeFilename('');
    setJobDescription('');
    setAnalysisResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardHeader onNavigate={onNavigate} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Pipeline Stepper */}
        <Card className="mb-8 p-4">
          <PipelineStepper
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step === 0 && currentStep > 0) setCurrentStep(0);
              if (step === 1 && currentStep >= 1) setCurrentStep(1);
              if (step === 3 && analysisResult) setCurrentStep(3);
            }}
          />
        </Card>

        {/* Phase Content */}
        <div className="py-4">
          {currentStep === 0 && (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
              <UploadPhase
                onResumeUploaded={handleResumeUploaded}
                onResumeSelected={(resume) => {
                  setSelectedResume(resume);
                  setResumeFilename(resume.file_name);
                  setCurrentStep(1);
                  setError('');
                }}
                onResumeDeleted={handleResumeDeleted}
                onResumeRemoved={() => {
                  setSelectedResume(null);
                  setResumeFilename('');
                }}
                resumes={resumes}
                uploadedFilename={resumeFilename}
              />
              <AnalysisHistoryPanel history={history} onSelect={openHistoryItem} onDelete={handleAnalysisDeleted} />
            </div>
          )}

          {currentStep === 1 && (
            <JobDescriptionPhase
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
              onAnalyze={handleAnalyze}
              onResumeUploaded={!!selectedResume}
              onBackToResume={() => setCurrentStep(0)}
            />
          )}

          {currentStep === 2 && <AnalyzingPhase />}

          {error && currentStep !== 2 && (
            <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          {currentStep === 3 && analysisResult && (
            <ResultsPhase
              result={analysisResult}
              onBackToJobDescription={() => setCurrentStep(1)}
              onBackToResume={() => setCurrentStep(0)}
              onRestart={handleRestart}
            />
          )}
        </div>
      </div>
    </div>
  );
}
