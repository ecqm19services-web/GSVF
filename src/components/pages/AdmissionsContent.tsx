import React from 'react';
import Hero from '@/components/ui/Hero';
import SectionTitle from '@/components/ui/SectionTitle';
import AdmissionsForm from '@/components/forms/AdmissionsForm';
import { admissionsContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';
import { FileText, Calendar, CheckCircle, Info, ArrowRight, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdmissionsContent: React.FC = () => {
  const { value: admissionsData } = usePageJsonContent('admissions', admissionsContent);
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
          <SectionTitle subtitle="Processus" title="Les étapes d'admission" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admissionsData.process.map((step, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-lg">{step.step}</div>
                <div className="pt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="Candidature" title="Demande d'admission" />
          <div className="bg-gray-50 rounded-2xl p-8">
            <AdmissionsForm />
          </div>
        </div>
      </section>
      <section className="py-20 bg-orange-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Des questions ?</h2>
          <p className="text-xl text-orange-100 mb-10">Notre équipe est à votre disposition.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-orange-900 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-colors">
            Nous contacter <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default AdmissionsContent;
