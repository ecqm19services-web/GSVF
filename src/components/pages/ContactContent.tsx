import React from 'react';
import Hero from '@/components/ui/Hero';
import ContactForm from '@/components/forms/ContactForm';
import { contactContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';
import { useEditSession } from '@/contexts/EditSessionContext';
import { MapPin, Phone, Mail, Clock, Plus, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

type ContactData = typeof contactContent;

const ContactContent: React.FC = () => {
  const { value: data } = usePageJsonContent<ContactData>('contact', contactContent);
  const editSession = useEditSession<ContactData>();
  const isEditing = !!editSession?.isEditing;
  const fallbackUi = contactContent.ui;
  const uiFromData = (data.ui || {}) as typeof contactContent.ui;
  const ui = {
    ...fallbackUi,
    ...uiFromData,
    form: { ...fallbackUi.form, ...uiFromData.form },
  };
  return (
    <>
      <Hero title={data.hero.title} subtitle={data.hero.subtitle} description={data.hero.description} backgroundImage={(data.hero as { backgroundImage?: string }).backgroundImage || undefined} heroImagePath="hero.backgroundImage" heroColorPath="hero.backgroundColor" defaultBackgroundColor="bg-gradient-to-br from-orange-950 via-orange-900 to-orange-950" size="medium" />

      {/* Bandeau "Suivre ma demande" */}
      <section className="bg-amber-50 border-b border-amber-200 py-3 -mt-10 sm:-mt-12 lg:-mt-14 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 text-sm">
          <Search className="w-4 h-4 text-amber-700" />
          <span className="text-amber-800">Vous avez déjà une référence ?</span>
          <Link to="/suivi" className="font-semibold text-amber-900 hover:text-amber-700 underline underline-offset-2 transition-colors">
            Suivre ma demande
          </Link>
        </div>
      </section>

      <section className="pt-12 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <EditableText as="h2" path="ui.coordinatesTitle" value={ui.coordinatesTitle} className="text-2xl font-bold text-gray-900 mb-8" />
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><MapPin className="w-6 h-6 text-blue-800" /></div>
                  <div className="flex-1">
                    <EditableText as="h3" path="info.address.title" value={data.info.address.title} className="font-semibold text-gray-900 mb-1" />
                    {data.info.address.lines.map((line, i) => (
                      <div key={i} className="flex items-center gap-1 group/adr">
                        <EditableText as="p" path={`info.address.lines.${i}`} value={line} className="text-gray-600 flex-1" />
                        {isEditing && (
                          <button onClick={() => { if(confirm('Supprimer cette ligne ?')) editSession?.updateAtPath('info.address.lines', data.info.address.lines.filter((_,j)=>j!==i)); }} className="p-1 text-red-500 opacity-0 group-hover/adr:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                        )}
                      </div>
                    ))}
                    {isEditing && <button onClick={() => editSession?.updateAtPath('info.address.lines', [...data.info.address.lines, 'Nouvelle ligne'])} className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"><Plus className="w-3 h-3" /> Ajouter</button>}
                  </div>
                </div>
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><Phone className="w-6 h-6 text-blue-800" /></div>
                  <div className="flex-1">
                    <EditableText as="h3" path="info.phone.title" value={data.info.phone.title} className="font-semibold text-gray-900 mb-1" />
                    {data.info.phone.numbers.map((num, i) => (
                      <div key={i} className="flex items-center gap-1 group/ph">
                        <a href={`tel:${num}`} className="block text-gray-600 hover:text-blue-800 flex-1"><EditableText as="span" path={`info.phone.numbers.${i}`} value={num} /></a>
                        {isEditing && (
                          <button onClick={() => { if(confirm('Supprimer ce numéro ?')) editSession?.updateAtPath('info.phone.numbers', data.info.phone.numbers.filter((_,j)=>j!==i)); }} className="p-1 text-red-500 opacity-0 group-hover/ph:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                        )}
                      </div>
                    ))}
                    {isEditing && <button onClick={() => editSession?.updateAtPath('info.phone.numbers', [...data.info.phone.numbers, '+225 00 00 00 00 00'])} className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"><Plus className="w-3 h-3" /> Ajouter</button>}
                  </div>
                </div>
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><Mail className="w-6 h-6 text-blue-800" /></div>
                  <div className="flex-1">
                    <EditableText as="h3" path="info.email.title" value={data.info.email.title} className="font-semibold text-gray-900 mb-1" />
                    {data.info.email.addresses.map((email, i) => (
                      <div key={i} className="flex items-center gap-1 group/em">
                        <a href={`mailto:${email}`} className="block text-gray-600 hover:text-blue-800 flex-1"><EditableText as="span" path={`info.email.addresses.${i}`} value={email} /></a>
                        {isEditing && (
                          <button onClick={() => { if(confirm('Supprimer cette adresse email ?')) editSession?.updateAtPath('info.email.addresses', data.info.email.addresses.filter((_,j)=>j!==i)); }} className="p-1 text-red-500 opacity-0 group-hover/em:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                        )}
                      </div>
                    ))}
                    {isEditing && <button onClick={() => editSession?.updateAtPath('info.email.addresses', [...data.info.email.addresses, 'email@exemple.com'])} className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"><Plus className="w-3 h-3" /> Ajouter</button>}
                  </div>
                </div>
                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><Clock className="w-6 h-6 text-blue-800" /></div>
                  <div className="flex-1">
                    <EditableText as="h3" path="info.hours.title" value={data.info.hours.title} className="font-semibold text-gray-900 mb-1" />
                    {data.info.hours.schedule.map((time, i) => (
                      <div key={i} className="flex items-center gap-1 group/hr">
                        <EditableText as="p" path={`info.hours.schedule.${i}`} value={time} className="text-gray-600 flex-1" />
                        {isEditing && (
                          <button onClick={() => { if(confirm('Supprimer cet horaire ?')) editSession?.updateAtPath('info.hours.schedule', data.info.hours.schedule.filter((_,j)=>j!==i)); }} className="p-1 text-red-500 opacity-0 group-hover/hr:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                        )}
                      </div>
                    ))}
                    {isEditing && <button onClick={() => editSession?.updateAtPath('info.hours.schedule', [...data.info.hours.schedule, 'Lun-Ven : 07h30 - 18h00'])} className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"><Plus className="w-3 h-3" /> Ajouter</button>}
                  </div>
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
