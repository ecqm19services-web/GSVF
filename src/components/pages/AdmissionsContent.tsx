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

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={infoSheet.subtitle}
            title={infoSheet.title}
            description={infoSheet.disclaimer}
            subtitlePath="infoSheet.subtitle"
            titlePath="infoSheet.title"
            descriptionPath="infoSheet.disclaimer"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-gray-50 rounded-2xl p-6">
              <EditableText as="h3" path="infoSheet.annexFees.title" value={infoSheet.annexFees.title} className="text-lg font-bold text-gray-900 mb-4" />

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left py-2 pr-4 text-gray-600 font-semibold"> </th>
                      {infoSheet.annexFees.columns.map((col: string, i: number) => (
                        <th key={i} className="text-left py-2 pr-4 text-gray-600 font-semibold whitespace-nowrap">
                          <EditableText as="span" path={`infoSheet.annexFees.columns.${i}`} value={col} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {infoSheet.annexFees.rows.map((row: any, rowIndex: number) => (
                      <tr key={rowIndex} className="border-t border-gray-200">
                        <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">
                          <EditableText as="span" path={`infoSheet.annexFees.rows.${rowIndex}.label`} value={row.label} />
                        </td>
                        {row.values.map((v: string, colIndex: number) => (
                          <td key={colIndex} className="py-2 pr-4 text-gray-700 whitespace-nowrap">
                            <EditableText as="span" path={`infoSheet.annexFees.rows.${rowIndex}.values.${colIndex}`} value={v} />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-t border-gray-300">
                      <td className="py-2 pr-4 font-bold text-gray-900 whitespace-nowrap">
                        <EditableText as="span" path="infoSheet.annexFees.totalLabel" value={infoSheet.annexFees.totalLabel} />
                      </td>
                      {infoSheet.annexFees.totals.map((t: string, i: number) => (
                        <td key={i} className="py-2 pr-4 font-bold text-gray-900 whitespace-nowrap">
                          <EditableText as="span" path={`infoSheet.annexFees.totals.${i}`} value={t} />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6">
                <EditableText as="h3" path="infoSheet.transport.title" value={infoSheet.transport.title} className="text-lg font-bold text-gray-900 mb-4" />

                <div className="space-y-3">
                  {infoSheet.transport.routes.map((route: any, i: number) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border border-gray-200 bg-white rounded-xl p-4">
                      <EditableText as="div" multiline path={`infoSheet.transport.routes.${i}.label`} value={route.label} className="text-gray-900 font-medium" />
                      <div className="text-gray-700 whitespace-nowrap">
                        <EditableText as="span" path={`infoSheet.transport.routes.${i}.amount`} value={route.amount} />{' '}
                        <EditableText as="span" path={`infoSheet.transport.routes.${i}.currency`} value={route.currency} />{' / '}
                        <EditableText as="span" path={`infoSheet.transport.routes.${i}.period`} value={route.period} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border border-gray-200 bg-white rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <EditableText as="div" path="infoSheet.transport.canteen.label" value={infoSheet.transport.canteen.label} className="text-gray-900 font-medium" />
                  <div className="text-gray-700 whitespace-nowrap">
                    <EditableText as="span" path="infoSheet.transport.canteen.amount" value={infoSheet.transport.canteen.amount} />{' '}
                    <EditableText as="span" path="infoSheet.transport.canteen.currency" value={infoSheet.transport.canteen.currency} />{' / '}
                    <EditableText as="span" path="infoSheet.transport.canteen.period" value={infoSheet.transport.canteen.period} />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {infoSheet.transport.notes.map((n: string, i: number) => (
                    <EditableText key={i} as="p" multiline path={`infoSheet.transport.notes.${i}`} value={n} className="text-sm text-gray-600" />
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <EditableText as="h3" path="infoSheet.tuition.title" value={infoSheet.tuition.title} className="text-lg font-bold text-gray-900 mb-4" />

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2 pr-4 text-gray-600 font-semibold"> </th>
                        {infoSheet.tuition.columns.map((col: string, i: number) => (
                          <th key={i} className="text-left py-2 pr-4 text-gray-600 font-semibold whitespace-nowrap">
                            <EditableText as="span" path={`infoSheet.tuition.columns.${i}`} value={col} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {infoSheet.tuition.rows.map((row: any, rowIndex: number) => (
                        <tr key={rowIndex} className="border-t border-gray-200">
                          <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">
                            <EditableText as="span" path={`infoSheet.tuition.rows.${rowIndex}.label`} value={row.label} />
                          </td>
                          {row.values.map((v: string, colIndex: number) => (
                            <td key={colIndex} className="py-2 pr-4 text-gray-700 whitespace-nowrap">
                              <EditableText as="span" path={`infoSheet.tuition.rows.${rowIndex}.values.${colIndex}`} value={v} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <EditableText as="p" multiline path="infoSheet.tuition.note" value={infoSheet.tuition.note} className="text-sm text-gray-600 mt-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <EditableText as="h3" path="infoSheet.registrationFile.title" value={infoSheet.registrationFile.title} className="text-lg font-bold text-gray-900 mb-4" />
                  <div className="space-y-4">
                    {infoSheet.registrationFile.sections.map((sec: any, sIndex: number) => (
                      <div key={sIndex} className="bg-white rounded-xl p-4 border border-gray-200">
                        <EditableText as="h4" multiline path={`infoSheet.registrationFile.sections.${sIndex}.title`} value={sec.title} className="font-semibold text-gray-900 mb-2" />
                        <ul className="space-y-1">
                          {sec.items.map((it: string, i: number) => (
                            <li key={i} className="text-gray-700">
                              <EditableText as="span" multiline path={`infoSheet.registrationFile.sections.${sIndex}.items.${i}`} value={it} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    {infoSheet.registrationFile.notes.map((n: string, i: number) => (
                      <EditableText key={i} as="p" multiline path={`infoSheet.registrationFile.notes.${i}`} value={n} className="text-sm text-gray-600" />
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <EditableText as="h3" path="infoSheet.uniforms.title" value={infoSheet.uniforms.title} className="text-lg font-bold text-gray-900 mb-4" />
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <EditableText as="h4" path="infoSheet.uniforms.girlsTitle" value={infoSheet.uniforms.girlsTitle} className="font-semibold text-gray-900 mb-2" />
                        <ul className="space-y-1">
                          {infoSheet.uniforms.girls.map((it: string, i: number) => (
                            <li key={i} className="text-gray-700">
                              <EditableText as="span" multiline path={`infoSheet.uniforms.girls.${i}`} value={it} />
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <EditableText as="h4" path="infoSheet.uniforms.boysTitle" value={infoSheet.uniforms.boysTitle} className="font-semibold text-gray-900 mb-2" />
                        <ul className="space-y-1">
                          {infoSheet.uniforms.boys.map((it: string, i: number) => (
                            <li key={i} className="text-gray-700">
                              <EditableText as="span" multiline path={`infoSheet.uniforms.boys.${i}`} value={it} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <EditableText as="h3" path="infoSheet.extracurricular.title" value={infoSheet.extracurricular.title} className="text-lg font-bold text-gray-900 mb-4" />
                    <div className="space-y-2 text-gray-700">
                      <EditableText as="p" path="infoSheet.extracurricular.membership" value={infoSheet.extracurricular.membership} />
                      <EditableText as="p" path="infoSheet.extracurricular.quarterly" value={infoSheet.extracurricular.quarterly} />
                      <div className="flex flex-wrap gap-2">
                        {infoSheet.extracurricular.activities.map((a: string, i: number) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-white border border-gray-200 text-sm">
                            <EditableText as="span" path={`infoSheet.extracurricular.activities.${i}`} value={a} />
                          </span>
                        ))}
                      </div>
                      <EditableText as="p" multiline path="infoSheet.extracurricular.music" value={infoSheet.extracurricular.music} />
                      <EditableText as="p" path="infoSheet.extracurricular.facility" value={infoSheet.extracurricular.facility} />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <EditableText as="h3" path="infoSheet.servicesTitle" value={infoSheet.servicesTitle} className="text-lg font-bold text-gray-900 mb-4" />
                    <ul className="space-y-1">
                      {infoSheet.services.map((s: string, i: number) => (
                        <li key={i} className="text-gray-700">
                          <EditableText as="span" multiline path={`infoSheet.services.${i}`} value={s} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
