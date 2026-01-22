import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/ui/Hero';
import SectionTitle from '@/components/ui/SectionTitle';
import AdmissionsForm from '@/components/forms/AdmissionsForm';
import { admissionsContent } from '@/data/content';
import { 
  FileText,
  Calendar,
  CheckCircle,
  Info,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdmissionsPage: React.FC = () => {
  return (
    <Layout>
      <Hero
        title={admissionsContent.hero.title}
        subtitle={admissionsContent.hero.subtitle}
        description={admissionsContent.hero.description}
        size="medium"
      />

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xl text-gray-700 leading-relaxed text-center">
            {admissionsContent.intro}
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Processus"
            title="Les étapes d'admission"
            description="Un processus simple et transparent pour rejoindre notre établissement."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admissionsContent.process.map((step, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow relative"
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {step.step}
                </div>
                <div className="pt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents Required */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Documents */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-800" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Documents requis</h2>
              </div>
              <ul className="space-y-4">
                {admissionsContent.documents.map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Calendar */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{admissionsContent.calendar.title}</h2>
              </div>
              <div className="space-y-4">
                {admissionsContent.calendar.dates.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700">{item.event}</span>
                    <span className="text-blue-800 font-medium">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fees */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Frais de scolarité"
            title="Investir dans l'avenir"
            description={admissionsContent.fees.note}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {admissionsContent.fees.cycles.map((cycle, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cycle.name}</h3>
                <p className="text-blue-800 font-medium">{cycle.range}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-800 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Les frais incluent :</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {admissionsContent.fees.includes.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Candidature"
            title="Demande d'admission"
            description="Remplissez ce formulaire pour démarrer le processus d'admission."
          />

          <div className="bg-gray-50 rounded-2xl p-8">
            <AdmissionsForm />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Des questions sur les admissions ?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Notre équipe est à votre disposition pour vous accompagner.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
            <a
              href="tel:+22527213045 69"
              className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white px-6 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
            >
              <Phone className="w-5 h-5" />
              +225 27 21 30 45 69
            </a>
            <a
              href="mailto:admissions@visionfuture.ci"
              className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white px-6 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
            >
              <Mail className="w-5 h-5" />
              admissions@visionfuture.ci
            </a>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-blue-800 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Nous contacter
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default AdmissionsPage;
