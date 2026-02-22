import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/ui/Hero';
import SectionTitle from '@/components/ui/SectionTitle';
import { homeContent } from '@/data/content';
import { 
  GraduationCap, 
  Building2, 
  Users, 
  Globe,
  ArrowRight,
  Quote,
  Calendar,
  ChevronRight,
  Award,
  BookOpen,
  Heart,
  Star,
  type LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  academic: GraduationCap,
  building: Building2,
  users: Users,
  globe: Globe
};

const HomePage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title={homeContent.hero.title}
        subtitle="L'excellence, Notre devise"
        description={homeContent.hero.description}
        ctaPrimary={{ text: homeContent.hero.ctaPrimary, link: '/programmes' }}
        ctaSecondary={{ text: homeContent.hero.ctaSecondary, link: '/visite' }}
        backgroundImages={[
          '/images/accueil/accueil_ecole.jpeg',
          '/images/accueil/accueil_ecole_eleves.jpeg',
          '/images/accueil/accueil_ecole_eleves_alt.jpeg',
        ]}
        slideDuration={5000}
        size="large"
      />

      {/* Stats Section */}
      <section className="py-16 bg-white relative -mt-8 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {homeContent.stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-800 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Pourquoi nous choisir"
            title="Une éducation d'excellence"
            description="Découvrez ce qui fait du Collège Privé la Vision Future un établissement de référence à Grand-Bassam."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeContent.features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || GraduationCap;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-800 transition-colors">
                    <Icon className="w-7 h-7 text-blue-800 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
                Notre histoire
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Depuis 2019, un engagement fort pour l'éducation
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Fondé en 2019 à Grand-Bassam, le Collège Privé la Vision Future est né de la vision 
                de M. DÉGBOUÉ YAO EULOGE, convaincu qu'une éducation de qualité peut transformer des vies.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Aujourd'hui, nous sommes fiers d'accompagner nos élèves vers l'excellence, avec des 
                enseignants tous qualifiés et disposant de toutes les autorisations requises.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/notre-ecole"
                  className="inline-flex items-center gap-2 bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
                >
                  Notre histoire
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/notre-ecole"
                  className="inline-flex items-center gap-2 border-2 border-blue-800 text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Notre vision
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <GraduationCap className="w-24 h-24 text-blue-800 mx-auto mb-4" />
                    <p className="text-blue-800 font-medium">Campus Vision Future</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-sm text-gray-500">Réussite CEPE 2024-2025</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Nos programmes"
            title="Un parcours complet"
            description="De la maternelle au baccalauréat, nous accompagnons chaque élève vers la réussite."
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Maternelle', ages: '3-5 ans', icon: Heart, color: 'from-pink-500 to-rose-500' },
              { title: 'Primaire', ages: '6-11 ans', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
              { title: 'Collège', ages: '12-15 ans', icon: GraduationCap, color: 'from-purple-500 to-violet-500' },
              { title: 'Lycée', ages: '16-18 ans', icon: Star, color: 'from-amber-500 to-orange-500' }
            ].map((program, index) => (
              <Link
                key={index}
                to="/programmes"
                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center mb-4`}>
                  <program.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{program.title}</h3>
                <p className="text-blue-200 mb-4">{program.ages}</p>
                <span className="inline-flex items-center text-white/80 group-hover:text-white transition-colors">
                  En savoir plus
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/programmes"
              className="inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Découvrir tous nos programmes
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Témoignages"
            title="Ils nous font confiance"
            description="Découvrez ce que nos élèves et parents disent de leur expérience."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeContent.testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <Quote className="w-10 h-10 text-blue-200 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-gray-100 pt-6">
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                  <div className="text-sm text-orange-500 font-medium mt-1">{testimonial.achievement}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Actualités"
            title="Les dernières nouvelles"
            description="Restez informé des événements et actualités de notre établissement."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeContent.news.map((item, index) => (
              <article 
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-blue-400" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-blue-800 font-medium mb-2">{item.date}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.excerpt}</p>
                  <button className="inline-flex items-center text-blue-800 font-medium hover:text-blue-900">
                    Lire la suite
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-800 to-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à rejoindre Vision Future ?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Inscrivez votre enfant dès maintenant et offrez-lui les meilleures chances de réussite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/admissions"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Demander une inscription
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-orange-500/80 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-orange-600 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
