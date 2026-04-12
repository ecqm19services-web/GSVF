import React from 'react';
import Hero from '@/components/ui/Hero';
import ContactForm from '@/components/forms/ContactForm';
import { contactContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

type ContactData = typeof contactContent;

const ContactContent: React.FC = () => {
  const { value: data } = usePageJsonContent<ContactData>('contact', contactContent);
  const fallbackUi = (contactContent as any).ui;
  const uiFromData = (data as any).ui || {};
  const ui = {
    ...fallbackUi,
    ...uiFromData,
    form: { ...fallbackUi.form, ...(uiFromData as any).form },
  };
  return (
    <>
      <Hero title={data.hero.title} subtitle={data.hero.subtitle} description={data.hero.description} backgroundImage={(data.hero as any).backgroundImage || undefined} heroImagePath="hero.backgroundImage" size="medium" />
      <section className="pt-12 pb-20 bg-white -mt-10 sm:-mt-12 lg:-mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <EditableText as="h2" path="ui.coordinatesTitle" value={ui.coordinatesTitle} className="text-2xl font-bold text-gray-900 mb-8" />
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><MapPin className="w-6 h-6 text-blue-800" /></div>
                  <div><EditableText as="h3" path="info.address.title" value={data.info.address.title} className="font-semibold text-gray-900 mb-1" />{data.info.address.lines.map((line, i) => <EditableText key={i} as="p" path={`info.address.lines.${i}`} value={line} className="text-gray-600" />)}</div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><Phone className="w-6 h-6 text-blue-800" /></div>
                  <div><EditableText as="h3" path="info.phone.title" value={data.info.phone.title} className="font-semibold text-gray-900 mb-1" />{data.info.phone.numbers.map((num, i) => <a key={i} href={`tel:${num}`} className="block text-gray-600 hover:text-blue-800"><EditableText as="span" path={`info.phone.numbers.${i}`} value={num} /></a>)}</div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><Mail className="w-6 h-6 text-blue-800" /></div>
                  <div><EditableText as="h3" path="info.email.title" value={data.info.email.title} className="font-semibold text-gray-900 mb-1" />{data.info.email.addresses.map((email, i) => <a key={i} href={`mailto:${email}`} className="block text-gray-600 hover:text-blue-800"><EditableText as="span" path={`info.email.addresses.${i}`} value={email} /></a>)}</div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><Clock className="w-6 h-6 text-blue-800" /></div>
                  <div><EditableText as="h3" path="info.hours.title" value={data.info.hours.title} className="font-semibold text-gray-900 mb-1" />{data.info.hours.schedule.map((time, i) => <EditableText key={i} as="p" path={`info.hours.schedule.${i}`} value={time} className="text-gray-600" />)}</div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-2xl p-8">
                <EditableText as="h2" path="ui.form.title" value={ui.form.title} className="text-2xl font-bold text-gray-900 mb-2" />
                <EditableText as="p" multiline path="ui.form.description" value={ui.form.description} className="text-gray-600 mb-8" />
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
