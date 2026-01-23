import React from 'react';
import Hero from '@/components/ui/Hero';
import { histoireContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';
import { 
  Star,
  ArrowRight,
  User,
  Quote
} from 'lucide-react';
import { Link } from 'react-router-dom';

type HistoireData = typeof histoireContent;

const HistoireContent: React.FC = () => {
  const { value: data } = usePageJsonContent<HistoireData>('histoire', histoireContent);
  const fallbackUi = (histoireContent as any).ui;
  const uiFromData = (data as any).ui || {};
  const ui = {
    ...fallbackUi,
    ...uiFromData,
    founders: { ...fallbackUi.founders, ...(uiFromData as any).founders },
    quote: { ...fallbackUi.quote, ...(uiFromData as any).quote },
    stats: (uiFromData as any).stats || fallbackUi.stats,
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

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditableText
            as="p"
            multiline
            path="intro"
            value={data.intro}
            className="text-xl text-gray-700 leading-relaxed text-center"
          />
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditableText
            as="h2"
            path="ui.timelineTitle"
            value={ui.timelineTitle}
            className="text-3xl font-bold text-gray-900 text-center mb-16"
          />

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200 hidden md:block" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {data.timeline.map((item, index) => (
                <div 
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow ${
                      item.milestone ? 'border-2 border-blue-600' : 'border border-gray-100'
                    }`}>
                      <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                        <EditableText
                          as="span"
                          path={`timeline.${index}.year`}
                          value={item.year}
                          className="text-2xl font-bold text-blue-800"
                        />
                        {item.milestone && (
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        )}
                      </div>
                      <EditableText
                        as="h3"
                        path={`timeline.${index}.title`}
                        value={item.title}
                        className="text-xl font-bold text-gray-900 mb-2"
                      />
                      <EditableText
                        as="p"
                        multiline
                        path={`timeline.${index}.description`}
                        value={item.description}
                        className="text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex">
                    <div className={`w-6 h-6 rounded-full border-4 border-white shadow ${
                      item.milestone ? 'bg-blue-800' : 'bg-blue-400'
                    }`} />
                  </div>

                  {/* Empty space for alignment */}
                  <div className="hidden md:block w-5/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditableText
            as="h2"
            path="ui.founders.title"
            value={ui.founders.title}
            className="text-3xl font-bold text-gray-900 text-center mb-4"
          />
          <EditableText
            as="p"
            multiline
            path="ui.founders.description"
            value={ui.founders.description}
            className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto"
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {data.founders.map((founder, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mb-6">
                  <User className="w-12 h-12 text-white" />
                </div>
                <EditableText
                  as="h3"
                  path={`founders.${index}.name`}
                  value={founder.name}
                  className="text-xl font-bold text-gray-900 mb-1"
                />
                <EditableText
                  as="p"
                  path={`founders.${index}.role`}
                  value={founder.role}
                  className="text-blue-800 font-medium mb-4"
                />
                <EditableText
                  as="p"
                  multiline
                  path={`founders.${index}.bio`}
                  value={founder.bio}
                  className="text-gray-600"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Quote className="w-16 h-16 text-blue-400 mx-auto mb-8" />
          <EditableText
            as="blockquote"
            multiline
            path="ui.quote.text"
            value={ui.quote.text}
            className="text-2xl md:text-3xl font-medium text-white italic mb-8"
          />
          <EditableText as="cite" path="ui.quote.author" value={ui.quote.author} className="text-blue-200" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {ui.stats.map((stat: any, index: number) => (
              <div key={index} className="text-center">
                <EditableText
                  as="div"
                  path={`ui.stats.${index}.value`}
                  value={stat.value}
                  className="text-4xl md:text-5xl font-bold text-blue-800 mb-2"
                />
                <EditableText
                  as="div"
                  path={`ui.stats.${index}.label`}
                  value={stat.label}
                  className="text-gray-600"
                />
              </div>
            ))}
          </div>
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
              to="/excellence"
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

export default HistoireContent;
