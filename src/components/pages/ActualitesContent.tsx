import React, { useState, useEffect } from 'react';
import Hero from '@/components/ui/Hero';
import FacebookPageEmbed from '@/components/ui/FacebookPageEmbed';
import { siteConfig } from '@/data/content';
import { Calendar, ArrowRight, Newspaper, Facebook, Instagram } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
  category: string;
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

const ActualitesContent: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(defaultArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [heroBgImage, setHeroBgImage] = useState<string>('');

  // Load articles from API if available
  useEffect(() => {
    const loadArticles = async () => {
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
        }
      } catch {
        // Use default articles
      }
    };
    loadArticles();
  }, []);

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

      {/* Main Content: Facebook Feed (3/4) + Articles Sidebar (1/4) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedArticle ? (
            // Article detail view
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setSelectedArticle(null)}
                className="flex items-center gap-2 text-blue-800 hover:text-blue-600 font-medium mb-8 transition-colors"
              >
                ← Retour aux actualités
              </button>
              {selectedArticle.image && (
                <div className="aspect-video rounded-2xl overflow-hidden mb-8">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
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
            // Desktop: Articles 1/5 + Facebook 2/5 + Instagram 2/5
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
              {/* Articles — compact list */}
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
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
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

              {/* Social feeds: 2/5 + 2/5 */}
              <div className="xl:col-span-4">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        <Facebook className="w-4 h-4" />
                        Fil Facebook
                      </span>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-3">
                      <FacebookPageEmbed
                        pageUrl={siteConfig.socialLinks.facebook}
                        height={900}
                        tabs="timeline"
                        align="right"
                      />
                    </div>
                    <div className="text-right mt-4">
                      <a
                        href={siteConfig.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium transition-colors text-sm"
                      >
                        <Facebook className="w-4 h-4" />
                        Voir toutes nos publications sur Facebook
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100 text-pink-800 rounded-full text-sm font-semibold">
                        <Instagram className="w-4 h-4" />
                        Fil Instagram
                      </span>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-3">
                      <div className="w-full max-w-[500px] ml-auto border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Groupe Scolaire La Vision Future</p>
                            <p className="text-xs text-gray-500">Instagram</p>
                          </div>
                          <span className="text-xs font-semibold text-pink-700">
                            Bientôt disponible
                          </span>
                        </div>

                        <div className="max-h-[740px] overflow-y-auto bg-gray-50 p-3 space-y-3">
                          {articles.map((article) => (
                            <div
                              key={`social-insta-${article.id}`}
                              className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
                            >
                              {article.image && (
                                <div className="aspect-[4/3] bg-gray-100">
                                  <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="p-3">
                                <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">{article.title}</p>
                                <p className="text-[11px] text-gray-500 line-clamp-2">{article.excerpt}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right mt-4">
                      <span className="inline-flex items-center gap-2 text-pink-700 font-medium text-sm">
                        <Instagram className="w-4 h-4" />
                        Compte Instagram bientôt disponible
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ActualitesContent;
