import { AlertTriangle, CheckCircle2, X, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function NotificationCenter() {
  const { notifications, dismissNotification } = useAuth();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[200] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
      {notifications.map((notification) => {
        const isWarning = notification.tone === 'warning';
        const isError = notification.tone === 'error';
        const Icon = isError ? XCircle : isWarning ? AlertTriangle : CheckCircle2;
        const toneClass = isError
          ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-800/60 dark:bg-red-950/80 dark:text-red-200'
          : isWarning
            ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/80 dark:text-amber-200'
            : 'border-accent-200 bg-white text-gray-800 dark:border-accent-800/60 dark:bg-gray-900 dark:text-gray-100';

        return (
          <div
            key={notification.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-xl shadow-gray-900/10 ${toneClass}`}
          >
            <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">{notification.message}</p>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismissNotification(notification.id)}
              className="rounded-md p-0.5 opacity-60 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
