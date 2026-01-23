import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import { getNetlifyIdentity } from '@/lib/netlifyIdentity';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminLoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/ecqm19-admin/dashboard');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const identity = getNetlifyIdentity();
      if (!identity) {
        setError('Netlify Identity n\'est pas disponible sur cette page.');
        return;
      }
      identity.open('login');
    } catch {
      setError('Impossible d\'ouvrir la fenêtre de connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-orange-700" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
            <p className="text-gray-500 mt-1">Collège Privé La Vision Future</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter (Netlify Identity)'
              )}
            </button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Accès réservé (invite-only)
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
