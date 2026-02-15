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
            // Side-by-side: Articles + Instagram (2/5) + Facebook feed (3/5)
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* Articles + Instagram — left area */}
              <div className="lg:col-span-2 min-w-0">
                <div className="flex items-center gap-2 mb-6">
                  <Newspaper className="w-5 h-5 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">Articles</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <article
                      key={article.id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
                      onClick={() => setSelectedArticle(article)}
                    >
                      {article.image && (
                        <div className="aspect-[16/10] overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {article.category}
                          </span>
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {article.date}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-blue-800 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                          {article.excerpt}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Instagram className="w-5 h-5 text-pink-600" />
                    <h3 className="text-lg font-bold text-gray-900">Instagram</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Retrouvez aussi nos temps forts et coulisses sur Instagram.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {articles.slice(0, 3).map((article) => (
                      <a
                        key={`insta-${article.id}`}
                        href={siteConfig.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative rounded-xl overflow-hidden border border-gray-200 bg-white"
                      >
                        <div className="aspect-square bg-gray-100">
                          {article.image ? (
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs p-3 text-center">
                              Publication Instagram
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <p className="text-white text-[11px] font-medium line-clamp-2">{article.title}</p>
                        </div>
                      </a>
                    ))}
                  </div>

                  <a
                    href={siteConfig.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-pink-700 hover:text-pink-900 font-medium transition-colors text-sm mt-4"
                  >
                    <Instagram className="w-4 h-4" />
                    Voir notre Instagram
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Facebook Feed — right area (3/5 on desktop) */}
              <div className="lg:col-span-3">
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    <Facebook className="w-4 h-4" />
                    Fil d'actualité
                  </span>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-3">
                  <FacebookPageEmbed
                    pageUrl={siteConfig.socialLinks.facebook}
                    height={900}
                    tabs="timeline"
                  />
                </div>
                <div className="text-center mt-4">
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
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ActualitesContent;
