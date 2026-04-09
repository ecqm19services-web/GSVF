import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'cpvf_admin_auth';

type AdminLoginResult = {
  ok: boolean;
  error?: string;
  requirePasswordChange?: boolean;
};

type AdminChangePasswordResult = {
  ok: boolean;
  error?: string;
};

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

  const login = useCallback(async (user: string, pass: string): Promise<AdminLoginResult> => {
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

      if (!res.ok) {
        let message = 'Identifiants incorrects.';
        try {
          const payload = await res.json();
          if (payload && typeof payload.error === 'string' && payload.error.trim() !== '') {
            message = payload.error;
          }
        } catch {
          // Ignore malformed error payload.
        }

        if (res.status === 423) {
          return {
            ok: false,
            error: 'Compte bloqué 30 minutes après trop de tentatives. Réessayez plus tard.',
          };
        }

        if (res.status === 428) {
          return {
            ok: false,
            error: 'Changement de mot de passe obligatoire avant accès.',
            requirePasswordChange: true,
          };
        }

        return { ok: false, error: message };
      }

      sessionStorage.setItem(STORAGE_KEY, b64);
      setToken(b64);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Erreur réseau. Veuillez réessayer.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (user: string, currentPass: string, newPass: string): Promise<AdminChangePasswordResult> => {
    try {
      const b64 = btoa(`${user}:${currentPass}`);
      const res = await fetch('/api/admin-change-password/', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${b64}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword: newPass }),
      });

      if (!res.ok) {
        let message = 'Impossible de changer le mot de passe.';
        try {
          const payload = await res.json();
          if (payload && typeof payload.error === 'string' && payload.error.trim() !== '') {
            message = payload.error;
          }
        } catch {
          // ignore malformed payload
        }
        return { ok: false, error: message };
      }

      return { ok: true };
    } catch {
      return { ok: false, error: 'Erreur réseau. Veuillez réessayer.' };
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
    changePassword,
    logout,
    requireAuth,
    user: null,
    token,
  };
};

export default useAdminAuth;
