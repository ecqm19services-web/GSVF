import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/ui/Hero';
import ContactForm from '@/components/forms/ContactForm';
import { contactContent, siteConfig } from '@/data/content';
import { 
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <Layout>
      <Hero
        title={contactContent.hero.title}
        subtitle={contactContent.hero.subtitle}
        description={contactContent.hero.description}
        size="medium"
      />

      {/* Contact Info & Form */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Nos coordonnées</h2>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{contactContent.info.address.title}</h3>
                    {contactContent.info.address.lines.map((line, index) => (
                      <p key={index} className="text-gray-600">{line}</p>
                    ))}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{contactContent.info.phone.title}</h3>
                    {contactContent.info.phone.numbers.map((number, index) => (
                      <a 
                        key={index} 
                        href={`tel:${number}`}
                        className="block text-gray-600 hover:text-blue-800 transition-colors"
                      >
                        {number}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{contactContent.info.email.title}</h3>
                    {contactContent.info.email.addresses.map((email, index) => (
                      <a 
                        key={index} 
                        href={`mailto:${email}`}
                        className="block text-gray-600 hover:text-blue-800 transition-colors"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{contactContent.info.hours.title}</h3>
                    {contactContent.info.hours.schedule.map((time, index) => (
                      <p key={index} className="text-gray-600">{time}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Suivez-nous</h3>
                <div className="flex gap-3">
                  {Object.entries(siteConfig.socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Envoyez-nous un message</h2>
                <p className="text-gray-600 mb-8">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Contacts par département
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactContent.departments.map((dept, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-gray-900 mb-4">{dept.name}</h3>
                <div className="space-y-2">
                  <a 
                    href={`mailto:${dept.email}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-800 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {dept.email}
                  </a>
                  <a 
                    href={`tel:${dept.phone}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-800 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {dept.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Comment nous trouver
          </h2>
          
          <div className="aspect-[21/9] bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <p className="text-blue-700 font-medium">
                Boulevard de la République, Grand-Bassam
              </p>
              <a 
                href="https://maps.google.com/?q=Grand-Bassam,Côte+d'Ivoire"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-blue-800 hover:text-blue-700 font-medium"
              >
                Ouvrir dans Google Maps
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Planifiez une visite
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Venez découvrir notre campus et rencontrer notre équipe pédagogique.
          </p>
          <a
            href="/visite"
            className="inline-flex items-center gap-2 bg-white text-blue-800 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Visite virtuelle
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
