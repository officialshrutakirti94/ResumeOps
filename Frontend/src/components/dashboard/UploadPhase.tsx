import { useRef, useState } from 'react';
import { UploadCloud, FileText, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { ResumeSummary } from '@/api';

interface UploadPhaseProps {
  onResumeUploaded: (file: File, resumeName: string) => Promise<void>;
  onResumeRemoved: () => void;
  onResumeSelected: (resume: ResumeSummary) => void;
  onResumeDeleted: (resume: ResumeSummary) => Promise<void>;
  resumes: ResumeSummary[];
  uploadedFilename?: string;
}

export function UploadPhase({
  onResumeUploaded,
  onResumeRemoved,
  onResumeSelected,
  onResumeDeleted,
  resumes,
  uploadedFilename,
}: UploadPhaseProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [filename, setFilename] = useState(uploadedFilename ?? '');
  const [uploading, setUploading] = useState(false);
  const [resumeName, setResumeName] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [deletingResumeId, setDeletingResumeId] = useState<number | null>(null);

  const handleDeleteResume = async (resume: ResumeSummary) => {
    if (!window.confirm(`Delete resume "${resume.resume_name}"?`)) return;
    setDeletingResumeId(resume.resume_id);
    try {
      await onResumeDeleted(resume);
    } finally {
      setDeletingResumeId(null);
    }
  };

  const handleFile = (file: File) => {
    setError('');
    if (!file.name.endsWith('.tex') && !file.name.endsWith('.txt')) {
      setError('Please upload a .tex or .txt file');
      return;
    }
    setPendingFile(file);
    setFilename(file.name);
    setResumeName(file.name.replace(/\.(tex|txt)$/i, ''));
  };

  const handleContinue = async () => {
    if (!pendingFile) return;
    if (!resumeName.trim()) {
      setError('Please give your resume a name before continuing');
      return;
    }

    setError('');
    setUploading(true);
    try {
      await onResumeUploaded(pendingFile, resumeName.trim());
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Resume upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="animate-fade-in-up mx-auto max-w-2xl">
      {resumes.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Your resumes</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {resumes.map((resume) => (
              <div
                key={resume.resume_id}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-brand-400 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <button type="button" onClick={() => onResumeSelected(resume)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <FileText className="h-5 w-5 flex-shrink-0 text-brand-500" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">{resume.resume_name}</span>
                    <span className="block truncate text-xs text-gray-500 dark:text-gray-400">Resume name</span>
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${resume.resume_name}`}
                  title="Delete resume"
                  disabled={deletingResumeId === resume.resume_id}
                  onClick={() => void handleDeleteResume(resume)}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Your LaTeX Resume</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Upload your existing .tex resume file to get started
        </p>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
          dragActive
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 scale-[1.01]'
            : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-brand-600 dark:hover:bg-gray-900/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".tex,.txt"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {filename ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-50 dark:bg-accent-900/30">
              <FileText className="h-8 w-8 text-accent-600 dark:text-accent-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{filename}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFilename('');
                  setError('');
                  setPendingFile(null);
                  setResumeName('');
                  onResumeRemoved();
                }}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-accent-600 dark:text-accent-400">
              {uploading ? 'Uploading resume...' : 'File ready — click to replace'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-900/30 transition-transform ${dragActive ? 'scale-110' : ''}`}>
              <UploadCloud className="h-8 w-8 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                Drop your .tex file here, or click to browse
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Supports .tex and .txt files up to 1MB
              </p>
            </div>
          </div>
        )}
      </div>

      {filename && pendingFile && (
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Resume name</label>
          <input
            value={resumeName}
            onChange={(event) => setResumeName(event.target.value)}
            placeholder="e.g. Backend Engineer Resume"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
      )}

      {error && (
        <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {pendingFile && (
        <div className="mt-6 flex justify-center">
          <Button variant="primary" size="lg" onClick={handleContinue} disabled={uploading}>
            {uploading ? 'Uploading resume...' : 'Next: Add Job Description'}
          </Button>
        </div>
      )}
    </div>
  );
}
