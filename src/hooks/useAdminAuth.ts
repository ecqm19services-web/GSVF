import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getNetlifyIdentity, type NetlifyIdentityUser } from '@/lib/netlifyIdentity';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<NetlifyIdentityUser | null>(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    const identity = getNetlifyIdentity();
    try {
      identity?.logout();
    } catch {
      // ignore
    }
    setUser(null);
    setIsAuthenticated(false);
    navigate('/ecqm19-admin');
  }, [navigate]);

  const checkAuth = useCallback(() => {
    const identity = getNetlifyIdentity();
    const current = identity?.currentUser() || null;
    setUser(current);
    setIsAuthenticated(!!current);
    setIsLoading(false);
    return !!current;
  }, []);

  useEffect(() => {
    const identity = getNetlifyIdentity();
    if (!identity) {
      setIsLoading(false);
      return;
    }

    identity.init();

    identity.on('init', (u) => {
      setUser((u as NetlifyIdentityUser) || null);
      setIsAuthenticated(!!u);
      setIsLoading(false);
    });

    identity.on('login', (u) => {
      setUser((u as NetlifyIdentityUser) || null);
      setIsAuthenticated(true);
      setIsLoading(false);
      identity.close();
    });

    identity.on('logout', () => {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    });

    identity.on('error', () => {
      setIsLoading(false);
    });

    // Also perform an immediate check
    checkAuth();
  }, [checkAuth]);

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      navigate('/ecqm19-admin');
    }
  };

  return {
    isAuthenticated,
    isLoading,
    checkAuth,
    logout,
    requireAuth,
    user,
    token: user?.token?.access_token || null,
  };
};

export default useAdminAuth;
