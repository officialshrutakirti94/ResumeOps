import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { ProfileModal } from '@/components/dashboard/ProfileModal';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, ChevronDown, LogOut } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: 'landing' | 'login' | 'register' | 'dashboard') => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => onNavigate('landing')} className="transition-transform hover:scale-[1.02]">
            <Logo />
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('dashboard')}
                  className="hidden sm:inline-flex"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
                <button
                  onClick={() => setProfileOpen(true)}
                  className="group flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 transition-all hover:border-brand-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-700"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white">
                    {user?.username?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 sm:inline">
                    {user?.username ?? 'User'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-y-0.5" />
                </button>
                <Button variant="ghost" size="sm" onClick={logout} className="hidden sm:inline-flex">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => onNavigate('login')}>
                  Login
                </Button>
                <Button variant="primary" size="sm" onClick={() => onNavigate('register')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
