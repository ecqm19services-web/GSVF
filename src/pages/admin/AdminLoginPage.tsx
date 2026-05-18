import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { isAuthenticated, isLoading, login, changePassword } = useAdminAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/ecqm19-admin/visual');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (requirePasswordChange) {
      if (newPassword.trim() === '' || confirmPassword.trim() === '') {
        setError('Veuillez saisir et confirmer le nouveau mot de passe.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('La confirmation du nouveau mot de passe ne correspond pas.');
        return;
      }

      setIsChangingPassword(true);
      const changed = await changePassword(username.trim(), password, newPassword);
      if (!changed.ok) {
        setError(changed.error || 'Impossible de changer le mot de passe.');
        setIsChangingPassword(false);
        return;
      }

      const relogin = await login(username.trim(), newPassword);
      setIsChangingPassword(false);
      if (!relogin.ok) {
        setError(relogin.error || 'Mot de passe changé mais reconnexion impossible. Réessayez.');
        return;
      }

      setRequirePasswordChange(false);
      setPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      return;
    }

    if (!username.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    const result = await login(username.trim(), password);
    if (!result.ok) {
      if (result.requirePasswordChange) {
        setRequirePasswordChange(true);
      }
      setError(result.error || 'Identifiants incorrects.');
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                placeholder="admin"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {requirePasswordChange ? 'Mot de passe actuel' : 'Mot de passe'}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              />
            </div>

            {requirePasswordChange && (
              <>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  />
                </div>

                {/* Checklist en temps réel */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 space-y-1.5 text-sm">
                  {[
                    { label: 'Au moins 8 caractères', ok: newPassword.length >= 8 },
                    { label: 'Une lettre majuscule (A-Z)', ok: /[A-Z]/.test(newPassword) },
                    { label: 'Une lettre minuscule (a-z)', ok: /[a-z]/.test(newPassword) },
                    { label: 'Un chiffre (0-9)', ok: /[0-9]/.test(newPassword) },
                    { label: 'Confirmation identique', ok: confirmPassword.length > 0 && newPassword === confirmPassword },
                  ].map(({ label, ok }) => (
                    <div key={label} className={`flex items-center gap-2 ${newPassword.length === 0 ? 'text-gray-400' : ok ? 'text-green-700' : 'text-red-600'}`}>
                      {newPassword.length === 0
                        ? <XCircle className="w-4 h-4 text-gray-300" />
                        : ok
                          ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                          : <XCircle className="w-4 h-4 text-red-500" />
                      }
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={
                isLoading ||
                isChangingPassword ||
                (requirePasswordChange && (
                  newPassword.length < 8 ||
                  !/[A-Z]/.test(newPassword) ||
                  !/[a-z]/.test(newPassword) ||
                  !/[0-9]/.test(newPassword) ||
                  newPassword !== confirmPassword
                ))
              }
              className="w-full py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {(isLoading || isChangingPassword) ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {requirePasswordChange ? 'Mise à jour...' : 'Connexion...'}
                </>
              ) : (
                requirePasswordChange ? 'Changer le mot de passe' : 'Se connecter'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Accès réservé aux administrateurs
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
