import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { fetchCareersPayload, saveCareersOffers, uploadCareersPdf, type CareerOffer } from '@/lib/careersApi';
import { FileText, LogOut, Monitor, Settings, BriefcaseBusiness, Plus, Trash2 } from 'lucide-react';

const AdminCareersPage: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, logout, token } = useAdminAuth();
  const navigate = useNavigate();

  const [offers, setOffers] = useState<CareerOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [summary, setSummary] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/ecqm19-admin');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const payload = await fetchCareersPayload();
        setOffers((payload.offers || []).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      load();
    }
  }, [isAuthenticated]);

  const publishedCount = useMemo(
    () => offers.filter((offer) => offer.status === 'published').length,
    [offers]
  );

  const resetForm = () => {
    setTitle('');
    setDeadline('');
    setSummary('');
    setPdfFile(null);
    setError('');
  };

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!title.trim() || !deadline || !pdfFile) {
      setError('Titre, date limite et PDF sont obligatoires.');
      return;
    }

    setError('');
    setIsSaving(true);

    try {
      const upload = await uploadCareersPdf(token, pdfFile);

      const newOffer: CareerOffer = {
        id: `offer_${Date.now()}`,
        title: title.trim(),
        deadline,
        summary: summary.trim(),
        documentUrl: upload.url,
        status: 'published',
        createdAt: new Date().toISOString(),
      };

      const updated = [newOffer, ...offers];
      await saveCareersOffers(token, updated);
      setOffers(updated);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'offre');
    } finally {
      setIsSaving(false);
    }
  };

  const updateOfferStatus = async (offerId: string, status: CareerOffer['status']) => {
    if (!token) return;
    setIsSaving(true);
    try {
      const updated = offers.map((offer) => (offer.id === offerId ? { ...offer, status } : offer));
      await saveCareersOffers(token, updated);
      setOffers(updated);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteOffer = async (offerId: string) => {
    if (!token) return;
    setIsSaving(true);
    try {
      const updated = offers.filter((offer) => offer.id !== offerId);
      await saveCareersOffers(token, updated);
      setOffers(updated);
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed left-0 top-0 h-full w-72 bg-orange-950 text-white p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Administration</h1>
          <p className="text-orange-200 text-sm">Vision Future</p>
        </div>

        <nav className="space-y-2">
          <Link
            to="/ecqm19-admin/dashboard"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-orange-200 hover:text-white"
          >
            <Settings className="w-5 h-5" />
            Tableau de bord
          </Link>

          <Link
            to="/ecqm19-admin/content"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-orange-200 hover:text-white"
          >
            <FileText className="w-5 h-5" />
            Publication (texte)
          </Link>

          <Link
            to="/ecqm19-admin/visual"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-orange-200 hover:text-white"
          >
            <Monitor className="w-5 h-5" />
            Éditeur visuel
          </Link>

          <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/20">
            <BriefcaseBusiness className="w-5 h-5" />
            Offres d'emploi
          </div>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-orange-200 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="ml-72 p-8">
        <div className="max-w-6xl space-y-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestion des offres d'emploi</h2>
              <p className="text-gray-600">
                Ajoutez un titre, une date limite et le PDF officiel de l'appel d'offre.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
              Offres publiées: <strong>{publishedCount}</strong>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-orange-600" />
              Ajouter une offre d'emploi
            </h3>

            <form onSubmit={handleAddOffer} className="space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'offre *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600"
                  placeholder="Ex: Professeur(e) de Mathématiques"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date limite *</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document PDF *</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Résumé (optionnel)</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none"
                  placeholder="Quelques lignes de contexte visibles sur la carte de l'offre."
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-60"
              >
                {isSaving ? 'Publication...' : 'Publier l\'offre'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Offres existantes</h3>

            {isLoading ? (
              <div className="py-8 flex justify-center">
                <div className="w-7 h-7 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : offers.length === 0 ? (
              <p className="text-gray-600">Aucune offre pour le moment.</p>
            ) : (
              <div className="space-y-4">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="border border-gray-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900">{offer.title}</h4>
                      <p className="text-sm text-gray-500">Limite: {offer.deadline}</p>
                      <p className="text-sm text-gray-500">
                        Statut: {offer.status === 'published' ? 'Publié' : 'Clôturé'}
                      </p>
                      <a
                        href={offer.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 mt-1"
                      >
                        <FileText className="w-4 h-4" />
                        Voir le PDF
                      </a>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {offer.status === 'published' ? (
                        <button
                          onClick={() => updateOfferStatus(offer.id, 'closed')}
                          className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
                        >
                          Clôturer
                        </button>
                      ) : (
                        <button
                          onClick={() => updateOfferStatus(offer.id, 'published')}
                          className="px-3 py-2 rounded-lg border border-green-300 text-green-700 text-sm hover:bg-green-50"
                        >
                          Republier
                        </button>
                      )}

                      <button
                        onClick={() => deleteOffer(offer.id)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-red-200 text-red-700 text-sm hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCareersPage;
