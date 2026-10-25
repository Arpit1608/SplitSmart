import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../api';
import { getToken, setToken } from '../api/client';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(!!getToken()); // true while we verify a saved token

  // On first load: if there's a saved token, ask the server who we are.
  useEffect(() => {
    if (!getToken()) return;
    authApi
      .me()
      .then((r) => setUser(r.user))
      .catch(() => setToken(''))
      .finally(() => setChecking(false));
  }, []);

  // api/client.js fires this event when the server says our token is no longer valid.
  useEffect(() => {
    const onUnauthorized = () => {
      setToken('');
      setUser(null);
    };
    window.addEventListener('splitsmart:unauthorized', onUnauthorized);
    return () => window.removeEventListener('splitsmart:unauthorized', onUnauthorized);
  }, []);

  const authenticate = useCallback(async (mode, form) => {
    const result = await authApi[mode](form);
    setToken(result.token);
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* already logged out */
    }
    setToken('');
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, checking, authenticate, logout }}>{children}</AuthContext.Provider>;
}
