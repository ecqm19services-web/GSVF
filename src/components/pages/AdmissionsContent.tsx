import React from 'react';
import Hero from '@/components/ui/Hero';
import SectionTitle from '@/components/ui/SectionTitle';
import AdmissionsForm from '@/components/forms/AdmissionsForm';
import { admissionsContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdmissionsContent: React.FC = () => {
  const { value: admissionsData } = usePageJsonContent('admissions', admissionsContent);
  const fallbackUi = (admissionsContent as any).ui;
  const uiFromData = (admissionsData as any).ui || {};
  const ui = {
    ...fallbackUi,
    ...uiFromData,
    processSection: { ...fallbackUi.processSection, ...(uiFromData as any).processSection },
    applicationSection: { ...fallbackUi.applicationSection, ...(uiFromData as any).applicationSection },
    helpCta: { ...fallbackUi.helpCta, ...(uiFromData as any).helpCta },
  };
  return (
    <>
      <Hero title={admissionsData.hero.title} subtitle={admissionsData.hero.subtitle} description={admissionsData.hero.description} size="medium" />
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditableText
            as="p"
            multiline
            path="intro"
            value={admissionsData.intro}
            className="text-xl text-gray-700 leading-relaxed text-center"
          />
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={ui.processSection.subtitle}
            title={ui.processSection.title}
            subtitlePath="ui.processSection.subtitle"
            titlePath="ui.processSection.title"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admissionsData.process.map((step, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-lg">{step.step}</div>
                <div className="pt-4">
                  <EditableText
                    as="h3"
                    path={`process.${index}.title`}
                    value={step.title}
                    className="text-lg font-bold text-gray-900 mb-2"
                  />
                  <EditableText
                    as="p"
                    multiline
                    path={`process.${index}.description`}
                    value={step.description}
                    className="text-gray-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={ui.applicationSection.subtitle}
            title={ui.applicationSection.title}
            subtitlePath="ui.applicationSection.subtitle"
            titlePath="ui.applicationSection.title"
          />
          <div className="bg-gray-50 rounded-2xl p-8">
            <AdmissionsForm />
          </div>
        </div>
      </section>
      <section className="py-20 bg-orange-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EditableText as="h2" path="ui.helpCta.title" value={ui.helpCta.title} className="text-3xl font-bold text-white mb-6" />
          <EditableText as="p" multiline path="ui.helpCta.description" value={ui.helpCta.description} className="text-xl text-orange-100 mb-10" />
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-orange-900 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-colors">
            <EditableText as="span" path="ui.helpCta.button" value={ui.helpCta.button} /> <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default AdmissionsContent;
