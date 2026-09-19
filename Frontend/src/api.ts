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
  userName: string;
  resume_name: string;
  version: string;
  analysis: Record<string, unknown>;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('resumeops-token');
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body.message ?? body.error ?? message;
    } catch {
      // Keep the HTTP status when the server does not return JSON.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
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
  return request<ResumeSummary[]>('/getresumes');
}

export function getAnalysisHistory() {
  return request<AnalysisHistoryItem[]>('/getAnalysisHistory');
}