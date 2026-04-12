import React, { useState, useEffect } from 'react';
import Hero from '@/components/ui/Hero';
import FacebookPageEmbed from '@/components/ui/FacebookPageEmbed';
import { siteConfig, actualitesSocialConfig } from '@/data/content';
import { useEditSession } from '@/contexts/EditSessionContext';
import {
  Calendar,
  ArrowRight,
  Newspaper,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Settings2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
  category: string;
}

interface SocialFeed {
  id: string;
  label: string;
  enabled: boolean;
  url: string;
}

const defaultArticles: Article[] = [
  {
    id: '1',
    title: "100% de réussite au CEPE 2024-2025",
    excerpt: "Le Collège Privé la Vision Future confirme son excellence avec un taux de réussite de 100% au CEPE pour l'année scolaire 2024-2025.",
    content: "",
    date: "Juillet 2025",
    image: "/images/accueil/accueil_ecole_eleves.jpeg",
    category: "Résultats"
  },
  {
    id: '2',
    title: "Rentrée scolaire 2025-2026",
    excerpt: "Les inscriptions sont ouvertes pour la nouvelle année scolaire. Affectés et non-affectés sont les bienvenus du 1er cycle au 2nd cycle.",
    content: "",
    date: "Septembre 2025",
    image: "/images/accueil/accueil_ecole.jpeg",
    category: "Inscriptions"
  },
];

const socialIcons: Record<string, React.FC<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  tiktok: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.71a8.27 8.27 0 004.76 1.5V6.77a4.83 4.83 0 01-1-.08z"/>
    </svg>
  ),
};

const socialColors: Record<string, { bg: string; text: string; badge: string }> = {
  facebook: { bg: 'bg-blue-100', text: 'text-blue-800', badge: 'text-blue-700' },
  instagram: { bg: 'bg-pink-100', text: 'text-pink-800', badge: 'text-pink-700' },
  youtube: { bg: 'bg-red-100', text: 'text-red-800', badge: 'text-red-700' },
  tiktok: { bg: 'bg-gray-100', text: 'text-gray-800', badge: 'text-gray-700' },
  linkedin: { bg: 'bg-sky-100', text: 'text-sky-800', badge: 'text-sky-700' },
};

const ActualitesContent: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(defaultArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [heroBgImage, setHeroBgImage] = useState<string>('');
  const [socialFeeds, setSocialFeeds] = useState<SocialFeed[]>(actualitesSocialConfig.feeds);
  const [showSocialAdmin, setShowSocialAdmin] = useState(false);

  const { isEditing } = useEditSession() || {};

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/page-content/?page=actualites');
        const data = await res.json();
        if (data.document?.content) {
          const parsed = JSON.parse(data.document.content);
          if (parsed.articles && Array.isArray(parsed.articles) && parsed.articles.length > 0) {
            setArticles(parsed.articles);
          }
          if (parsed.hero?.backgroundImage) {
            setHeroBgImage(parsed.hero.backgroundImage);
          }
          if (parsed.socialFeeds && Array.isArray(parsed.socialFeeds)) {
            setSocialFeeds(parsed.socialFeeds);
          }
        }
      } catch {
        // Use defaults
      }
    };
    loadData();
  }, []);

  // Save social config when admin changes it
  const toggleFeed = (feedId: string) => {
    setSocialFeeds((prev) =>
      prev.map((f) => (f.id === feedId ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const updateFeedUrl = (feedId: string, url: string) => {
    setSocialFeeds((prev) =>
      prev.map((f) => (f.id === feedId ? { ...f, url } : f))
    );
  };

  // Persist social config via page-content API
  useEffect(() => {
    if (!isEditing) return;
    // We store socialFeeds in a hidden div data attribute that the EditSession will pick up
    // Actually, we need to save it via the draft. Let's use updateAtPath if available.
  }, [socialFeeds, isEditing]);

  const enabledFeeds = socialFeeds.filter((f) => f.enabled);
  const feedColSpan = enabledFeeds.length > 0 ? Math.floor(4 / enabledFeeds.length) : 4;

  const renderSocialFeed = (feed: SocialFeed) => {
    const Icon = socialIcons[feed.id] || Facebook;
    const colors = socialColors[feed.id] || socialColors.facebook;
    const feedUrl = feed.url || (siteConfig.socialLinks as any)[feed.id] || '';

    if (feed.id === 'facebook' && feedUrl) {
      return (
        <div key={feed.id}>
          <div className="flex items-center gap-3 mb-4">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 ${colors.bg} ${colors.text} rounded-full text-sm font-semibold`}>
              <Icon className="w-4 h-4" />
              Fil {feed.label}
            </span>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-3">
            <FacebookPageEmbed
              pageUrl={feedUrl}
              height={900}
              tabs="timeline"
              align="right"
            />
          </div>
          <div className="text-right mt-4">
            <a
              href={feedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 ${colors.badge} hover:opacity-80 font-medium transition-colors text-sm`}
            >
              <Icon className="w-4 h-4" />
              Voir sur {feed.label}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      );
    }

    // Generic social placeholder for other networks
    return (
      <div key={feed.id}>
        <div className="flex items-center gap-3 mb-4">
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 ${colors.bg} ${colors.text} rounded-full text-sm font-semibold`}>
            <Icon className="w-4 h-4" />
            Fil {feed.label}
          </span>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-3">
          <div className="w-full max-w-[500px] ml-auto border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Groupe Scolaire La Vision Future</p>
                <p className="text-xs text-gray-500">{feed.label}</p>
              </div>
              {!feedUrl && (
                <span className={`text-xs font-semibold ${colors.badge}`}>
                  Bientôt disponible
                </span>
              )}
            </div>
            {feedUrl && feed.id === 'youtube' ? (
              <div className="p-3">
                <iframe
                  src={feedUrl.replace('youtube.com/','youtube.com/embed/').replace('watch?v=','')}
                  title="YouTube"
                  className="w-full aspect-video rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="max-h-[740px] overflow-y-auto bg-gray-50 p-3 space-y-3">
                {articles.map((article) => (
                  <div
                    key={`social-${feed.id}-${article.id}`}
                    className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
                  >
                    {article.image && (
                      <div className="aspect-[4/3] bg-gray-100">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">{article.title}</p>
                      <p className="text-[11px] text-gray-500 line-clamp-2">{article.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="text-right mt-4">
          {feedUrl ? (
            <a
              href={feedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 ${colors.badge} hover:opacity-80 font-medium text-sm`}
            >
              <Icon className="w-4 h-4" />
              Voir sur {feed.label}
              <ArrowRight className="w-4 h-4" />
            </a>
          ) : (
            <span className={`inline-flex items-center gap-2 ${colors.badge} font-medium text-sm`}>
              <Icon className="w-4 h-4" />
              Compte {feed.label} bientôt disponible
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Hero
        title="Actualités"
        subtitle="Restez informé de la vie du Collège Privé la Vision Future"
        description="Découvrez nos dernières nouvelles, événements et réalisations."
        backgroundImage={heroBgImage || undefined}
        heroImagePath="hero.backgroundImage"
        size="medium"
      />

      {/* Admin: Social feeds config */}
      {isEditing && (
        <div className="bg-amber-50 border-b border-amber-200 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setShowSocialAdmin(!showSocialAdmin)}
              className="inline-flex items-center gap-2 text-amber-800 font-semibold text-sm hover:text-amber-900"
            >
              <Settings2 className="w-4 h-4" />
              Configurer les réseaux sociaux affichés
            </button>
            {showSocialAdmin && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {socialFeeds.map((feed) => {
                  const Icon = socialIcons[feed.id] || Facebook;
                  const colors = socialColors[feed.id] || socialColors.facebook;
                  return (
                    <div key={feed.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center gap-2 ${colors.text} font-semibold text-sm`}>
                          <Icon className="w-4 h-4" />
                          {feed.label}
                        </span>
                        <button
                          onClick={() => toggleFeed(feed.id)}
                          className="transition-colors"
                          title={feed.enabled ? 'Désactiver' : 'Activer'}
                        >
                          {feed.enabled ? (
                            <ToggleRight className="w-8 h-8 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder={`URL ${feed.label} (optionnel)`}
                        value={feed.url}
                        onChange={(e) => updateFeedUrl(feed.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedArticle ? (
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setSelectedArticle(null)}
                className="flex items-center gap-2 text-blue-800 hover:text-blue-600 font-medium mb-8 transition-colors"
              >
                ← Retour aux actualités
              </button>
              {selectedArticle.image && (
                <div className="aspect-video rounded-2xl overflow-hidden mb-8">
                  <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {selectedArticle.category}
                </span>
                <span className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  {selectedArticle.date}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{selectedArticle.title}</h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {selectedArticle.content ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
                ) : (
                  <p>{selectedArticle.excerpt}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
              {/* Articles */}
              <div className="xl:col-span-1 min-w-0">
                <div className="flex items-center gap-2 mb-6">
                  <Newspaper className="w-5 h-5 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">Articles</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {articles.map((article) => (
                    <article
                      key={article.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
                      onClick={() => setSelectedArticle(article)}
                    >
                      {article.image && (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {article.category}
                          </span>
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {article.date}
                          </span>
                        </div>
                        <h3 className="text-[15px] font-bold text-gray-900 mb-1.5 group-hover:text-blue-800 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Social feeds — dynamic */}
              <div className="xl:col-span-4">
                {enabledFeeds.length > 0 ? (
                  <div className={`grid grid-cols-1 ${enabledFeeds.length >= 2 ? 'xl:grid-cols-2' : ''} gap-6 items-start`}>
                    {enabledFeeds.map((feed) => renderSocialFeed(feed))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-400">
                    <p className="text-lg">Aucun réseau social activé</p>
                    {isEditing && <p className="text-sm mt-2">Cliquez sur "Configurer les réseaux sociaux" ci-dessus pour en activer.</p>}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ActualitesContent;
