import React from 'react';
import Hero from '@/components/ui/Hero';
import SectionTitle from '@/components/ui/SectionTitle';
import { visionContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';
import { useEditSession } from '@/contexts/EditSessionContext';
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
  Plus,
  Trash2,
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

type VisionData = typeof visionContent;

const VisionContent: React.FC = () => {
  const { value: data } = usePageJsonContent<VisionData>('vision', visionContent);
  const editSession = useEditSession<VisionData>();
  const isEditing = !!editSession?.isEditing;
  const ui = (data as any).ui || (visionContent as any).ui;

  const addValue = () => {
    if (!editSession) return;
    const current = (data as any).values || [];
    editSession.updateAtPath('values', [...current, { icon: 'star', title: 'Nouvelle valeur', description: 'Description de cette valeur.' }]);
  };
  const removeValue = (i: number) => {
    if (!editSession) return;
    const val = ((data as any).values || [])[i];
    if (!confirm(`Supprimer "${val?.title || `Valeur ${i + 1}`}" ?\n\nOK pour confirmer, Annuler pour annuler.`)) return;
    editSession.updateAtPath('values', ((data as any).values || []).filter((_: unknown, idx: number) => idx !== i));
  };

  const addPoint = () => {
    if (!editSession) return;
    const current = (data as any).commitment?.points || [];
    editSession.updateAtPath('commitment.points', [...current, 'Nouveau point d\'engagement.']);
  };
  const removePoint = (i: number) => {
    if (!editSession) return;
    if (!confirm(`Supprimer ce point d'engagement ?\n\nOK pour confirmer, Annuler pour annuler.`)) return;
    editSession.updateAtPath('commitment.points', ((data as any).commitment?.points || []).filter((_: unknown, idx: number) => idx !== i));
  };

  return (
    <>
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        description={data.hero.description}
        size="medium"
      />

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-10">
              <div className="w-16 h-16 bg-blue-800 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <EditableText
                as="h2"
                path="vision.title"
                value={data.vision.title}
                className="text-3xl font-bold text-gray-900 mb-4"
              />
              <EditableText
                as="p"
                multiline
                path="vision.content"
                value={data.vision.content}
                className="text-lg text-gray-700 leading-relaxed"
              />
            </div>

            {/* Mission */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-10">
              <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <Compass className="w-8 h-8 text-white" />
              </div>
              <EditableText
                as="h2"
                path="mission.title"
                value={data.mission.title}
                className="text-3xl font-bold text-gray-900 mb-4"
              />
              <EditableText
                as="p"
                multiline
                path="mission.content"
                value={data.mission.content}
                className="text-lg text-gray-700 leading-relaxed"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={ui.values.subtitle}
            title={ui.values.title}
            description={ui.values.description}
            subtitlePath="ui.values.subtitle"
            titlePath="ui.values.title"
            descriptionPath="ui.values.description"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.values.map((value, index) => {
              const Icon = iconMap[value.icon] || Star;
              const colors = [
                'from-blue-600 to-blue-800',
                'from-blue-500 to-blue-600',
                'from-amber-500 to-amber-600',
                'from-rose-500 to-rose-600',
                'from-purple-500 to-purple-600',
                'from-cyan-500 to-cyan-600'
              ];
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group relative"
                >
                  {isEditing && (
                    <button
                      onClick={() => removeValue(index)}
                      className="absolute top-3 right-3 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow z-10"
                      title="Supprimer cette valeur"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <EditableText
                    as="h3"
                    path={`values.${index}.title`}
                    value={value.title}
                    className="text-xl font-bold text-gray-900 mb-3"
                  />
                  <EditableText
                    as="p"
                    multiline
                    path={`values.${index}.description`}
                    value={value.description}
                    className="text-gray-600 leading-relaxed"
                  />
                </div>
              );
            })}
          </div>
          {isEditing && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={addValue}
                className="px-5 py-2.5 rounded-xl border-2 border-dashed border-blue-300 bg-white flex items-center gap-2 text-blue-600 hover:border-blue-600 transition-colors font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                Ajouter une valeur
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Commitment */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-white/10 text-blue-200 rounded-full text-sm font-semibold mb-6">
                <EditableText as="span" path="ui.commitment.badge" value={ui.commitment.badge} />
              </span>
              <EditableText
                as="h2"
                path="commitment.title"
                value={data.commitment.title}
                className="text-3xl md:text-4xl font-bold text-white mb-6"
              />
              <EditableText
                as="p"
                multiline
                path="ui.commitment.intro"
                value={ui.commitment.intro}
                className="text-lg text-blue-100 mb-8 leading-relaxed"
              />
              <ul className="space-y-4">
                {data.commitment.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 group/point">
                    <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                    <EditableText as="span" path={`commitment.points.${index}`} value={point} className="text-white flex-1" />
                    {isEditing && (
                      <button
                        onClick={() => removePoint(index)}
                        className="p-1 bg-red-600 text-white rounded-full opacity-0 group-hover/point:opacity-100 transition-opacity hover:bg-red-700 flex-shrink-0"
                        title="Supprimer ce point"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {isEditing && (
                <button
                  onClick={addPoint}
                  className="mt-4 px-4 py-2 rounded-lg border-2 border-dashed border-blue-400 flex items-center gap-2 text-blue-300 hover:border-blue-200 hover:text-blue-100 transition-colors text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un point
                </button>
              )}
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-700 to-blue-800 p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-16 h-16 text-white" />
                  </div>
                  <EditableText
                    as="p"
                    path="ui.commitment.objectiveTitle"
                    value={ui.commitment.objectiveTitle}
                    className="text-2xl font-bold text-white mb-2"
                  />
                  <EditableText
                    as="p"
                    path="ui.commitment.objectiveSubtitle"
                    value={ui.commitment.objectiveSubtitle}
                    className="text-blue-200"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-6">
                <div className="text-center">
                  <EditableText
                    as="div"
                    path="ui.commitment.stats.value"
                    value={ui.commitment.stats.value}
                    className="text-3xl font-bold text-blue-800"
                  />
                  <EditableText
                    as="div"
                    path="ui.commitment.stats.label"
                    value={ui.commitment.stats.label}
                    className="text-sm text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EditableText
            as="blockquote"
            multiline
            path="ui.quote.text"
            value={ui.quote.text}
            className="text-2xl md:text-3xl font-medium text-gray-900 italic mb-8"
          />
          <EditableText as="cite" path="ui.quote.author" value={ui.quote.author} className="text-gray-600" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EditableText
            as="h2"
            path="ui.cta.title"
            value={ui.cta.title}
            className="text-3xl font-bold text-gray-900 mb-6"
          />
          <EditableText
            as="p"
            multiline
            path="ui.cta.description"
            value={ui.cta.description}
            className="text-lg text-gray-600 mb-10"
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/admissions"
              className="inline-flex items-center justify-center gap-2 bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <EditableText as="span" path="ui.cta.primary" value={ui.cta.primary} />
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/histoire"
              className="inline-flex items-center justify-center gap-2 border-2 border-blue-800 text-blue-800 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              <EditableText as="span" path="ui.cta.secondary" value={ui.cta.secondary} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default VisionContent;
