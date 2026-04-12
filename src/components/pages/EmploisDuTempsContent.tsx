import React, { useState } from 'react';
import Hero from '@/components/ui/Hero';
import { emploisDuTempsContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';
import { useEditSession } from '@/contexts/EditSessionContext';
import { Plus, Trash2, Download, FileText, Upload } from 'lucide-react';

type EdtData = typeof emploisDuTempsContent;

const EmploisDuTempsContent: React.FC = () => {
  const { value: data } = usePageJsonContent<EdtData>('emplois-du-temps', emploisDuTempsContent);
  const { isEditing, updateAtPath } = useEditSession<EdtData>() || {};
  const [activeTab, setActiveTab] = useState(0);

  const addClass = () => {
    if (!updateAtPath || !data) return;
    const newClasses = [
      ...data.classes,
      { name: 'Nouvelle classe', pdf: '/documents/emploi-du-temps-default.pdf' },
    ];
    updateAtPath('classes', newClasses);
  };

  const removeClass = (index: number) => {
    if (!updateAtPath || !data) return;
    const newClasses = data.classes.filter((_, i) => i !== index);
    updateAtPath('classes', newClasses);
    if (activeTab >= newClasses.length) setActiveTab(Math.max(0, newClasses.length - 1));
  };

  const handlePdfUpload = async (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !updateAtPath) return;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'documents');

      try {
        const token = sessionStorage.getItem('cpvf_admin_auth') || '';
        const res = await fetch('/api/upload-image/', {
          method: 'POST',
          headers: { Authorization: `Basic ${token}` },
          body: formData,
        });
        const result = await res.json();
        if (result.url) {
          updateAtPath(`classes.${index}.pdf`, result.url);
        }
      } catch {
        // fallback: keep current
      }
    };
    input.click();
  };

  const currentClass = data.classes[activeTab];

  return (
    <>
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        description={data.hero.description}
        size="medium"
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {data.classes.map((cls, index) => (
              <div key={index} className="relative group">
                <button
                  onClick={() => setActiveTab(index)}
                  className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    activeTab === index
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-orange-50 hover:text-orange-700'
                  }`}
                >
                  {isEditing ? (
                    <EditableText as="span" path={`classes.${index}.name`} value={cls.name} />
                  ) : (
                    cls.name
                  )}
                </button>
                {isEditing && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeClass(index); }}
                    className="absolute -top-2 -right-2 z-10 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    title="Supprimer cette classe"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <button
                onClick={addClass}
                className="px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-orange-500 hover:text-orange-500 transition-colors flex items-center gap-1 text-sm font-semibold"
              >
                <Plus className="w-4 h-4" /> Classe
              </button>
            )}
          </div>

          {/* PDF content area */}
          {currentClass && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <FileText className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Emploi du temps — {currentClass.name}
              </h3>
              <p className="text-gray-500 mb-8">
                Consultez ou téléchargez l'emploi du temps annuel de la classe de {currentClass.name}.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={currentClass.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-md"
                >
                  <Download className="w-5 h-5" />
                  Télécharger le PDF
                </a>
                {isEditing && (
                  <button
                    onClick={() => handlePdfUpload(activeTab)}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    Changer le PDF
                  </button>
                )}
              </div>

              {/* PDF Preview iframe */}
              <div className="mt-8 rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  src={currentClass.pdf}
                  title={`Emploi du temps ${currentClass.name}`}
                  className="w-full h-[600px]"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default EmploisDuTempsContent;
