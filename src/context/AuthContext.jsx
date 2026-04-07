import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setTokenState] = useState(() => localStorage.getItem('devpulse_token'));
  const [user, setUser] = useState(null);

  const syncToken = useCallback((next) => {
    if (next) {
      localStorage.setItem('devpulse_token', next);
    } else {
      localStorage.removeItem('devpulse_token');
    }
    setTokenState(next);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/api/v1/auth/me');
        if (!cancelled && data?.data?.user) setUser(data.data.user);
      } catch {
        if (!cancelled) setUser(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const logout = useCallback(() => {
    localStorage.removeItem('devpulse_token');
    setTokenState(null);
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const value = useMemo(
    () => ({ user, token, setToken: syncToken, logout }),
    [user, token, syncToken, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
