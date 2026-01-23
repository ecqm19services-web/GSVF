import React from 'react';
import Hero from '@/components/ui/Hero';
import SectionTitle from '@/components/ui/SectionTitle';
import { excellenceContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';
import { 
  Trophy,
  Award,
  Medal,
  Star,
  Quote,
  ArrowRight,
  TrendingUp,
  User,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';

type ExcellenceData = typeof excellenceContent;

const ExcellenceContent: React.FC = () => {
  const { value: data } = usePageJsonContent<ExcellenceData>('excellence', excellenceContent);
  return (
    <>
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        description={data.hero.description}
        size="medium"
      />

      {/* Results Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Résultats 2025"
            title={data.results.title}
            titlePath="results.title"
            description="Des performances exceptionnelles qui témoignent de la qualité de notre enseignement."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.results.exams.map((exam, index) => {
              const icons = [Trophy, Award, Medal];
              const Icon = icons[index % icons.length];
              const colors = [
                'from-amber-500 to-orange-500',
                'from-blue-600 to-teal-500',
                'from-blue-500 to-indigo-500'
              ];
              return (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors[index]} opacity-10 rounded-full transform translate-x-8 -translate-y-8`} />
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[index]} flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <EditableText
                    as="h3"
                    path={`results.exams.${index}.name`}
                    value={exam.name}
                    className="text-xl font-bold text-gray-900 mb-2"
                  />
                  <EditableText
                    as="div"
                    path={`results.exams.${index}.rate`}
                    value={exam.rate}
                    className="text-5xl font-bold text-blue-800 mb-2"
                  />
                  <EditableText
                    as="p"
                    multiline
                    path={`results.exams.${index}.mentions`}
                    value={exam.mentions}
                    className="text-gray-600 mb-2"
                  />
                  <EditableText
                    as="p"
                    multiline
                    path={`results.exams.${index}.rank`}
                    value={exam.rank}
                    className="text-sm text-blue-800 font-medium"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Distinctions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Distinctions"
            title="Nos élèves brillent"
            description="Palmarès des distinctions obtenues par nos élèves lors des compétitions académiques."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.distinctions.map((distinction, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 flex items-start gap-4 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <EditableText as="h3" path={`distinctions.${index}.title`} value={distinction.title} className="font-bold text-gray-900" />
                    <EditableText as="span" path={`distinctions.${index}.year`} value={distinction.year} className="text-sm text-gray-500" />
                  </div>
                  <EditableText
                    as="p"
                    multiline
                    path={`distinctions.${index}.achievement`}
                    value={distinction.achievement}
                    className="text-gray-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Nos anciens"
            title="Ils ont réussi avec Vision Future"
            description="Découvrez les parcours inspirants de nos anciens élèves."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.alumni.map((alum, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <EditableText as="h3" path={`alumni.${index}.name`} value={alum.name} className="font-bold text-gray-900" />
                    <div className="text-sm text-blue-800">
                      Promotion{' '}
                      <EditableText as="span" path={`alumni.${index}.promotion`} value={alum.promotion} />
                    </div>
                  </div>
                </div>
                <EditableText
                  as="p"
                  multiline
                  path={`alumni.${index}.achievement`}
                  value={alum.achievement}
                  className="text-gray-600"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Témoignages"
            title="Paroles d'anciens"
            light
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {data.testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <Quote className="w-10 h-10 text-blue-400 mb-4" />
                <EditableText
                  as="p"
                  multiline
                  path={`testimonials.${index}.quote`}
                  value={testimonial.quote}
                  className="text-white text-lg mb-6 italic leading-relaxed"
                />
                <div className="border-t border-white/20 pt-4">
                  <EditableText
                    as="p"
                    path={`testimonials.${index}.author`}
                    value={testimonial.author}
                    className="text-white font-semibold"
                  />
                  <EditableText
                    as="p"
                    path={`testimonials.${index}.role`}
                    value={testimonial.role}
                    className="text-blue-200 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                L'excellence en chiffres
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Des résultats qui parlent d'eux-mêmes et témoignent de notre engagement pour la réussite de chaque élève.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '98%', label: 'Réussite BAC', icon: GraduationCap },
                { value: '85%', label: 'Mentions', icon: Award },
                { value: '100%', label: 'Orientation réussie', icon: TrendingUp },
                { value: '5000+', label: 'Diplômés', icon: Trophy }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-7 h-7 text-blue-800" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-blue-800 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Rejoignez l'excellence
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Offrez à votre enfant les meilleures chances de réussite en rejoignant Vision Future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/admissions"
              className="inline-flex items-center justify-center gap-2 bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Demander une inscription
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/programmes"
              className="inline-flex items-center justify-center gap-2 border-2 border-blue-800 text-blue-800 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Découvrir nos programmes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ExcellenceContent;
