import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/ui/Hero';
import SectionTitle from '@/components/ui/SectionTitle';
import { programmesContent } from '@/data/content';
import { 
  Heart,
  BookOpen,
  GraduationCap,
  Star,
  CheckCircle,
  Globe,
  FlaskConical,
  Palette,
  Trophy,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  type LucideIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

const cycleIcons: Record<string, LucideIcon> = {
  maternelle: Heart,
  primaire: BookOpen,
  college: GraduationCap,
  lycee: Star
};

const cycleColors: { [key: string]: string } = {
  maternelle: 'from-pink-500 to-rose-500',
  primaire: 'from-blue-500 to-cyan-500',
  college: 'from-purple-500 to-violet-500',
  lycee: 'from-amber-500 to-orange-500'
};

const specialIconMap: Record<string, LucideIcon> = {
  globe: Globe,
  flask: FlaskConical,
  palette: Palette,
  trophy: Trophy
};

const ProgrammesPage: React.FC = () => {
  const [expandedCycle, setExpandedCycle] = useState<string | null>('maternelle');

  const toggleCycle = (id: string) => {
    setExpandedCycle(expandedCycle === id ? null : id);
  };

  return (
    <Layout>
      <Hero
        title={programmesContent.hero.title}
        subtitle={programmesContent.hero.subtitle}
        description={programmesContent.hero.description}
        size="medium"
      />

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xl text-gray-700 leading-relaxed text-center">
            {programmesContent.intro}
          </p>
        </div>
      </section>

      {/* Cycles Overview - Desktop */}
      <section className="py-8 bg-gray-50 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-6">
            {programmesContent.cycles.map((cycle) => {
              const Icon = cycleIcons[cycle.id] || GraduationCap;
              return (
                <a
                  key={cycle.id}
                  href={`#${cycle.id}`}
                  className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all group"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cycleColors[cycle.id]} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{cycle.title}</h3>
                  <p className="text-sm text-gray-500">{cycle.ages}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cycles Detail */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {programmesContent.cycles.map((cycle, index) => {
              const Icon = cycleIcons[cycle.id] || GraduationCap;
              const isExpanded = expandedCycle === cycle.id;

              return (
                <div 
                  key={cycle.id}
                  id={cycle.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Header - Clickable on mobile */}
                  <button
                    onClick={() => toggleCycle(cycle.id)}
                    className="w-full lg:cursor-default"
                  >
                    <div className="p-6 lg:p-8 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cycleColors[cycle.id]} flex items-center justify-center`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-xl lg:text-2xl font-bold text-gray-900">{cycle.title}</h3>
                          <p className="text-gray-500">{cycle.ages}</p>
                        </div>
                      </div>
                      <div className="lg:hidden">
                        {isExpanded ? (
                          <ChevronUp className="w-6 h-6 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Content */}
                  <div className={`lg:block ${isExpanded ? 'block' : 'hidden'}`}>
                    <div className="px-6 lg:px-8 pb-8">
                      <div className="grid lg:grid-cols-2 gap-8">
                        <div>
                          <p className="text-gray-600 mb-6 leading-relaxed">
                            {cycle.description}
                          </p>
                          <h4 className="font-semibold text-gray-900 mb-4">Points clés du programme :</h4>
                          <ul className="space-y-3">
                            {cycle.features.map((feature, fIndex) => (
                              <li key={fIndex} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="aspect-video lg:aspect-square rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <Icon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">{cycle.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Special Programs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Programmes spéciaux"
            title="Des parcours d'excellence"
            description="En plus du programme national, nous proposons des parcours spécialisés pour développer les talents de chaque élève."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programmesContent.specialPrograms.map((program, index) => {
              const Icon = specialIconMap[program.icon] || Star;
              const colors = [
                'bg-blue-100 text-blue-600',
                'bg-blue-100 text-blue-800',
                'bg-purple-100 text-purple-600',
                'bg-amber-100 text-amber-600'
              ];
              return (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl ${colors[index % colors.length]} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{program.title}</h3>
                  <p className="text-gray-600 text-sm">{program.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Prêt à inscrire votre enfant ?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Découvrez notre processus d'admission et les prochaines étapes pour rejoindre Vision Future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/admissions"
              className="inline-flex items-center justify-center gap-2 bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Processus d'admission
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/visite"
              className="inline-flex items-center justify-center gap-2 border-2 border-blue-800 text-blue-800 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Visiter le campus
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProgrammesPage;
