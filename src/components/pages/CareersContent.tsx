import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Hero from '@/components/ui/Hero';
import SectionTitle from '@/components/ui/SectionTitle';
import { Calendar, ArrowRight, FileText, Briefcase } from 'lucide-react';
import { fetchCareersPayload, type CareerOffer } from '@/lib/careersApi';

const CareersContent: React.FC = () => {
  const [offers, setOffers] = useState<CareerOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const payload = await fetchCareersPayload();
        setOffers(payload.offers || []);
      } catch {
        setOffers([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const publishedOffers = useMemo(
    () => offers.filter((offer) => offer.status === 'published'),
    [offers]
  );

  const selectedOfferId = searchParams.get('offre');
  const selectedOffer = selectedOfferId
    ? publishedOffers.find((offer) => offer.id === selectedOfferId) || null
    : null;

  const formatDate = (value: string) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <>
      <Hero
        title="Carrières"
        subtitle="Rejoignez l'équipe de la Vision Future"
        description="Consultez nos appels d'offres d'emploi et candidatez au poste qui vous correspond."
        size="medium"
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedOffer ? (
            <div className="max-w-4xl mx-auto">
              <Link
                to="/carrieres"
                className="inline-flex items-center gap-2 text-blue-800 hover:text-blue-600 font-medium mb-8"
              >
                ← Retour aux offres
              </Link>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <Briefcase className="w-4 h-4" />
                    Offre d'emploi
                  </span>
                  <span className="inline-flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    Date limite : {formatDate(selectedOffer.deadline)}
                  </span>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedOffer.title}</h2>
                {selectedOffer.summary && (
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">{selectedOffer.summary}</p>
                )}

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 mb-8">
                  <h3 className="font-semibold text-blue-900 mb-2">Document d'appel d'offre (PDF)</h3>
                  <a
                    href={selectedOffer.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    Ouvrir / Télécharger le PDF
                  </a>
                </div>

                <Link
                  to={`/carrieres/candidature?offerId=${encodeURIComponent(selectedOffer.id)}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-500 hover:to-orange-600 transition-all shadow-lg"
                >
                  Candidater à cette offre
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <SectionTitle
                subtitle="Opportunités"
                title="Nos offres d'emploi en cours"
                description="Chaque offre est publiée avec son document PDF officiel."
              />

              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : publishedOffers.length === 0 ? (
                <div className="max-w-3xl mx-auto text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune offre publiée pour le moment</h3>
                  <p className="text-gray-600">
                    Revenez bientôt pour découvrir nos prochaines opportunités professionnelles.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {publishedOffers.map((offer) => (
                    <article
                      key={offer.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-6"
                    >
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          Limite : {formatDate(offer.deadline)}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3">{offer.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">{offer.summary}</p>

                      <div className="flex flex-wrap items-center gap-4">
                        <Link
                          to={`/carrieres?offre=${encodeURIComponent(offer.id)}`}
                          className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium text-sm"
                        >
                          Voir le détail
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <a
                          href={offer.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium text-sm"
                        >
                          <FileText className="w-4 h-4" />
                          PDF
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default CareersContent;
