import React from 'react';
import Hero from '@/components/ui/Hero';
import ContactForm from '@/components/forms/ContactForm';
import { contactContent, siteConfig } from '@/data/content';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';

const ContactContent: React.FC = () => {
  return (
    <>
      <Hero title={contactContent.hero.title} subtitle={contactContent.hero.subtitle} description={contactContent.hero.description} size="medium" />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Nos coordonnées</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><MapPin className="w-6 h-6 text-blue-800" /></div>
                  <div><h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>{contactContent.info.address.lines.map((line, i) => <p key={i} className="text-gray-600">{line}</p>)}</div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><Phone className="w-6 h-6 text-blue-800" /></div>
                  <div><h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>{contactContent.info.phone.numbers.map((num, i) => <a key={i} href={`tel:${num}`} className="block text-gray-600 hover:text-blue-800">{num}</a>)}</div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><Mail className="w-6 h-6 text-blue-800" /></div>
                  <div><h3 className="font-semibold text-gray-900 mb-1">Email</h3>{contactContent.info.email.addresses.map((email, i) => <a key={i} href={`mailto:${email}`} className="block text-gray-600 hover:text-blue-800">{email}</a>)}</div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><Clock className="w-6 h-6 text-blue-800" /></div>
                  <div><h3 className="font-semibold text-gray-900 mb-1">Horaires</h3>{contactContent.info.hours.schedule.map((time, i) => <p key={i} className="text-gray-600">{time}</p>)}</div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Envoyez-nous un message</h2>
                <p className="text-gray-600 mb-8">Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.</p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactContent;
