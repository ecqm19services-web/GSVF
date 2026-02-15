import React from 'react';
import Hero from '@/components/ui/Hero';
import SectionTitle from '@/components/ui/SectionTitle';
import CareerApplicationForm from '@/components/forms/CareerApplicationForm';

const CareerApplicationContent: React.FC = () => {
  return (
    <>
      <Hero
        title="Candidature"
        subtitle="Postulez en ligne"
        description="Votre candidature est liée automatiquement à l'offre sélectionnée."
        size="small"
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Formulaire"
            title="Envoyer votre candidature"
            description="Complétez vos informations puis envoyez votre dossier de motivation."
          />

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <CareerApplicationForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default CareerApplicationContent;
