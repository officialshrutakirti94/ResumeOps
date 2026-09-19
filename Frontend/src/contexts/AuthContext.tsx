import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getProfile, loginRequest, registerRequest, type ApiUser } from '@/api';

export interface User {
  id: number;
  username: string;
  email: string;
  credits: number;
  role: string;
}

export interface AppNotification {
  id: number;
  message: string;
  tone: 'success' | 'warning' | 'error';
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  authReady: boolean;
  notifications: AppNotification[];
  notify: (message: string, tone?: AppNotification['tone']) => void;
  dismissNotification: (id: number) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  refreshProfile: () => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authReady, setAuthReady] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('resumeops-user');
      if (stored) {
        try {
          return JSON.parse(stored) as User;
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const saveUser = (apiUser: ApiUser) => {
    const nextUser: User = {
      id: apiUser.id,
      username: apiUser.name,
      email: apiUser.email,
      credits: apiUser.credits,
      role: apiUser.role,
    };
    setUser(nextUser);
    localStorage.setItem('resumeops-user', JSON.stringify(nextUser));
    return nextUser;
  };

  const notify = (message: string, tone: AppNotification['tone'] = 'success') => {
    const id = Date.now() + Math.random();
    setNotifications((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setNotifications((current) => current.filter((item) => item.id !== id));
    }, 4500);
  };

  const dismissNotification = (id: number) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (!localStorage.getItem('resumeops-token')) {
      setAuthReady(true);
      return;
    }

    getProfile()
      .then((profile) => {
        const nextUser = saveUser(profile);
        if (nextUser.credits === 2) notify('You have only 2 credits remaining.', 'warning');
      })
      .catch(() => {
        localStorage.removeItem('resumeops-user');
        localStorage.removeItem('resumeops-token');
        setUser(null);
      })
      .finally(() => {
        setAuthReady(true);
      });
  }, []);

  const refreshProfile = async () => {
    const nextUser = saveUser(await getProfile());
    if (nextUser.credits === 2) notify('You have only 2 credits remaining.', 'warning');
    return nextUser;
  };

  const login = async (email: string, password: string) => {
    const response = await loginRequest(email, password);
    localStorage.setItem('resumeops-token', response.token);
    const nextUser = saveUser(response);
    if (nextUser.credits === 2) notify('You have only 2 credits remaining.', 'warning');
  };

  const register = async (username: string, email: string, password: string) => {
    await registerRequest(username, email, password);
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('resumeops-user');
    localStorage.removeItem('resumeops-token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authReady,
        notifications,
        notify,
        dismissNotification,
        login,
        register,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
