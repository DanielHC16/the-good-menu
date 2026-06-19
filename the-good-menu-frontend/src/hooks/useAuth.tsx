// =============================================================================
// THE GOOD MENU — Authentication Context & Hook
// =============================================================================
// Manages global auth state via React Context:
//   • Reads/stores JWT access_token in localStorage
//   • Decodes user payload (sub, email) from the JWT
//   • Provides login, register, and logout functions
//   • Exposes isAuthenticated, user, and loading state
// =============================================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import api from './useApi';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuthUser {
  id: number;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => void;
}

// ─── JWT Decode Helper ───────────────────────────────────────────────────────
// Minimal decoder — extracts the payload from a JWT without verification.
// Verification is the backend's responsibility; we just need the display data.

function decodeJwtPayload(token: string): AuthUser | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    const payload = JSON.parse(jsonPayload);
    return {
      id: payload.sub,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check localStorage for an existing token
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = decodeJwtPayload(token);
      setUser(decoded);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { data } = await api.post<AuthResponse>('/login', credentials);
    localStorage.setItem('access_token', data.access_token);

    const decoded = decodeJwtPayload(data.access_token);
    setUser(decoded);
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    const { data } = await api.post<User>('/register', credentials);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setUser(null);
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
}
