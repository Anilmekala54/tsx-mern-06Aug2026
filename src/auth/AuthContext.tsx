import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { decodeToken, isExpired, mockLogin, mockRefresh } from './mockJwt';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  accessToken: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_KEY = 'swapi-app.auth';

interface StoredTokens {
  access: string;
  refresh: string;
}

function loadStoredTokens(): StoredTokens | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredTokens) : null;
  } catch {
    return null;
  }
}

function saveStoredTokens(tokens: StoredTokens | null) {
  if (tokens) localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  else localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<StoredTokens | null>(() => loadStoredTokens());
  const refreshTimer = useRef<number | undefined>(undefined);

  const scheduleSilentRefresh = useCallback((accessToken: string, refreshToken: string) => {
    window.clearTimeout(refreshTimer.current);
    const payload = decodeToken(accessToken);
    if (!payload) return;
    // Refresh 5s before expiry (tokens are intentionally short-lived so the
    // silent-refresh behavior is visible during a demo/review).
    const msUntilRefresh = Math.max((payload.exp - Math.floor(Date.now() / 1000) - 5) * 1000, 0);
    refreshTimer.current = window.setTimeout(() => {
      const next = mockRefresh(refreshToken);
      if (next) {
        setTokens(next);
        saveStoredTokens(next);
        scheduleSilentRefresh(next.access, next.refresh);
      } else {
        setTokens(null);
        saveStoredTokens(null);
      }
    }, msUntilRefresh);
  }, []);

  useEffect(() => {
    if (!tokens) return;
    const accessPayload = decodeToken(tokens.access);
    const refreshPayload = decodeToken(tokens.refresh);
    if (!refreshPayload || isExpired(refreshPayload)) {
      setTokens(null);
      saveStoredTokens(null);
      return;
    }
    if (!accessPayload || isExpired(accessPayload)) {
      const next = mockRefresh(tokens.refresh);
      if (next) {
        setTokens(next);
        saveStoredTokens(next);
        scheduleSilentRefresh(next.access, next.refresh);
      } else {
        setTokens(null);
        saveStoredTokens(null);
      }
    } else {
      scheduleSilentRefresh(tokens.access, tokens.refresh);
    }
    return () => window.clearTimeout(refreshTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    (username: string, password: string) => {
      const result = mockLogin(username, password);
      if (!result) return false;
      setTokens(result);
      saveStoredTokens(result);
      scheduleSilentRefresh(result.access, result.refresh);
      return true;
    },
    [scheduleSilentRefresh],
  );

  const logout = useCallback(() => {
    window.clearTimeout(refreshTimer.current);
    setTokens(null);
    saveStoredTokens(null);
  }, []);

  const accessPayload = tokens ? decodeToken(tokens.access) : null;

  const value: AuthState = {
    isAuthenticated: Boolean(tokens && accessPayload),
    username: accessPayload?.name ?? null,
    accessToken: tokens?.access ?? null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
