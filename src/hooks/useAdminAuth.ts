import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'cpvf_admin_auth';

function getStoredCredentials(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Admin auth hook — stores Base64-encoded Basic Auth credentials in sessionStorage.
 * The login page calls `login(user, pass)` which tests the credentials against the
 * PHP API, then stores them. The token returned is the Base64 string to use in
 * `Authorization: Basic <token>` headers.
 */
export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(getStoredCredentials);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!token;

  const login = useCallback(async (user: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const b64 = btoa(`${user}:${pass}`);
      // Test credentials by making a PUT-like OPTIONS or a harmless request
      // We'll do a small PUT test that the PHP will validate
      const res = await fetch('/api/page-content/?page=__auth_test__', {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${b64}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kind: 'json', payload: '{}' }),
      });

      // 401 = bad credentials, anything else = credentials accepted
      if (res.status === 401) {
        return false;
      }

      sessionStorage.setItem(STORAGE_KEY, b64);
      setToken(b64);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
    setToken(null);
    navigate('/ecqm19-admin');
  }, [navigate]);

  const checkAuth = useCallback(() => {
    return !!getStoredCredentials();
  }, []);

  const requireAuth = useCallback(() => {
    if (!getStoredCredentials()) {
      navigate('/ecqm19-admin');
    }
  }, [navigate]);

  useEffect(() => {
    // Sync state if storage was cleared externally
    const stored = getStoredCredentials();
    if (!stored && token) setToken(null);
  }, [token]);

  return {
    isAuthenticated,
    isLoading,
    checkAuth,
    login,
    logout,
    requireAuth,
    user: null,
    token,
  };
};

export default useAdminAuth;
