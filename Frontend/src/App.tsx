import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { NotificationCenter } from '@/components/ui/NotificationCenter';

type Page = 'landing' | 'login' | 'register' | 'dashboard';

function AppContent() {
  const { isAuthenticated, authReady } = useAuth();
  const [page, setPage] = useState<Page>(() => (
    localStorage.getItem('resumeops-token') ? 'dashboard' : 'landing'
  ));

  // Redirect to dashboard if already authenticated and trying to access login/register
  useEffect(() => {
    if (isAuthenticated && (page === 'login' || page === 'register')) {
      setPage('dashboard');
    }
    // Redirect to landing if not authenticated and trying to access dashboard
    if (!isAuthenticated && page === 'dashboard') {
      setPage('landing');
    }
  }, [isAuthenticated, page]);

  if (!authReady) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-950" />;
  }

  const handleNavigate = (target: Page) => {
    if (target === 'dashboard' && !isAuthenticated) {
      setPage('login');
      return;
    }
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <NotificationCenter />
      {page === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {page === 'login' && <LoginPage onNavigate={handleNavigate} />}
      {page === 'register' && <RegisterPage onNavigate={handleNavigate} />}
      {page === 'dashboard' && isAuthenticated && <DashboardPage onNavigate={handleNavigate} />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
