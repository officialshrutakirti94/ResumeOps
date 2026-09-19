import type { AnalysisResult } from '@/data/types';

// Vite proxies these paths to the backend during local development.
const API_BASE_URL = '';

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
  credits: number;
}

export interface LoginResponse extends ApiUser {
  token: string;
}

export interface ResumeUploadResponse {
  created_at: string;
  file_name: string;
  resume_id: number;
  url: string;
  user_name: string;
  resume_name: string;
}

export interface ResumeSummary {
  resume_id: number;
  file_name: string;
  resume_name: string;
  url: string;
  created_at: string;
}

export interface AnalysisHistoryItem {
  analysis_id?: number;
  id?: number;
  userName: string;
  resume_name: string;
  version: string;
  analysis: Record<string, unknown>;
}

export interface ApiErrorDetails {
  status?: number;
  message: string;
}

type RequestOptions = RequestInit & {
  emptyOnNotFound?: boolean;
};

function publishApiError(details: ApiErrorDetails) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<ApiErrorDetails>('resumeops-api-error', { detail: details }));
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { emptyOnNotFound, ...fetchOptions } = options;
  const token = localStorage.getItem('resumeops-token');
  const headers = new Headers(fetchOptions.headers);

  if (fetchOptions.body && !(fetchOptions.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...fetchOptions, headers });
  } catch {
    const message = 'The server is unavailable. Please try again.';
    publishApiError({ message });
    throw new Error(message);
  }

  if (!response.ok) {
    if (response.status === 404 && emptyOnNotFound) return [] as T;
    let message = '';
    try {
      const body = await response.json();
      message = body.message ?? body.error ?? '';
    } catch {
      // The centralized handler supplies the status-specific fallback.
    }
    const fallbackMessage = message || 'Something went wrong. Please try again.';
    publishApiError({ status: response.status, message });
    throw new Error(fallbackMessage);
  }

  if (response.status === 204) return undefined as T;
  const body = await response.text();
  return (body ? JSON.parse(body) : undefined) as T;
}

export function loginRequest(email: string, password: string) {
  return request<LoginResponse>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function registerRequest(name: string, email: string, password: string) {
  return request<ApiUser>('/api/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function getProfile() {
  return request<ApiUser>('/api/profile');
}

export function uploadResume(file: File, resumeName: string) {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('resume_name', resumeName);
  return request<ResumeUploadResponse>('/resume/upload', {
    method: 'POST',
    body: formData,
  });
}

export function checkCompatibility(resumeId: number, jobDescription: string) {
  const formData = new FormData();
  formData.append('resumeID', String(resumeId));
  formData.append('JD', jobDescription);

  return request<AnalysisResult>('/compatibilityCheck', {
    method: 'POST',
    body: formData,
  });
}

export function getResumes() {
  return request<ResumeSummary[]>('/getresumes', { emptyOnNotFound: true });
}

export function getAnalysisHistory() {
  return request<AnalysisHistoryItem[]>('/getAnalysisHistory', { emptyOnNotFound: true });
}

export function deleteAnalysis(analysisId: number) {
  return request<void>(`/analysisDelete/${analysisId}`, { method: 'DELETE' });
}

export function deleteResume(resumeId: number) {
  return request<void>(`/resumeDelete/${resumeId}`, { method: 'DELETE' });
}