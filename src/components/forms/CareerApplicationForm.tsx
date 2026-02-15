import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { fetchCareersPayload, type CareerOffer } from '@/lib/careersApi';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

const CareerApplicationForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [offers, setOffers] = useState<CareerOffer[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reference, setReference] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    const load = async () => {
      setIsLoadingOffers(true);
      try {
        const payload = await fetchCareersPayload();
        setOffers(payload.offers || []);
      } catch {
        setOffers([]);
      } finally {
        setIsLoadingOffers(false);
      }
    };

    load();
  }, []);

  const selectedOfferId = searchParams.get('offerId') || '';

  const selectedOffer = useMemo(() => {
    return offers.find((offer) => offer.id === selectedOfferId && offer.status === 'published') || null;
  }, [offers, selectedOfferId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOffer) {
      setSubmitStatus('error');
      setErrorMessage("Offre invalide. Veuillez revenir à la liste des offres.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const res = await fetch('/api/job-application-submit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offerId: selectedOffer.id,
          offerTitle: selectedOffer.title,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        }),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(result.error || 'Erreur lors de l\'envoi');
      }

      setReference(result.reference || '');
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingOffers) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!selectedOffer) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
        <p className="text-amber-900 font-medium mb-3">Offre non trouvée ou expirée.</p>
        <Link to="/carrieres" className="text-amber-700 hover:text-amber-900 font-semibold underline">
          Retour aux offres d'emploi
        </Link>
      </div>
    );
  }

  if (submitStatus === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-700" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Candidature envoyée</h3>
        <p className="text-gray-600 mb-4">
          Votre candidature pour <strong>{selectedOffer.title}</strong> a bien été transmise.
        </p>
        {reference && (
          <div className="bg-white rounded-lg p-4 mb-6 border border-green-100">
            <p className="text-sm text-gray-500 mb-1">Référence</p>
            <p className="text-lg font-bold text-green-700">{reference}</p>
          </div>
        )}
        <Link
          to="/carrieres"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Voir les autres offres
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide mb-1">Offre concernée</p>
        <p className="text-blue-900 font-semibold">{selectedOffer.title}</p>
      </div>

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Erreur d'envoi</p>
            <p className="text-red-600 text-sm">{errorMessage || 'Veuillez réessayer.'}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Message / Motivation *</label>
        <textarea
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none"
          placeholder="Présentez brièvement votre profil et votre motivation."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 rounded-lg font-semibold hover:from-orange-500 hover:to-orange-600 transition-all disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Envoyer ma candidature
          </>
        )}
      </button>
    </form>
  );
};

export default CareerApplicationForm;
