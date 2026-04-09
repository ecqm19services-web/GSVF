import React, { useState } from 'react';
import Hero from '@/components/ui/Hero';
import SectionTitle from '@/components/ui/SectionTitle';
import { visionContent, histoireContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';
import founderPhoto from '../../../Fondateur_CPVF.png';
import { 
  Star, 
  Shield, 
  Lightbulb, 
  Heart, 
  Globe, 
  Target,
  Eye,
  Compass,
  CheckCircle,
  ArrowRight,
  User,
  Quote,
  ChevronDown,
  type LucideIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap: Record<string, LucideIcon> = {
  star: Star,
  shield: Shield,
  lightbulb: Lightbulb,
  heart: Heart,
  globe: Globe,
  target: Target
};

const notreEcoleContent = {
  hero: {
    title: "Notre École",
    subtitle: "Depuis 2019, une institution d'excellence à Grand-Bassam",
    description: "Découvrez notre histoire, notre vision et les valeurs qui guident notre action éducative."
  },
  motDirecteur: {
    title: "Mot du Fondateur",
    message: "Depuis la création du Collège Privé la Vision Future en 2019, notre ambition a toujours été de former des citoyens responsables, compétents et ouverts sur le monde. Chaque jour, nous nous engageons à offrir à nos élèves un cadre d'apprentissage stimulant où l'excellence académique s'allie à l'épanouissement personnel. Je suis fier du chemin parcouru et confiant dans l'avenir que nous construisons ensemble.",
    name: "M. DÉGBOUÉ YAO EULOGE",
    role: "Fondateur & Directeur Général"
  },
  ...visionContent,
  histoire: {
    intro: histoireContent.intro,
    timeline: histoireContent.timeline,
    founders: histoireContent.founders,
  },
  histoireUi: (histoireContent as any).ui,
};

type NotreEcoleData = typeof notreEcoleContent;

const NotreEcoleContent: React.FC = () => {
  const { value: data } = usePageJsonContent<NotreEcoleData>('notre-ecole', notreEcoleContent);
  const ui = (data as any).ui || (notreEcoleContent as any).ui;
  const histUi = (data as any).histoireUi || notreEcoleContent.histoireUi;
  const histoire = (data as any).histoire || notreEcoleContent.histoire;
  const motDirecteur = (data as any).motDirecteur || notreEcoleContent.motDirecteur;
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  return (
    <>
      <div className="relative">
        <Hero
          title={data.hero.title}
          subtitle={data.hero.subtitle}
          description={data.hero.description}
          size="medium"
        />
        {/* Dove overlay on hero */}
        <img
          src="/images/vision/doves.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
          style={{ opacity: 0.12 }}
        />
      </div>

      {/* Mot du Fondateur */}
      <section id="mot-fondateur" className="relative z-20 pt-4 md:pt-6 pb-8 md:pb-10 bg-white -mt-20 sm:-mt-24 lg:-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-2 p-6 md:p-8 flex items-center justify-center">
                <div className="relative w-64 h-80 md:w-full md:h-96">
                  <img
                    src={founderPhoto}
                    alt="Photo du fondateur"
                    className="w-full h-full rounded-2xl overflow-hidden shadow-md object-cover object-[center_22%]"
                  />
                </div>
              </div>
              <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-center">
                <EditableText
                  as="p"
                  multiline
                  path="motDirecteur.message"
                  value={motDirecteur.message}
                  className="text-base md:text-lg text-gray-700 leading-relaxed italic mb-8"
                />
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <EditableText
                      as="p"
                      path="motDirecteur.name"
                      value={motDirecteur.name}
                      className="text-lg font-bold text-gray-900"
                    />
                    <EditableText
                      as="p"
                      path="motDirecteur.role"
                      value={motDirecteur.role}
                      className="text-blue-800 font-medium text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={ui.values?.subtitle || "Nos valeurs"}
            title={ui.values?.title || "Les piliers de notre éducation"}
            description={ui.values?.description || ""}
            subtitlePath="ui.values.subtitle"
            titlePath="ui.values.title"
            descriptionPath="ui.values.description"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: Math.ceil(data.values.length / 2) }, (_, groupIndex) => {
              const firstIndex = groupIndex * 2;
              const first = data.values[firstIndex];
              const second = data.values[firstIndex + 1];
              const colors = [
                'from-blue-600 to-blue-800',
                'from-amber-500 to-amber-600',
                'from-rose-500 to-rose-600'
              ];
              const IconPrimary = iconMap[first?.icon] || Star;
              const IconSecondary = second ? iconMap[second.icon] || Star : Star;

              return (
                <div
                  key={groupIndex}
                  className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[groupIndex % colors.length]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <IconPrimary className="w-7 h-7 text-white" />
                  </div>

                  {/* Première valeur */}
                  {first && (
                    <div className="mb-6">
                      <EditableText
                        as="h3"
                        path={`values.${firstIndex}.title`}
                        value={first.title}
                        className="text-xl font-bold text-gray-900 mb-2"
                      />
                      <EditableText
                        as="p"
                        multiline
                        path={`values.${firstIndex}.description`}
                        value={first.description}
                        className="text-gray-600 leading-relaxed"
                      />
                    </div>
                  )}

                  {/* Deuxième valeur (optionnelle) */}
                  {second && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                          <IconSecondary className="w-5 h-5 text-blue-600" />
                        </div>
                        <EditableText
                          as="h4"
                          path={`values.${firstIndex + 1}.title`}
                          value={second.title}
                          className="text-lg font-semibold text-gray-900"
                        />
                      </div>
                      <EditableText
                        as="p"
                        multiline
                        path={`values.${firstIndex + 1}.description`}
                        value={second.description}
                        className="text-gray-600 leading-relaxed"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notre Histoire - Split Layout: Title left, Tree right */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Left: Title & Intro (sticky) */}
            <div className="lg:col-span-2 lg:sticky lg:top-24">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">Depuis 2019</span>
              <EditableText
                as="h2"
                path="histoireUi.timelineTitle"
                value={histUi.timelineTitle}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              />
              <EditableText
                as="p"
                multiline
                path="histoire.intro"
                value={histoire.intro}
                className="text-lg text-gray-600 leading-relaxed"
              />
              {/* Mini stats under intro */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {(histUi.stats || []).slice(0, 4).map((stat: any, index: number) => (
                  <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-blue-800">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Genealogy Tree */}
            <div className="lg:col-span-3 relative">
              {/* Main trunk line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200" />

              <div className="space-y-0">
                {histoire.timeline.map((item: any, index: number) => {
                  const isOpen = expandedYear === index;
                  const isLast = index === histoire.timeline.length - 1;
                  return (
                    <div key={index} className="relative group">
                      {/* Horizontal branch from trunk to node */}
                      <div className={`absolute left-6 top-6 h-0.5 transition-all duration-300 ${
                        isOpen ? 'w-8 bg-blue-500' : 'w-6 bg-blue-200 group-hover:w-8 group-hover:bg-blue-400'
                      }`} />

                      {/* Node circle on trunk */}
                      <div className={`absolute left-[16px] top-[16px] transition-all duration-300 rounded-full border-[3px] border-gray-50 shadow-md z-10 ${
                        item.milestone
                          ? 'w-6 h-6 bg-blue-800'
                          : isOpen
                            ? 'w-5 h-5 bg-blue-600'
                            : 'w-4 h-4 bg-blue-300 group-hover:bg-blue-500 group-hover:w-5 group-hover:h-5'
                      }`} style={{ transform: `translate(-50%, -50%) translateX(${item.milestone ? '0' : isOpen ? '0' : '2px'})` }}>
                        {item.milestone && (
                          <Star className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>

                      {/* Card content */}
                      <div className="ml-16">
                        <button
                          onClick={() => setExpandedYear(isOpen ? null : index)}
                          className={`w-full text-left rounded-xl transition-all duration-300 ${
                            isOpen
                              ? 'bg-white shadow-lg ring-1 ring-blue-100 p-5'
                              : 'p-4 hover:bg-white/80 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-sm font-bold px-2.5 py-1 rounded-lg transition-colors ${
                              item.milestone
                                ? 'bg-blue-800 text-white'
                                : isOpen
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-700'
                            }`}>
                              {item.year}
                            </span>
                            <span className={`font-semibold flex-1 transition-colors ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
                              {item.title}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
                          </div>

                          <div
                            className="overflow-hidden transition-all duration-300 ease-in-out"
                            style={{ maxHeight: isOpen ? '150px' : '0px', opacity: isOpen ? 1 : 0 }}
                          >
                            <div className="pt-3 border-t border-gray-100 mt-3">
                              <EditableText
                                as="p"
                                multiline
                                path={`histoire.timeline.${index}.description`}
                                value={item.description}
                                className="text-gray-600 text-sm leading-relaxed"
                              />
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* Spacer between items */}
                      {!isLast && <div className="h-1" />}
                    </div>
                  );
                })}

                {/* End cap on trunk */}
                <div className="absolute left-[18px] bottom-0 w-3 h-3 bg-blue-200 rounded-full border-2 border-gray-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Quote className="w-16 h-16 text-blue-400 mx-auto mb-8" />
          <EditableText
            as="blockquote"
            multiline
            path="histoireUi.quote.text"
            value={histUi.quote?.text || ""}
            className="text-2xl md:text-3xl font-medium text-gray-900 italic mb-8"
          />
          <EditableText as="cite" path="histoireUi.quote.author" value={histUi.quote?.author || ""} className="text-gray-600" />
        </div>
      </section>

    </>
  );
};

export default NotreEcoleContent;
