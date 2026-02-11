import React, { useState } from 'react';
import Hero from '@/components/ui/Hero';
import SectionTitle from '@/components/ui/SectionTitle';
import AdmissionsForm from '@/components/forms/AdmissionsForm';
import { admissionsContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';
import { FileText, ClipboardList } from 'lucide-react';

type AdmissionTab = 'fiche' | 'etapes';

const AdmissionsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdmissionTab>('fiche');
  const { value: admissionsData } = usePageJsonContent('admissions', admissionsContent);
  const fallbackInfoSheet = (admissionsContent as any).infoSheet;
  const infoSheetFromData = (admissionsData as any).infoSheet || {};
  const infoSheet = {
    ...fallbackInfoSheet,
    ...infoSheetFromData,
    annexFees: { ...fallbackInfoSheet?.annexFees, ...(infoSheetFromData as any).annexFees },
    transport: { ...fallbackInfoSheet?.transport, ...(infoSheetFromData as any).transport },
    tuition: { ...fallbackInfoSheet?.tuition, ...(infoSheetFromData as any).tuition },
    extracurricular: { ...fallbackInfoSheet?.extracurricular, ...(infoSheetFromData as any).extracurricular },
    uniforms: { ...fallbackInfoSheet?.uniforms, ...(infoSheetFromData as any).uniforms },
    registrationFile: { ...fallbackInfoSheet?.registrationFile, ...(infoSheetFromData as any).registrationFile },
  };
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

      {/* Intro */}
      <section className="py-12 bg-white">
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

      {/* Tab Navigation */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0">
            <button
              onClick={() => setActiveTab('fiche')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'fiche'
                  ? 'border-blue-800 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              Fiche de renseignements
            </button>
            <button
              onClick={() => setActiveTab('etapes')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'etapes'
                  ? 'border-blue-800 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Étapes & Demande d'admission
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      {activeTab === 'fiche' && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              subtitle={infoSheet.subtitle}
              title={infoSheet.title}
              description={infoSheet.disclaimer}
              subtitlePath="infoSheet.subtitle"
              titlePath="infoSheet.title"
              descriptionPath="infoSheet.disclaimer"
            />

            {/* 1. Écolage — Full width on top */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <EditableText as="h3" path="infoSheet.tuition.title" value={infoSheet.tuition.title} className="text-lg font-bold text-gray-900 mb-4" />
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-blue-800 text-white">
                      <th className="text-left py-3 px-4 font-bold border border-blue-700"> </th>
                      {infoSheet.tuition.columns.map((col: string, i: number) => (
                        <th key={i} className="text-left py-3 px-4 font-bold border border-blue-700 whitespace-nowrap">
                          <EditableText as="span" path={`infoSheet.tuition.columns.${i}`} value={col} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {infoSheet.tuition.rows.map((row: any, rowIndex: number) => {
                      const isKeyRow = ['Écolage', 'Inscription'].includes(row.label);
                      return (
                      <tr key={rowIndex} className={isKeyRow ? 'bg-blue-50' : rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className={`py-2.5 px-4 border border-gray-300 whitespace-nowrap ${isKeyRow ? 'font-bold text-blue-900' : 'font-semibold text-gray-900'}`}>
                          <EditableText as="span" path={`infoSheet.tuition.rows.${rowIndex}.label`} value={row.label} />
                        </td>
                        {row.values.map((v: string, colIndex: number) => (
                          <td key={colIndex} className={`py-2.5 px-4 border border-gray-300 whitespace-nowrap ${isKeyRow ? 'font-semibold text-blue-900' : 'text-gray-700'}`}>
                            <EditableText as="span" path={`infoSheet.tuition.rows.${rowIndex}.values.${colIndex}`} value={v} />
                          </td>
                        ))}
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <EditableText as="p" multiline path="infoSheet.tuition.note" value={infoSheet.tuition.note} className="text-sm text-gray-600 mt-4" />

              {/* Frais annexes inline */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <EditableText as="h4" path="infoSheet.annexFees.title" value={infoSheet.annexFees.title} className="text-lg font-bold text-gray-900 mb-3" />
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-blue-800 text-white">
                        <th className="text-left py-3 px-4 font-bold border border-blue-700"> </th>
                        {infoSheet.annexFees.columns.map((col: string, i: number) => (
                          <th key={i} className="text-left py-3 px-4 font-bold border border-blue-700 whitespace-nowrap">
                            <EditableText as="span" path={`infoSheet.annexFees.columns.${i}`} value={col} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {infoSheet.annexFees.rows.map((row: any, rowIndex: number) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="py-2.5 px-4 font-semibold text-gray-900 border border-gray-300 whitespace-nowrap">
                            <EditableText as="span" path={`infoSheet.annexFees.rows.${rowIndex}.label`} value={row.label} />
                          </td>
                          {row.values.map((v: string, colIndex: number) => (
                            <td key={colIndex} className="py-2.5 px-4 text-gray-700 border border-gray-300 whitespace-nowrap">
                              <EditableText as="span" path={`infoSheet.annexFees.rows.${rowIndex}.values.${colIndex}`} value={v} />
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="bg-blue-800 text-white">
                        <td className="py-2.5 px-4 font-bold border border-blue-700 whitespace-nowrap">
                          <EditableText as="span" path="infoSheet.annexFees.totalLabel" value={infoSheet.annexFees.totalLabel} />
                        </td>
                        {infoSheet.annexFees.totals.map((t: string, i: number) => (
                          <td key={i} className="py-2.5 px-4 font-bold border border-blue-700 whitespace-nowrap">
                            <EditableText as="span" path={`infoSheet.annexFees.totals.${i}`} value={t} />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 2. Dossier à fournir + Tenue scolaire — Side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-sm border-t-4 border-amber-500 overflow-hidden">
                <div className="bg-amber-50 px-6 py-4">
                  <EditableText as="h3" path="infoSheet.registrationFile.title" value={infoSheet.registrationFile.title} className="text-lg font-bold text-amber-900" />
                </div>
                <div className="p-6 space-y-4">
                  {infoSheet.registrationFile.sections.map((sec: any, sIndex: number) => (
                    <div key={sIndex} className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
                      <EditableText as="h4" multiline path={`infoSheet.registrationFile.sections.${sIndex}.title`} value={sec.title} className="font-semibold text-amber-900 mb-2" />
                      <ul className="space-y-1.5">
                        {sec.items.map((it: string, i: number) => (
                          <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                            <EditableText as="span" multiline path={`infoSheet.registrationFile.sections.${sIndex}.items.${i}`} value={it} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="mt-4 space-y-2">
                    {infoSheet.registrationFile.notes.map((n: string, i: number) => (
                      <EditableText key={i} as="p" multiline path={`infoSheet.registrationFile.notes.${i}`} value={n} className="text-sm text-red-600 font-medium" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border-t-4 border-purple-500 overflow-hidden">
                <div className="bg-purple-50 px-6 py-4">
                  <EditableText as="h3" path="infoSheet.uniforms.title" value={infoSheet.uniforms.title} className="text-lg font-bold text-purple-900" />
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-pink-50/50 rounded-xl p-4 border border-pink-100">
                    <EditableText as="h4" path="infoSheet.uniforms.girlsTitle" value={infoSheet.uniforms.girlsTitle} className="font-semibold text-pink-700 mb-2" />
                    <ul className="space-y-1.5">
                      {infoSheet.uniforms.girls.map((it: string, i: number) => (
                        <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 flex-shrink-0" />
                          <EditableText as="span" multiline path={`infoSheet.uniforms.girls.${i}`} value={it} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                    <EditableText as="h4" path="infoSheet.uniforms.boysTitle" value={infoSheet.uniforms.boysTitle} className="font-semibold text-blue-700 mb-2" />
                    <ul className="space-y-1.5">
                      {infoSheet.uniforms.boys.map((it: string, i: number) => (
                        <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          <EditableText as="span" multiline path={`infoSheet.uniforms.boys.${i}`} value={it} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Transport, Activités extrascolaires, Services */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border-t-4 border-teal-500 overflow-hidden">
                <div className="bg-teal-50 px-6 py-4">
                  <EditableText as="h3" path="infoSheet.transport.title" value={infoSheet.transport.title} className="text-lg font-bold text-teal-900" />
                </div>
                <div className="p-6 space-y-3">
                  {infoSheet.transport.routes.map((route: any, i: number) => (
                    <div key={i} className="bg-teal-50/50 rounded-xl p-3 border border-teal-100">
                      <EditableText as="div" multiline path={`infoSheet.transport.routes.${i}.label`} value={route.label} className="text-teal-900 font-medium text-sm" />
                      <div className="text-teal-700 text-sm mt-1 font-semibold">
                        <EditableText as="span" path={`infoSheet.transport.routes.${i}.amount`} value={route.amount} />{' '}
                        <EditableText as="span" path={`infoSheet.transport.routes.${i}.currency`} value={route.currency} />{' / '}
                        <EditableText as="span" path={`infoSheet.transport.routes.${i}.period`} value={route.period} />
                      </div>
                    </div>
                  ))}
                  <div className="bg-orange-50/50 rounded-xl p-3 border border-orange-100">
                    <EditableText as="div" path="infoSheet.transport.canteen.label" value={infoSheet.transport.canteen.label} className="text-orange-900 font-medium text-sm" />
                    <div className="text-orange-700 text-sm mt-1 font-semibold">
                      <EditableText as="span" path="infoSheet.transport.canteen.amount" value={infoSheet.transport.canteen.amount} />{' '}
                      <EditableText as="span" path="infoSheet.transport.canteen.currency" value={infoSheet.transport.canteen.currency} />{' / '}
                      <EditableText as="span" path="infoSheet.transport.canteen.period" value={infoSheet.transport.canteen.period} />
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {infoSheet.transport.notes.map((n: string, i: number) => (
                      <EditableText key={i} as="p" multiline path={`infoSheet.transport.notes.${i}`} value={n} className="text-xs text-red-500 font-medium" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border-t-4 border-rose-500 overflow-hidden">
                <div className="bg-rose-50 px-6 py-4">
                  <EditableText as="h3" path="infoSheet.extracurricular.title" value={infoSheet.extracurricular.title} className="text-lg font-bold text-rose-900" />
                </div>
                <div className="p-6 space-y-3 text-sm text-gray-700">
                  <div className="bg-rose-50/50 rounded-lg p-3 border border-rose-100">
                    <EditableText as="p" path="infoSheet.extracurricular.membership" value={infoSheet.extracurricular.membership} className="font-semibold text-rose-800" />
                    <EditableText as="p" path="infoSheet.extracurricular.quarterly" value={infoSheet.extracurricular.quarterly} className="text-rose-700 mt-1" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {infoSheet.extracurricular.activities.map((a: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold">
                        <EditableText as="span" path={`infoSheet.extracurricular.activities.${i}`} value={a} />
                      </span>
                    ))}
                  </div>
                  <EditableText as="p" multiline path="infoSheet.extracurricular.music" value={infoSheet.extracurricular.music} className="text-gray-700" />
                  <EditableText as="p" path="infoSheet.extracurricular.facility" value={infoSheet.extracurricular.facility} className="text-gray-700" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border-t-4 border-emerald-500 overflow-hidden">
                <div className="bg-emerald-50 px-6 py-4">
                  <EditableText as="h3" path="infoSheet.servicesTitle" value={infoSheet.servicesTitle} className="text-lg font-bold text-emerald-900" />
                </div>
                <div className="p-6">
                  <ul className="space-y-2.5">
                    {infoSheet.services.map((s: string, i: number) => (
                      <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                        <EditableText as="span" multiline path={`infoSheet.services.${i}`} value={s} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'etapes' && (
        <>
          {/* Process Steps */}
          <section className="py-16 bg-gray-50">
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

          {/* Application Form */}
          <section className="py-16 bg-white">
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
        </>
      )}



    </>
  );
};

export default AdmissionsContent;
