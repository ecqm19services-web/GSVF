import React, { useState } from 'react';
import { Search, FileText, Clock, CheckCircle, AlertCircle, Calendar, Mail, Phone } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { 
  contactStatusLabels, 
  admissionStatusLabels,
  contactStatusColors,
  admissionStatusColors,
  type ContactSubmission,
  type AdmissionSubmission,
  type StatusHistory
} from '@/types/submissions';
import { siteConfig } from '@/data/content';

type SearchResult = {
  type: 'contact' | 'admission';
  submission: ContactSubmission | AdmissionSubmission;
  history: StatusHistory[];
} | null;

const SuiviPage: React.FC = () => {
  const [reference, setReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reference.trim()) {
      setError('Veuillez entrer un numéro de référence');
      return;
    }

    // Validation du format
    const refPattern = /^(CONT|ADM)-\d{4}-\d{4}$/;
    if (!refPattern.test(reference.toUpperCase())) {
      setError('Format invalide. Utilisez CONT-XXXX-XXXX ou ADM-XXXX-XXXX');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const url = `/api/suivi?reference=${encodeURIComponent(reference.toUpperCase())}`;
      const res = await fetch(url);
      if (res.status === 404) {
        setResult(null);
        setError('Aucune demande trouvée avec cette référence');
      } else if (!res.ok) {
        throw new Error('Recherche impossible');
      } else {
        const data = (await res.json()) as SearchResult;
        setResult(data);
      }
    } catch (err) {
      console.error('Erreur de recherche:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'in_progress':
      case 'under_review':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'interview_scheduled':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'processed':
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (type: 'contact' | 'admission', status: string) => {
    if (type === 'contact') {
      return contactStatusLabels[status as keyof typeof contactStatusLabels] || status;
    }
    return admissionStatusLabels[status as keyof typeof admissionStatusLabels] || status;
  };

  const getStatusColor = (type: 'contact' | 'admission', status: string) => {
    if (type === 'contact') {
      return contactStatusColors[status as keyof typeof contactStatusColors] || 'bg-gray-100 text-gray-800';
    }
    return admissionStatusColors[status as keyof typeof admissionStatusColors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Suivi de votre demande
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Entrez votre numéro de référence pour consulter l'état d'avancement de votre demande.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg p-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de référence
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value.toUpperCase())}
                placeholder="Ex: ADM-2026-1234"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg font-mono"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-800 text-white rounded-xl font-semibold hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                Rechercher
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Format: CONT-XXXX-XXXX (contact) ou ADM-XXXX-XXXX (admission)
            </p>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm mb-1">
                      {result.type === 'contact' ? 'Demande de contact' : 'Demande d\'admission'}
                    </p>
                    <p className="text-2xl font-bold font-mono">{result.submission.reference}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(result.type, result.submission.status)}`}>
                    {getStatusLabel(result.type, result.submission.status)}
                  </span>
                </div>
                <p className="text-blue-200 text-sm mt-2">
                  Soumise le {formatDate(result.submission.$createdAt)}
                </p>
              </div>

              {/* Timeline */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Historique</h3>
                <div className="space-y-4">
                  {/* Initial submission */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      {result.history.length > 0 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="font-medium text-gray-900">Demande reçue</p>
                      <p className="text-sm text-gray-500">{formatDate(result.submission.$createdAt)}</p>
                    </div>
                  </div>

                  {/* Status history */}
                  {result.history.map((item, index) => (
                    <div key={item.$id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(item.newStatus)}
                        </div>
                        {index < result.history.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium text-gray-900">
                          {getStatusLabel(result.type, item.newStatus)}
                        </p>
                        <p className="text-sm text-gray-500">{formatDate(item.$createdAt)}</p>
                        {item.note && (
                          <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Current status if no history */}
                  {result.history.length === 0 && result.submission.status !== 'new' && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(result.submission.status)}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {getStatusLabel(result.type, result.submission.status)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Public notes for admissions */}
                {result.type === 'admission' && (result.submission as AdmissionSubmission).publicNotes && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Message de l'administration</h4>
                    <p className="text-blue-800">{(result.submission as AdmissionSubmission).publicNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No result after search */}
          {hasSearched && !result && !error && !isLoading && (
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat</h3>
              <p className="text-gray-600">Vérifiez votre numéro de référence et réessayez.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Besoin d'aide ?</h2>
          <p className="text-gray-600 mb-6">
            Si vous avez des questions concernant votre demande, n'hésitez pas à nous contacter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-100 text-blue-800 rounded-xl font-semibold hover:bg-blue-200 transition-colors"
            >
              <Mail className="w-5 h-5" />
              {siteConfig.email}
            </a>
            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-800 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <Phone className="w-5 h-5" />
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SuiviPage;
