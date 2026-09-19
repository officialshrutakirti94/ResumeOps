import { X, User, Mail, Zap, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { user, logout } = useAuth();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-fade-in dark:bg-black/60" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md animate-scale-in rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with avatar */}
        <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-brand-600 to-brand-700 px-6 pt-8 pb-6">
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-3xl font-bold text-white backdrop-blur-sm ring-4 ring-white/10">
              {user?.username?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">{user?.username ?? 'User'}</h2>
            <div className="mt-1 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-xs font-medium text-white/80 backdrop-blur-sm">
              <Shield className="h-3 w-3" />
              Free Plan
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-1 p-6">
          {/* Username */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30">
              <User className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Username</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.username ?? '—'}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30">
              <Mail className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Email</p>
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{user?.email ?? '—'}</p>
            </div>
          </div>

          {/* Credits */}
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-700/50 dark:bg-amber-900/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
              <Zap className="h-5 w-5 fill-amber-500 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">Credits Balance</p>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                {user?.credits ?? 10} credits remaining
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-red-50 hover:text-red-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            <X className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
