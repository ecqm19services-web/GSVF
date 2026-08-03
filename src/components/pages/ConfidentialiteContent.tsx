import React from 'react';
import Hero from '@/components/ui/Hero';
import { confidentialiteContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';

type ConfidentialiteData = {
  hero: { title: string; subtitle?: string; description?: string };
  sections: { title: string; content: string }[];
};

const ConfidentialiteContent: React.FC = () => {
  const { value: data } = usePageJsonContent<ConfidentialiteData>('confidentialite', confidentialiteContent);

  return (
    <>
      <Hero title={data.hero.title} subtitle={data.hero.subtitle} description={data.hero.description} backgroundImage={(data.hero as { backgroundImage?: string }).backgroundImage || undefined} backgroundColor={(data.hero as { backgroundColor?: string }).backgroundColor || undefined} heroImagePath="hero.backgroundImage" heroColorPath="hero.backgroundColor" defaultBackgroundColor="bg-gradient-to-br from-orange-950 via-orange-900 to-orange-950" size="medium" />

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

export default ConfidentialiteContent;
