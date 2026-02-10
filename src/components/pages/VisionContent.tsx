import React from 'react';
import Hero from '@/components/ui/Hero';
import SectionTitle from '@/components/ui/SectionTitle';
import { visionContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';
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
  const ui = (data as any).ui || (visionContent as any).ui;
  return (
    <>
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        description={data.hero.description}
        size="medium"
      />

      {/* Vision & Mission */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Dove overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url(/images/vision/doves.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'contain',
            opacity: 0.5,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
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
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                    <EditableText as="span" path={`commitment.points.${index}`} value={point} className="text-white" />
                  </li>
                ))}
              </ul>
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
