import React from 'react';
import Hero from '@/components/ui/Hero';
import SectionTitle from '@/components/ui/SectionTitle';
import { excellenceContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';
import EditableImage from '@/components/admin/EditableImage';
import { useEditSession } from '@/contexts/EditSessionContext';
import { 
  Trophy,
  Award,
  Medal,
  Star,
  Quote,
  Plus,
  Trash2,
} from 'lucide-react';

type ExcellenceData = typeof excellenceContent;

const ExcellenceContent: React.FC = () => {
  const { value: data } = usePageJsonContent<ExcellenceData>('excellence', excellenceContent);
  const editSession = useEditSession<ExcellenceData>();
  const isEditing = !!editSession?.isEditing;

  const addDistinction = () => {
    if (!editSession) return;
    const current = (data as any).distinctions || [];
    editSession.updateAtPath('distinctions', [...current, { title: 'Nouvelle distinction', year: '2025', achievement: 'Description.', image: '/logo-vf.svg' }]);
  };
  const removeDistinction = (i: number) => {
    if (!editSession) return;
    const d = ((data as any).distinctions || [])[i];
    if (!confirm(`Supprimer "${d?.title || `Distinction ${i + 1}`}" ?\n\nOK pour confirmer, Annuler pour annuler.`)) return;
    editSession.updateAtPath('distinctions', ((data as any).distinctions || []).filter((_: unknown, idx: number) => idx !== i));
  };

  const addAlumni = () => {
    if (!editSession) return;
    const current = (data as any).alumni || [];
    editSession.updateAtPath('alumni', [...current, { name: 'Nouvel ancien élève', promotion: '2025', achievement: 'Parcours.', image: '/logo-vf.svg' }]);
  };
  const removeAlumni = (i: number) => {
    if (!editSession) return;
    const alum = ((data as any).alumni || [])[i];
    if (!confirm(`Supprimer "${alum?.name || `Alumni ${i + 1}`}" ?\n\nOK pour confirmer, Annuler pour annuler.`)) return;
    editSession.updateAtPath('alumni', ((data as any).alumni || []).filter((_: unknown, idx: number) => idx !== i));
  };
  const fallbackUi = (excellenceContent as any).ui;
  const uiFromData = (data as any).ui || {};
  const ui = {
    ...fallbackUi,
    ...uiFromData,
    results: { ...fallbackUi.results, ...(uiFromData as any).results },
    distinctions: { ...fallbackUi.distinctions, ...(uiFromData as any).distinctions },
    alumni: { ...fallbackUi.alumni, ...(uiFromData as any).alumni },
    testimonials: { ...fallbackUi.testimonials, ...(uiFromData as any).testimonials },
    successStats: {
      ...fallbackUi.successStats,
      ...(uiFromData as any).successStats,
      stats: (uiFromData as any).successStats?.stats || fallbackUi.successStats.stats,
    },
    cta: { ...fallbackUi.cta, ...(uiFromData as any).cta },
  };
  return (
    <>
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        description={data.hero.description}
        size="medium"
      />

      {/* Results Section */}
      <section className="pt-14 pb-20 bg-white -mt-8 sm:-mt-10 lg:-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={ui.results.subtitle}
            title={data.results.title}
            titlePath="results.title"
            subtitlePath="ui.results.subtitle"
            description={ui.results.description}
            descriptionPath="ui.results.description"
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
            subtitle={ui.distinctions.subtitle}
            title={ui.distinctions.title}
            description={ui.distinctions.description}
            subtitlePath="ui.distinctions.subtitle"
            titlePath="ui.distinctions.title"
            descriptionPath="ui.distinctions.description"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.distinctions.map((distinction, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 flex items-start gap-4 shadow-sm hover:shadow-lg transition-shadow relative group/dist"
              >
                {isEditing && (
                  <button
                    onClick={() => removeDistinction(index)}
                    className="absolute top-3 right-3 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover/dist:opacity-100 transition-opacity hover:bg-red-700 shadow z-10"
                    title="Supprimer cette distinction"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-amber-200">
                  <EditableImage
                    path={`distinctions.${index}.image`}
                    src={(distinction as any).image || '/logo-vf.svg'}
                    alt={distinction.title}
                    folder="excellence"
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover"
                  />
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
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-amber-700">
                    <Star className="w-3.5 h-3.5" />
                    Photo modifiable en mode édition
                  </div>
                </div>
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={addDistinction}
                className="px-5 py-2.5 rounded-xl border-2 border-dashed border-amber-300 bg-white flex items-center gap-2 text-amber-600 hover:border-amber-500 transition-colors font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                Ajouter une distinction
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Alumni & Testimonials Combined */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={ui.alumni.subtitle}
            title={ui.alumni.title}
            description={ui.alumni.description}
            subtitlePath="ui.alumni.subtitle"
            titlePath="ui.alumni.title"
            descriptionPath="ui.alumni.description"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.alumni.map((alum, index) => {
              const testimonial = data.testimonials.find(t => t.author === alum.name);
              return (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all group flex flex-col relative"
                >
                  {isEditing && (
                    <button
                      onClick={() => removeAlumni(index)}
                      className="absolute top-3 right-3 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow z-10"
                      title="Supprimer cet alumni"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-200 flex-shrink-0">
                      <EditableImage
                        path={`alumni.${index}.image`}
                        src={(alum as any).image || '/logo-vf.svg'}
                        alt={alum.name}
                        folder="excellence"
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <EditableText as="h3" path={`alumni.${index}.name`} value={alum.name} className="font-bold text-gray-900" />
                      <div className="text-sm text-blue-800">
                        <EditableText as="span" path="ui.alumni.promotionLabel" value={ui.alumni.promotionLabel} />{' '}
                        <EditableText as="span" path={`alumni.${index}.promotion`} value={alum.promotion} />
                      </div>
                    </div>
                  </div>
                  <EditableText
                    as="p"
                    multiline
                    path={`alumni.${index}.achievement`}
                    value={alum.achievement}
                    className="text-gray-600 mb-3"
                  />
                  {testimonial && (
                    <div className="mt-auto pt-4 border-t border-gray-200">
                      <Quote className="w-5 h-5 text-blue-400 mb-2" />
                      <p className="text-gray-700 text-sm italic leading-relaxed">
                        {testimonial.quote}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {isEditing && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={addAlumni}
                className="px-5 py-2.5 rounded-xl border-2 border-dashed border-blue-300 bg-white flex items-center gap-2 text-blue-600 hover:border-blue-600 transition-colors font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                Ajouter un ancien élève
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ExcellenceContent;
