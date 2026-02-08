import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '@/components/ui/Hero';
import SectionTitle from '@/components/ui/SectionTitle';
import { homeContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';
import { 
  GraduationCap, 
  Building2, 
  Users, 
  Globe,
  ArrowRight,
  Quote,
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

type HomeData = typeof homeContent;

const HomeContent: React.FC = () => {
  const { value: homeData } = usePageJsonContent<HomeData>('accueil', homeContent);
  const sections = (homeData as any).sections || (homeContent as any).sections;
  return (
    <>
      {/* Hero Section */}
      <Hero
        title={homeData.hero.title}
        subtitle={homeData.hero.subtitle}
        description={homeData.hero.description}
        ctaPrimary={{ text: homeData.hero.ctaPrimary, link: '/programmes' }}
        ctaSecondary={{ text: homeData.hero.ctaSecondary, link: '/visite' }}
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
            {homeData.stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <EditableText
                  as="div"
                  path={`stats.${index}.value`}
                  value={stat.value}
                  className="text-4xl md:text-5xl font-bold text-blue-800 mb-2"
                />
                <EditableText
                  as="div"
                  path={`stats.${index}.label`}
                  value={stat.label}
                  className="text-gray-600 font-medium"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={sections.features.subtitle}
            title={sections.features.title}
            description={sections.features.description}
            subtitlePath="sections.features.subtitle"
            titlePath="sections.features.title"
            descriptionPath="sections.features.description"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeData.features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || GraduationCap;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-800 transition-colors">
                    <Icon className="w-7 h-7 text-blue-800 group-hover:text-white transition-colors" />
                  </div>
                  <EditableText
                    as="h3"
                    path={`features.${index}.title`}
                    value={feature.title}
                    className="text-xl font-bold text-gray-900 mb-3"
                  />
                  <EditableText
                    as="p"
                    multiline
                    path={`features.${index}.description`}
                    value={feature.description}
                    className="text-gray-600 leading-relaxed"
                  />
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
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                <EditableText as="span" path="sections.aboutPreview.badge" value={sections.aboutPreview.badge} />
              </span>
              <EditableText
                as="h2"
                path="sections.aboutPreview.title"
                value={sections.aboutPreview.title}
                className="text-4xl font-bold text-gray-900 mb-6"
              />
              <EditableText
                as="p"
                multiline
                path="sections.aboutPreview.paragraphs.0"
                value={sections.aboutPreview.paragraphs[0]}
                className="text-lg text-gray-600 mb-6 leading-relaxed"
              />
              <EditableText
                as="p"
                multiline
                path="sections.aboutPreview.paragraphs.1"
                value={sections.aboutPreview.paragraphs[1]}
                className="text-lg text-gray-600 mb-8 leading-relaxed"
              />
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/notre-ecole"
                  className="inline-flex items-center gap-2 bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <EditableText as="span" path="sections.aboutPreview.ctaPrimary" value={sections.aboutPreview.ctaPrimary} />
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/notre-ecole"
                  className="inline-flex items-center gap-2 border-2 border-blue-800 text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  <EditableText as="span" path="sections.aboutPreview.ctaSecondary" value={sections.aboutPreview.ctaSecondary} />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <GraduationCap className="w-24 h-24 text-blue-800 mx-auto mb-4" />
                    <EditableText
                      as="p"
                      path="sections.aboutPreview.imageCaption"
                      value={sections.aboutPreview.imageCaption}
                      className="text-blue-700 font-medium"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <EditableText
                      as="div"
                      path="sections.aboutPreview.highlight.value"
                      value={sections.aboutPreview.highlight.value}
                      className="text-2xl font-bold text-gray-900"
                    />
                    <EditableText
                      as="div"
                      path="sections.aboutPreview.highlight.label"
                      value={sections.aboutPreview.highlight.label}
                      className="text-sm text-gray-500"
                    />
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
            subtitle={sections.programmesPreview.subtitle}
            title={sections.programmesPreview.title}
            description={sections.programmesPreview.description}
            subtitlePath="sections.programmesPreview.subtitle"
            titlePath="sections.programmesPreview.title"
            descriptionPath="sections.programmesPreview.description"
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.programmesPreview.cards.map((program: any, index: number) => {
              const programmeIconMap: Record<string, LucideIcon> = {
                heart: Heart,
                book: BookOpen,
                graduation: GraduationCap,
                star: Star,
              };
              const Icon = programmeIconMap[program.icon] || GraduationCap;
              return (
              <Link
                key={index}
                to="/programmes"
                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <EditableText
                  as="h3"
                  path={`sections.programmesPreview.cards.${index}.title`}
                  value={program.title}
                  className="text-xl font-bold text-white mb-1"
                />
                <EditableText
                  as="p"
                  path={`sections.programmesPreview.cards.${index}.ages`}
                  value={program.ages}
                  className="text-blue-200 mb-4"
                />
                <span className="inline-flex items-center text-white/80 group-hover:text-white transition-colors">
                  <EditableText as="span" path="sections.programmesPreview.learnMore" value={sections.programmesPreview.learnMore} />
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/programmes"
              className="inline-flex items-center gap-2 bg-white text-blue-800 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              <EditableText as="span" path="sections.programmesPreview.cta" value={sections.programmesPreview.cta} />
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={sections.testimonials.subtitle}
            title={sections.testimonials.title}
            description={sections.testimonials.description}
            subtitlePath="sections.testimonials.subtitle"
            titlePath="sections.testimonials.title"
            descriptionPath="sections.testimonials.description"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeData.testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <Quote className="w-10 h-10 text-blue-200 mb-4" />
                <EditableText
                  as="p"
                  multiline
                  path={`testimonials.${index}.quote`}
                  value={testimonial.quote}
                  className="text-gray-700 mb-6 leading-relaxed italic"
                />
                <div className="border-t border-gray-100 pt-6">
                  <EditableText
                    as="div"
                    path={`testimonials.${index}.author`}
                    value={testimonial.author}
                    className="font-semibold text-gray-900"
                  />
                  <EditableText
                    as="div"
                    path={`testimonials.${index}.role`}
                    value={testimonial.role}
                    className="text-sm text-gray-500"
                  />
                  <EditableText
                    as="div"
                    path={`testimonials.${index}.achievement`}
                    value={testimonial.achievement}
                    className="text-sm text-blue-800 font-medium mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-800 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EditableText
            as="h2"
            path="sections.cta.title"
            value={sections.cta.title}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          />
          <EditableText
            as="p"
            multiline
            path="sections.cta.description"
            value={sections.cta.description}
            className="text-xl text-blue-100 mb-10"
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/admissions"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-800 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              <EditableText as="span" path="sections.cta.primary" value={sections.cta.primary} />
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-blue-700/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-blue-700/70 transition-colors"
            >
              <EditableText as="span" path="sections.cta.secondary" value={sections.cta.secondary} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeContent;
