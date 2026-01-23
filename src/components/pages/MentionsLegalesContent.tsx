import React from 'react';
import Hero from '@/components/ui/Hero';
import { mentionsLegalesContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';

type MentionsLegalesData = {
  hero: { title: string; subtitle?: string; description?: string };
  sections: { title: string; content: string }[];
};

const MentionsLegalesContent: React.FC = () => {
  const { value: data } = usePageJsonContent<MentionsLegalesData>('mentions-legales', mentionsLegalesContent);

  return (
    <>
      <Hero title={data.hero.title} subtitle={data.hero.subtitle} description={data.hero.description} size="medium" />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {data.sections.map((section, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                <EditableText
                  as="h2"
                  path={`sections.${index}.title`}
                  value={section.title}
                  className="text-2xl font-bold text-gray-900 mb-4"
                />
                <EditableText
                  as="p"
                  multiline
                  path={`sections.${index}.content`}
                  value={section.content}
                  className="text-gray-700 leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default MentionsLegalesContent;
