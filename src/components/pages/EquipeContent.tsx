import React, { useState, useRef, useEffect } from 'react';
import Hero from '@/components/ui/Hero';
import { equipeContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';
import EditableImage from '@/components/admin/EditableImage';
import { useEditSession } from '@/contexts/EditSessionContext';
import { Plus, Trash2, X } from 'lucide-react';

type EquipeData = typeof equipeContent;

const COLS = 4; // lg grid columns

const EquipeContent: React.FC = () => {
  const { value: data } = usePageJsonContent<EquipeData>('equipe', equipeContent);
  const { isEditing, updateAtPath } = useEditSession<EquipeData>() || {};
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const expandRef = useRef<HTMLDivElement>(null);

  const addMember = () => {
    if (!updateAtPath || !data) return;
    const newMembers = [
      ...data.members,
      {
        name: 'Nouveau membre',
        title: 'Titre / Fonction',
        description: 'Description du membre de l\'équipe.',
        photo: '/placeholder.svg',
      },
    ];
    updateAtPath('members', newMembers);
  };

  const removeMember = (index: number) => {
    if (!updateAtPath || !data) return;
    const member = data.members[index];
    if (!confirm(`Supprimer "${member?.name || `Membre ${index + 1}`}" ?\n\nOK pour confirmer, Annuler pour annuler.`)) return;
    const newMembers = data.members.filter((_, i) => i !== index);
    updateAtPath('members', newMembers);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    if (expandedIndex !== null && expandRef.current) {
      setTimeout(() => {
        expandRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [expandedIndex]);

  // Determine which row the expanded card is in (0-indexed)
  const expandedRow = expandedIndex !== null ? Math.floor(expandedIndex / COLS) : -1;

  // Group members into rows for Netflix-style expand
  const rows: { members: typeof data.members; startIndex: number }[] = [];
  for (let i = 0; i < data.members.length; i += COLS) {
    rows.push({ members: data.members.slice(i, i + COLS), startIndex: i });
  }

  const renderExpandedPanel = () => {
    if (expandedIndex === null) return null;
    const member = data.members[expandedIndex];
    if (!member) return null;

    return (
      <div
        ref={expandRef}
        className="col-span-full rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300 bg-[#181818] relative"
      >
        {/* Close button */}
        <button
          onClick={() => setExpandedIndex(null)}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-[#181818] border border-gray-600 hover:border-white transition-colors text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero image with gradient */}
        <div className="relative w-full aspect-[16/7] md:aspect-[16/5] overflow-hidden">
          <EditableImage
            path={`members.${expandedIndex}.photo`}
            src={member.photo}
            alt={member.name}
            folder="equipe"
            className="w-full h-full"
            imgClassName="w-full h-full object-cover object-top"
          />
          {/* Netflix-style gradient: bottom fade to dark */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />

          {/* Name + title overlaid at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
            <EditableText
              as="h2"
              path={`members.${expandedIndex}.name`}
              value={member.name}
              className="text-white text-2xl md:text-4xl font-extrabold drop-shadow-lg mb-1"
            />
            <div className="flex items-center gap-3">
              <span className="w-8 h-1 bg-orange-500 rounded-full" />
              <EditableText
                as="p"
                path={`members.${expandedIndex}.title`}
                value={member.title}
                className="text-orange-400 font-semibold text-sm md:text-lg"
              />
            </div>
          </div>
        </div>

        {/* Description area — dark background */}
        <div className="px-6 md:px-10 pb-8 pt-2">
          <EditableText
            as="p"
            multiline
            path={`members.${expandedIndex}.description`}
            value={member.description}
            className="text-gray-300 text-sm md:text-base leading-relaxed max-w-3xl"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        description={data.hero.description}
        size="medium"
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {rows.map((row, rowIdx) => (
            <React.Fragment key={rowIdx}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
                {row.members.map((member, colIdx) => {
                  const idx = row.startIndex + colIdx;
                  const isSelected = expandedIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleExpand(idx)}
                      className={`group relative rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                        isSelected ? 'ring-2 ring-orange-500 shadow-orange-100' : 'border border-gray-100'
                      }`}
                    >
                      {/* Photo */}
                      <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                        <EditableImage
                          path={`members.${idx}.photo`}
                          src={member.photo}
                          alt={member.name}
                          folder="equipe"
                          className="w-full h-full"
                          imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Admin: delete button */}
                        {isEditing && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeMember(idx);
                            }}
                            className="absolute top-2 right-2 z-30 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg"
                            title="Supprimer ce membre"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {/* Text below the image */}
                      <div className="p-3 md:p-4">
                        <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight">
                          {member.name}
                        </h3>
                        <p className="text-orange-600 text-xs md:text-sm font-medium mt-0.5">
                          {member.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Netflix-style expanded panel after the row that contains the selected card */}
              {expandedRow === rowIdx && (
                <div className="mb-4 md:mb-6">
                  {renderExpandedPanel()}
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Admin: add member button */}
          {isEditing && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={addMember}
                className="px-6 py-3 rounded-xl border-2 border-dashed border-gray-300 bg-white flex items-center gap-3 text-gray-500 hover:border-orange-500 hover:text-orange-500 transition-colors font-semibold"
              >
                <Plus className="w-6 h-6" />
                Ajouter un membre
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default EquipeContent;
